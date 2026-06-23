'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface ChatWidgetProps {
  agentName: string;
  agentEmoji: string;
  tagline: string;
  endpoint: string;
  ctas: Array<{ icon: string; label: string }>;
  extraBody?: Record<string, unknown>;
  accentClass?: string;
}

export function ChatWidget({
  agentName,
  agentEmoji,
  tagline,
  endpoint,
  ctas,
  extraBody = {},
  accentClass = 'bg-green-600',
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `¡Hola! Soy **${agentName}** 👋\n${tagline}\n\n¿En qué puedo ayudarte hoy?`,
      }]);
    }
  }, [open, agentName, tagline, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setStreaming(true);

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
    setMessages([...history, assistantMsg]);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          conversationId,
          ...extraBody,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      if (!res.body) throw new Error('No stream body');

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });

        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') break;
          try {
            const parsed = JSON.parse(payload);
            fullContent += parsed.content ?? '';
            if (parsed.conversationId && !conversationId) {
              setConversationId(parsed.conversationId);
            }
            setMessages(prev => {
              const next = [...prev];
              next[next.length - 1] = { role: 'assistant', content: fullContent };
              return next;
            });
          } catch {}
        }
      }
    } catch (e: any) {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content: `Lo siento, ocurrió un error. Intenta de nuevo.\n\n_${e.message}_`,
        };
        return next;
      });
    } finally {
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, streaming, endpoint, conversationId, extraBody]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full ${accentClass} text-white shadow-lg flex items-center justify-center text-2xl hover:scale-105 transition-transform`}
        aria-label={`Abrir ${agentName}`}
      >
        {open ? '✕' : agentEmoji}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[580px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`${accentClass} text-white px-4 py-3 flex items-center gap-3`}>
            <span className="text-2xl">{agentEmoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">{agentName}</p>
              <p className="text-xs opacity-80 truncate">{tagline}</p>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-70 hover:opacity-100 text-lg leading-none">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br>'),
                  }}
                />
              </div>
            ))}
            {streaming && messages[messages.length - 1]?.content === '' && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* CTAs (only when no messages beyond welcome) */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 grid grid-cols-1 gap-1 bg-gray-50 max-h-36 overflow-y-auto">
              {ctas.slice(0, 5).map((cta, i) => (
                <button
                  key={i}
                  onClick={() => send(cta.label)}
                  className="text-left text-xs px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-colors flex items-center gap-2"
                >
                  <span>{cta.icon}</span>
                  <span className="text-gray-700 leading-tight">{cta.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 bg-white p-2 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu pregunta..."
              disabled={streaming}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-green-500 disabled:opacity-50 max-h-28 overflow-y-auto"
              style={{ minHeight: '38px' }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || streaming}
              className={`w-9 h-9 rounded-xl ${accentClass} text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
