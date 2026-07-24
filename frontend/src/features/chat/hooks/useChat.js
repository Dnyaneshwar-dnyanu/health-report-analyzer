import { useState, useRef, useEffect } from 'react';
import { useReportContext } from '../../../context/ReportContext';

export const useChat = () => {
  const { chatHistory, setChatHistory, askAI } = useReportContext();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const newUserMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText
    };

    // Save user message to global context
    setChatHistory(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Direct call to FastAPI Groq RAG chat route
      const answer = await askAI(userText);
      
      const newAiMsg = {
        id: `ai-${Date.now()}`,
        role: 'system',
        content: answer
      };
      setChatHistory(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Chat Query Error:", error);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'system',
        content: `Sorry, I encountered an error processing your question: ${error.message}`
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    messages: chatHistory,
    input,
    setInput,
    isTyping,
    messagesEndRef,
    handleSend,
    handleKeyDown
  };
};
