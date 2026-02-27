import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Keep ChatWindow mounted to preserve conversation state */}
      <div className={isOpen ? '' : 'hidden'}>
        <ChatWindow onClose={() => setIsOpen(false)} />
      </div>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 animate-ping opacity-20" />
        </button>
      )}
    </>
  );
}
