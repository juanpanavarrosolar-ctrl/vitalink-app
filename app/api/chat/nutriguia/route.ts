import { NextRequest } from 'next/server';
import { getGroq, GROQ_MODEL } from '@/lib/groq';
import { NUTRIGUIA_SYSTEM_PROMPT, buildNutriGuiaContext } from '@/lib/agents/nutriguia';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, planToken } = body as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
      planToken?: string;
    };

    if (!messages?.length) return new Response('messages required', { status: 400 });

    const lastMsg = messages[messages.length - 1];
    if ((lastMsg?.content?.length ?? 0) > 1000) return new Response('Mensaje demasiado largo', { status: 400 });
    if (messages.length > 50) return new Response('Historial demasiado largo', { status: 400 });

    let contextSuffix = '';
    if (planToken) {
      const supabase = serviceRole();
      const { data: plan } = await supabase
        .from('plans')
        .select('title, patients(name), professionals(full_name), plan_items(instructions, products(name))')
        .eq('public_token', planToken)
        .single();

      if (plan) {
        contextSuffix = buildNutriGuiaContext({
          patientName: (plan.patients as any)?.name,
          professionalName: (plan.professionals as any)?.full_name,
          planTitle: plan.title,
          items: ((plan.plan_items as any[]) ?? []).map((i: any) => ({
            name: i.products?.name ?? '',
            instructions: i.instructions ?? '',
          })),
        });
      }
    }

    const systemPrompt = NUTRIGUIA_SYSTEM_PROMPT + contextSuffix;
    const groq = getGroq();

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      stream: true,
      temperature: 0.5,
      max_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? '';
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
            }
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
