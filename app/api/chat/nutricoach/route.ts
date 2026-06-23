import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGroq, GROQ_MODEL } from '@/lib/groq';
import { NUTRICOACH_SYSTEM_PROMPT, buildNutriCoachContext } from '@/lib/agents/nutricoach-pro';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { messages, conversationId, patientId, planId } = body as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
      conversationId?: string;
      patientId?: string;
      planId?: string;
    };

    if (!messages?.length) return new Response('messages required', { status: 400 });

    // Build context from patient/plan if provided
    let contextSuffix = '';
    if (patientId || planId) {
      const [patientRes, planRes] = await Promise.all([
        patientId
          ? supabase.from('patients').select('name').eq('id', patientId).single()
          : Promise.resolve({ data: null }),
        planId
          ? supabase.from('plans').select('title, plan_items(quantity, instructions, products(name, compound, dosage))').eq('id', planId).single()
          : Promise.resolve({ data: null }),
      ]);
      contextSuffix = buildNutriCoachContext({
        patientName: (patientRes.data as any)?.name,
        planTitle: (planRes.data as any)?.title,
        items: ((planRes.data as any)?.plan_items ?? []).map((i: any) => ({
          name: i.products?.name ?? '',
          compound: i.products?.compound ?? '',
          dosage: i.products?.dosage ?? '',
          instructions: i.instructions ?? '',
        })),
      });
    }

    const systemPrompt = NUTRICOACH_SYSTEM_PROMPT + contextSuffix;

    // Save conversation & user message
    let convId = conversationId;
    if (!convId) {
      const { data: conv } = await supabase.from('agent_conversations').insert({
        user_id: user.id,
        agent_type: 'nutricoach_pro',
        title: messages[0]?.content?.slice(0, 80) ?? 'Nueva consulta',
        patient_id: patientId ?? null,
        plan_id: planId ?? null,
      }).select('id').single();
      convId = conv?.id;
    }

    const lastUserMsg = messages[messages.length - 1];
    if (convId && lastUserMsg?.role === 'user') {
      await supabase.from('agent_messages').insert({
        conversation_id: convId,
        role: 'user',
        content: lastUserMsg.content,
      });
    }

    const groq = getGroq();
    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      stream: true,
      temperature: 0.4,
      max_tokens: 2048,
    });

    const encoder = new TextEncoder();
    let fullContent = '';
    let totalTokens = 0;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? '';
            if (delta) {
              fullContent += delta;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta, conversationId: convId })}\n\n`));
            }
            const usage = (chunk as any).usage;
            if (usage) totalTokens = usage.total_tokens ?? 0;
          }
          // Save assistant response
          if (convId && fullContent) {
            await supabase.from('agent_messages').insert({
              conversation_id: convId,
              role: 'assistant',
              content: fullContent,
              tokens_used: totalTokens,
            });
            await supabase.from('agent_conversations').update({ updated_at: new Date().toISOString() }).eq('id', convId);
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
