import { useState, useRef, useEffect } from 'react';
import { mockChatHistory } from '../data/mockChatHistory';

export const useChat = () => {
  const [messages, setMessages] = useState(mockChatHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      const newAiMsg = {
        id: Date.now() + 1,
        role: 'system',
        content: 'This is a mocked AI response. In production, this text will stream directly from the FastAPI LLM endpoint.'
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages,
    input,
    setInput,
    isTyping,
    messagesEndRef,
    handleSend,
    handleKeyDown
  };
};
