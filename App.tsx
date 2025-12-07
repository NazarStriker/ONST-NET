import React, { useState } from 'react';
import { generatePersona, createHackerChat } from './services/geminiService';
import { CyberPersona, ScanStatus, Language } from './types';
import { ScanAnimation } from './components/ScanAnimation';
import { ResultCard } from './components/ResultCard';
import { ChatInterface } from './components/ChatInterface';
import { DisclaimerModal } from './components/DisclaimerModal';
import { MatrixBackground } from './components/MatrixBackground'; 
import { Chat } from "@google/genai";

const App: React.FC = () => {
  const [targetId, setTargetId] = useState('');
  const [lang, setLang] = useState<Language>('ru'); 
  const [status, setStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<CyberPersona | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  // Disclaimer Lock State
  const [isLocked, setIsLocked] = useState(true);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const runOsintSequence = async (username: string) => {
    setStatus(ScanStatus.SCANNING);
    setLogs([]);
    setError(null);
    setResult(null);
    setChatSession(null);

    // Extended, Deep Scan sequence
    const sequence = [
      { msg: `INITIALIZING TARGET LOCK: ${username}`, delay: 200 },
      { msg: "ESTABLISHING SECURE PROXY CHAIN...", delay: 800 },
      { msg: "BYPASSING SOCIAL MEDIA API RATE LIMITS...", delay: 1800 },
      { msg: "INJECTING SEARCH QUERIES [TIKTOK, INSTA, X]...", delay: 2800 },
      { msg: "HARVESTING PUBLIC METADATA...", delay: 3800 },
      { msg: "DEEP PACKET INSPECTION...", delay: 5000 },
      { msg: "CORRELATING USERNAME PATTERNS...", delay: 6500 },
      { msg: "ANALYZING BIO LINKS & REFERRALS...", delay: 8000 },
      { msg: "BRUTE-FORCING HIDDEN DIRECTORIES...", delay: 9500 },
      { msg: "DECRYPTING FINAL DATA PACKET...", delay: 11000 },
    ];

    const apiPromise = generatePersona(username, lang).catch(e => {
        console.error(e);
        return null;
    });

    let maxTime = 12000; 
    
    for (const step of sequence) {
       setTimeout(() => {
          addLog(step.msg);
          if (step.msg.includes("SCANNING") || step.msg.includes("INITIALIZING")) setStatus(ScanStatus.SCANNING);
          if (step.msg.includes("ANALYZING") || step.msg.includes("CORRELATING")) setStatus(ScanStatus.ANALYZING);
          if (step.msg.includes("DECRYPTING")) setStatus(ScanStatus.DECRYPTING);
       }, step.delay);
    }

    const startTime = Date.now();
    
    try {
        const data = await apiPromise;
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, maxTime - elapsedTime);

        setTimeout(() => {
            if (data) {
                setResult(data);
                setChatSession(createHackerChat(data, lang));
                setStatus(ScanStatus.COMPLETE);
                addLog("DATA RENDERED SUCCESSFULLY.");
            } else {
                setError("CONNECTION TERMINATED. TARGET UNRESPONSIVE.");
                setStatus(ScanStatus.ERROR);
            }
        }, remainingTime);

    } catch (err) {
        setTimeout(() => {
            setError("CRITICAL ERROR IN NEURAL LINK.");
            setStatus(ScanStatus.ERROR);
        }, 1000);
    }
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) return;
    
    if (!targetId.startsWith('@')) {
        setError("SYNTAX ERROR: HANDLE MUST START WITH '@'");
        setStatus(ScanStatus.ERROR);
        return;
    }
    
    runOsintSequence(targetId);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Background Ambience - Now with Matrix */}
      <div className="fixed inset-0 z-[-1] bg-[#050505]">
          <MatrixBackground /> 
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,30,0,0.2)_0%,_rgba(0,0,0,0.8)_100%)]"></div>
      </div>

      {/* DISCLAIMER MODAL OVERLAY */}
      {isLocked && (
        <DisclaimerModal 
            onAccept={() => setIsLocked(false)} 
            lang={lang} 
            setLang={setLang}
        />
      )}

      {/* Main Content Wrapper - Blurred when locked */}
      <div className={`w-full flex flex-col items-center justify-center transition-all duration-700 ${isLocked ? 'blur-lg scale-95 opacity-30 pointer-events-none' : 'blur-0 scale-100 opacity-100'}`}>

        {/* Language Switcher - Styled as HUD Element */}
        {status === ScanStatus.IDLE && (
            <div className="absolute top-6 right-6 z-50 flex items-center gap-2 animate-[fadeIn_0.5s_ease-out]">
            <span className="text-[9px] text-green-900 font-mono tracking-widest hidden md:inline-block">SYS_LOCALE:</span>
            <div className="flex border border-green-900 bg-black">
                <button 
                    onClick={() => setLang('en')} 
                    className={`px-3 py-1 text-xs font-mono font-bold transition-all duration-300 ${lang === 'en' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(0,255,0,0.5)]' : 'text-gray-600 hover:text-green-400'}`}
                >
                    EN
                </button>
                <div className="w-[1px] bg-green-900"></div>
                <button 
                    onClick={() => setLang('ru')} 
                    className={`px-3 py-1 text-xs font-mono font-bold transition-all duration-300 ${lang === 'ru' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(0,255,0,0.5)]' : 'text-gray-600 hover:text-green-400'}`}
                >
                    RU
                </button>
            </div>
            </div>
        )}

        {status === ScanStatus.IDLE && (
            <div className="max-w-xl w-full text-center space-y-8 animate-[fadeIn_1s_ease-in] relative z-10">
            <div className="mb-16">
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-800 drop-shadow-[0_0_15px_rgba(0,255,0,0.4)] glitch-text" data-text="NEON TRACE">
                NEON TRACE
                </h1>
                <p className="text-green-600/60 mt-4 tracking-[0.4em] uppercase text-[10px] font-bold">
                OSINT PUBLIC DATA ANALYZER V3.1 PRO
                </p>
            </div>

            {/* Redesigned Input Form Area */}
            <div className="relative">
                {/* Decorative lines connecting to the form */}
                <div className="absolute -top-8 left-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent to-green-900"></div>
                
                <div className="border border-green-900/50 bg-black/80 p-8 backdrop-blur-md relative group shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-green-500/30">
                    
                    {/* Tech Corners */}
                    <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-green-600"></div>
                    <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-green-600"></div>
                    <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-green-600"></div>
                    <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-green-600"></div>

                    <form onSubmit={handleStart} className="space-y-6">
                    
                    <div className="relative">
                        <div className="text-left text-[9px] text-green-700 mb-1 font-mono tracking-widest pl-1">TARGET_PARAMETER:</div>
                        <input 
                        type="text" 
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        placeholder={lang === 'ru' ? "ВВЕДИТЕ @USERNAME" : "ENTER @USERNAME"}
                        className="w-full bg-[#0a0a0a] border border-green-900/60 text-green-400 p-4 text-center text-xl focus:outline-none focus:border-green-500 focus:bg-green-900/10 transition-all placeholder-green-900/50 uppercase tracking-widest font-mono shadow-inner"
                        autoFocus
                        />
                        {/* Blinking cursor line at bottom of input */}
                        <div className="absolute bottom-0 left-0 h-[2px] bg-green-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={!targetId}
                        className="relative w-full overflow-hidden group border border-green-700/50 px-8 py-4 bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {/* Hover fill effect */}
                        <div className="absolute inset-0 w-full h-full bg-green-500 transition-all duration-300 ease-out transform translate-y-full group-hover:translate-y-0"></div>
                        
                        <span className="relative group-hover:text-black font-bold tracking-[0.3em] transition-colors duration-300 uppercase text-sm md:text-base text-green-500">
                             {lang === 'ru' ? ':: ЗАПУСТИТЬ ПРОТОКОЛ ::' : ':: EXECUTE PROTOCOL ::'}
                        </span>
                    </button>
                    </form>
                    
                    <div className="absolute -bottom-6 right-0 text-[8px] text-gray-700 font-mono tracking-widest">
                        SECURE_CONNECTION: <span className="text-green-800">TRUE</span>
                    </div>
                </div>
            </div>
            
            <div className="text-[9px] text-gray-600 max-w-md mx-auto mt-16 uppercase tracking-[0.2em] font-mono">
                System Status: <span className="text-green-500 animate-pulse">ONLINE</span> &nbsp;//&nbsp; 
                Nodes: <span className="text-green-500">14/14</span>
            </div>
            </div>
        )}

        {(status === ScanStatus.SCANNING || status === ScanStatus.DECRYPTING || status === ScanStatus.ANALYZING) && (
            <div className="w-full flex justify-center animate-[slideUp_0.3s_ease-out]">
                <ScanAnimation logs={logs} status={status} />
            </div>
        )}

        {status === ScanStatus.COMPLETE && result && (
            <>
            <ResultCard data={result} reset={() => setStatus(ScanStatus.IDLE)} lang={lang} />
            {/* Chat Interface overlays everything once complete */}
            {chatSession && <ChatInterface chatSession={chatSession} lang={lang} />}
            </>
        )}

        {status === ScanStatus.ERROR && (
            <div className="text-center space-y-6">
            <div className="text-red-500 text-6xl mb-4 animate-[pulse_0.2s_infinite]">⚠</div>
            <div className="text-red-500 text-xl tracking-widest uppercase border-2 border-red-500 p-6 bg-red-900/10 backdrop-blur-sm font-mono shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                {error || "CRITICAL FAILURE"}
            </div>
            <button 
                onClick={() => setStatus(ScanStatus.IDLE)}
                className="px-8 py-3 bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors uppercase text-xs tracking-widest"
            >
                {lang === 'ru' ? 'СБРОС ТЕРМИНАЛА' : 'RESET TERMINAL'}
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;