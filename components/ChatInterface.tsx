import React, { useState, useRef, useEffect } from 'react';
import { Chat } from "@google/genai";
import { ChatMessage, Language } from '../types';

interface ChatInterfaceProps {
  chatSession: Chat;
  lang: Language;
}

const TERMINAL_LINES_EN = [
  "> PINGING TIKTOK SERVERS...",
  "> BYPASSING INSTAGRAM AUTH...",
  "> ANALYZING DISCORD INVITES...",
  "> DECRYPTING GEO-TAGS...",
  "> SEARCHING PUBLIC DATABASES...",
  "> CORRELATING USERNAMES..."
];

const TERMINAL_LINES_RU = [
  "> ПИНГ TIKTOK СЕРВЕРОВ...",
  "> ОБХОД АВТОРИЗАЦИИ INSTAGRAM...",
  "> АНАЛИЗ DISCORD ИНВАЙТОВ...",
  "> ДЕШИФРОВКА ГЕО-МЕТОК...",
  "> ПОИСК В ПУБЛИЧНЫХ БАЗАХ...",
  "> КОРРЕЛЯЦИЯ НИКНЕЙМОВ..."
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatSession, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'init', 
      sender: 'hacker', 
      text: lang === 'ru' 
        ? "Йо. Я нарыл кое-что. Если нужно копнуть глубже или есть вопросы по этому юзеру — пиши. Я на связи. 👁️" 
        : "Yo. I dug up what I could. If you need me to go deeper or have questions about this target, hit me up. I'm online. 👁️" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [terminalLine, setTerminalLine] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    if(isOpen && !isTyping) {
        inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping]);

  // Terminal Animation Effect
  useEffect(() => {
    if (isTyping) {
      const lines = lang === 'ru' ? TERMINAL_LINES_RU : TERMINAL_LINES_EN;
      let i = 0;
      const interval = setInterval(() => {
        setTerminalLine(lines[i % lines.length]);
        i++;
      }, 500); // Change line every 500ms
      return () => clearInterval(interval);
    }
  }, [isTyping, lang]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate "Thinking" delay to show the animation if the API is too fast
      const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const apiCall = chatSession.sendMessage({ message: userMsg.text });
      
      const [response] = await Promise.all([apiCall, minDelay]);

      const hackerMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        sender: 'hacker', 
        text: response.text 
      };
      setMessages(prev => [...prev, hackerMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'hacker', 
        text: lang === 'ru' ? "Связь прервана... Ошибка сети." : "Connection drop... Network error." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to parse bold text **text** to JSX
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-green-300 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Glitch Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-black border-2 border-green-500 rounded-none flex items-center justify-center shadow-[0_0_20px_rgba(0,255,0,0.4)] group overflow-hidden animate-[bounce_2s_infinite]"
        >
          <div className="absolute inset-0 bg-green-500/20 group-hover:bg-green-500/40 transition-colors"></div>
          <span className="text-2xl animate-[pulse_0.2s_infinite]">💬</span>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:items-end md:justify-end md:p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full md:w-[500px] h-[70vh] md:h-[650px] max-h-[90vh] flex flex-col bg-[#050505] border border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.2)] relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            
            {/* Header */}
            <div className="h-10 border-b border-green-800 flex justify-between items-center px-4 bg-green-900/10 select-none shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 animate-pulse shadow-[0_0_5px_#00ff41]"></div>
                <span className="font-mono text-green-500 font-bold tracking-[0.2em] uppercase text-[10px]">
                    NEON // SECURE_CHANNEL
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-green-800 hover:text-red-500 font-bold transition-colors text-xs font-mono"
              >
                [ X ]
              </button>
            </div>

            {/* CRT Scanline Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[60] bg-[length:100%_2px,3px_100%]"></div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 font-mono text-sm relative z-10 custom-scrollbar bg-[radial-gradient(#0a0a0a_1px,transparent_1px)] bg-[size:20px_20px]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`text-[9px] uppercase mb-1 tracking-widest ${msg.sender === 'user' ? 'text-gray-500' : 'text-green-700'}`}>
                    {msg.sender === 'user' ? 'YOU' : 'NEON'}
                  </div>
                  <div className={`max-w-[90%] p-4 border relative whitespace-pre-wrap ${msg.sender === 'user' 
                    ? 'border-gray-700 bg-gray-900/30 text-gray-300' 
                    : 'border-green-600 bg-green-900/10 text-green-400 shadow-[0_0_15px_rgba(0,255,0,0.1)]'}`}>
                    
                    {/* Decorative bits */}
                    <div className={`absolute top-0 w-2 h-2 border-t ${msg.sender === 'user' ? 'right-0 border-r border-gray-500' : 'left-0 border-l border-green-500'}`}></div>
                    <div className={`absolute bottom-0 w-2 h-2 border-b ${msg.sender === 'user' ? 'left-0 border-l border-gray-500' : 'right-0 border-r border-green-500'}`}></div>
                    
                    {formatText(msg.text)}
                  </div>
                </div>
              ))}
              
              {/* Thinking Animation Block */}
              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className="w-full max-w-[85%] p-4 border-l-2 border-green-500 bg-black/80 font-mono text-xs text-green-400 mt-2">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="animate-[spin_1s_linear_infinite]">↻</span>
                        <span className="font-bold uppercase tracking-widest">{lang === 'ru' ? 'активный поиск' : 'ACTIVE SCANNING'}</span>
                     </div>
                     <div className="opacity-90 pl-4 text-green-300">
                        {terminalLine}
                     </div>
                     {/* Fake progress bar */}
                     <div className="w-full h-2 bg-green-900/30 mt-3 border border-green-900/50">
                        <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out_infinite] shadow-[0_0_10px_#00ff41]"></div>
                     </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Area - Pure Terminal Style */}
            <form onSubmit={handleSend} className="p-4 border-t border-green-800 bg-black relative z-20 shrink-0">
              <div className="flex gap-2 items-center">
                <span className="text-green-500 font-bold animate-pulse">{'>'}</span>
                <input 
                  ref={inputRef}
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={lang === 'ru' ? "Отправить команду..." : "Send command..."}
                  className="flex-1 bg-transparent border-none text-green-400 p-0 text-sm focus:ring-0 focus:outline-none placeholder-green-900 font-mono tracking-wider caret-green-500"
                  autoComplete="off"
                />
                <button 
                  type="submit" 
                  className="opacity-50 hover:opacity-100 text-green-500 transition-opacity"
                >
                  [ENTER]
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};