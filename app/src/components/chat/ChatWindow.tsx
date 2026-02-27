import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, MessageCircle, ArrowDown } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface QuickReply {
  label: string;
  value: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content:
    'Olá! Sou o assistente da AIPF. Posso te ajudar a entender como IA estruturada pode gerar resultados reais no seu negócio.\n\nEm qual área da sua empresa IA teria maior impacto?',
};

const AREA_REPLIES: QuickReply[] = [
  { label: 'Operações', value: 'Operações' },
  { label: 'Atendimento', value: 'Atendimento' },
  { label: 'Comercial', value: 'Comercial' },
  { label: 'Jurídico', value: 'Jurídico / Compliance' },
  { label: 'Financeiro', value: 'Financeiro / Backoffice' },
  { label: 'Tecnologia', value: 'Tecnologia / Dados' },
];

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setShowQuickReplies(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let assistantContent = '';
      let buffer = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      }
    } catch {
      const errorMsg =
        'Desculpe, tive um problema ao processar sua mensagem. Tente novamente ou entre em contato pelo email contato@aipf.com.br.';
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === 'assistant' && !last.content) {
          updated[updated.length - 1] = { role: 'assistant', content: errorMsg };
        } else {
          updated.push({ role: 'assistant', content: errorMsg });
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.value);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] flex flex-col rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/40 animate-slide-up">
      {/* Backdrop blur background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/90" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-violet-500" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">Assistente AIPF</span>
            <span className="text-xs text-slate-400 block">AI Performance Framework</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Fechar chat"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-500/30'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Quick replies */}
        {showQuickReplies && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {AREA_REPLIES.map((reply) => (
              <button
                key={reply.value}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom indicator */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 p-1.5 rounded-full bg-slate-800 border border-slate-700 shadow-lg z-10"
        >
          <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 px-3 py-2.5 border-t border-slate-700/50"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Enviar mensagem"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
