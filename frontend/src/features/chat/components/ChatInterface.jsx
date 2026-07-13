import { FiSend, FiMoreHorizontal } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';

export const ChatInterface = () => {
  const {
    messages,
    input,
    setInput,
    isTyping,
    messagesEndRef,
    handleSend,
    handleKeyDown
  } = useChat();

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px] w-full max-w-4xl mx-auto bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
      
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-card)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-purple-500 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div>
            <h2 className="font-bold">BloodAI Assistant</h2>
            <p className="text-xs text-[var(--color-success)] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] inline-block" /> Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex gap-4 mb-6"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center">
              <FiMoreHorizontal className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm px-5 py-3 flex items-center gap-1 text-[var(--color-muted)]">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--color-card)] border-t border-[var(--color-border)]">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your blood report..."
            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] resize-none h-12 flex-shrink-0 transition-colors"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-[var(--color-muted)] text-center mt-2">
          AI can make mistakes. Always verify medical advice with a healthcare professional.
        </p>
      </div>
    </div>
  );
};
