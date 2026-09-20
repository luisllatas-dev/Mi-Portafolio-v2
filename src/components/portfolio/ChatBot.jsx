import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Trash2 } from "lucide-react";

const MAX_QUESTIONS = 5;
const STORAGE_KEY = "nani_chat_state";
// Backend Azure (Managed Identity) o fallback local/Vercel
const CHAT_API = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

const loadState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], asked: 0 };
    const parsed = JSON.parse(raw);
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      asked: Number(parsed.asked) || 0,
    };
  } catch {
    return { messages: [], asked: 0 };
  }
};

const saveState = (state) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
};

const WELCOME = {
  role: "assistant",
  content:
    "Hola, soy Nani, el asistente de Luis. Puedo responder sobre su experiencia, stack y proyectos. ¿Qué quieres saber?",
};

const SUGGESTIONS = [
  "¿Qué tecnologías maneja Luis?",
  "¿En qué proyectos ha trabajado?",
  "¿Cómo puedo contactarlo?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [asked, setAsked] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const s = loadState();
    setMessages(s.messages.length ? s.messages : [WELCOME]);
    setAsked(s.asked);
  }, []);

  useEffect(() => {
    saveState({ messages, asked });
  }, [messages, asked]);

  useEffect(() => {
    if (open) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, loading]);

  const limitReached = asked >= MAX_QUESTIONS;

  const send = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading || limitReached) return;

    setError(null);
    setInput("");

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, asked }),
      });
      const data = await res.json().catch(() => ({}));
      // FastAPI usa { detail: {...} }; la API de Vercel usa el body directo
      const err = data.detail && typeof data.detail === "object" ? data.detail : data;

      if (!res.ok) {
        if (res.status === 429 || err?.limitReached) {
          setAsked(MAX_QUESTIONS);
          setMessages((m) => [
            ...m,
            { role: "assistant", content: err.error || "Límite de preguntas alcanzado." },
          ]);
          return;
        }
        throw new Error(err?.error || "No se pudo contactar al asistente");
      }

      setMessages((m) => [...m, { role: "assistant", content: data.reply || "…" }]);
      setAsked(data.asked ?? asked + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([WELCOME]);
    setAsked(0);
    setError(null);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente Nani"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#08080A] border border-[#00E5FF]/60 text-[#00E5FF] flex items-center justify-center glow-cyan hover:bg-[#00E5FF]/10 transition-all duration-300"
      >
        {open ? <X size={22} /> : <Bot size={24} strokeWidth={1.75} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#7C3AED] animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(520px,70vh)] flex flex-col rounded-2xl border border-[#00E5FF]/25 bg-[#08080A]/95 backdrop-blur-xl overflow-hidden glow-cyan">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F4F8]/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 flex items-center justify-center">
                <Bot size={16} className="text-[#00E5FF]" />
              </div>
              <div>
                <div className="font-mono-tech text-xs uppercase tracking-widest text-[#F0F4F8]">
                  Nani
                </div>
                <div className="font-mono-tech text-[10px] text-[#64748B]">
                  Asistente · CV de Luis
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Reiniciar conversación"
              className="text-[#64748B] hover:text-[#00E5FF] transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#7C3AED]/25 border border-[#7C3AED]/40 text-[#F0F4F8]"
                      : "bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#94A3B8]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 font-mono-tech text-xs text-[#00E5FF]">
                  <span className="animate-pulse">Nani está escribiendo…</span>
                </div>
              </div>
            )}

            {!loading && !limitReached && messages.length <= 1 && (
              <div className="pt-2 space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full text-left font-mono-tech text-[11px] text-[#64748B] hover:text-[#00E5FF] border border-[#F0F4F8]/10 hover:border-[#00E5FF]/40 rounded-lg px-3 py-2 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#F0F4F8]/10 px-4 py-3">
            {error && (
              <div className="mb-2 font-mono-tech text-[11px] text-[#F87171]">{error}</div>
            )}
            {limitReached ? (
              <div className="font-mono-tech text-[11px] text-[#64748B] text-center">
                Límite de {MAX_QUESTIONS} preguntas alcanzado.{" "}
                <button
                  type="button"
                  onClick={reset}
                  className="text-[#00E5FF] hover:underline"
                >
                  Reiniciar
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre Luis…"
                  maxLength={500}
                  disabled={loading}
                  className="flex-1 bg-transparent border border-[#F0F4F8]/15 focus:border-[#00E5FF]/50 rounded-lg px-3 py-2 font-mono-tech text-xs text-[#F0F4F8] placeholder:text-[#64748B] outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Enviar"
                  className="w-9 h-9 rounded-lg border border-[#00E5FF]/50 text-[#00E5FF] flex items-center justify-center hover:bg-[#00E5FF]/10 disabled:opacity-40 transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
            <div className="mt-2 font-mono-tech text-[10px] text-[#64748B] text-center">
              {asked}/{MAX_QUESTIONS} preguntas
            </div>
          </div>
        </div>
      )}
    </>
  );
}
