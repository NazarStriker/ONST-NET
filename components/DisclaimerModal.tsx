import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface DisclaimerModalProps {
  onAccept: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept, lang, setLang }) => {
  const [canEnter, setCanEnter] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake "Security Protocol" loading to force user to look at the screen for 2.5s
    const duration = 2500;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const pct = Math.min((currentStep / steps) * 100, 100);
      setProgress(pct);

      if (currentStep >= steps) {
        setCanEnter(true);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const t = {
    en: {
      title: "NEURAL STABILITY WARNING",
      subtitle: "MANDATORY PROTOCOL READ",
      body_1: "The 'NEON TRACE' module uses experimental generative AI (Gemini 3.0) for OSINT analysis.",
      body_2: "ACCURACY DISCLAIMER: AI is probabilistic. It may occasionally 'hallucinate' (generate plausible but incorrect links). This does NOT mean all data is fake, but verification is required.",
      body_3: "User assumes full responsibility for manually verifying all extracted endpoints.",
      btn_wait: "LOADING SECURITY PROTOCOLS...",
      btn_enter: "I UNDERSTAND // INITIALIZE SYSTEM"
    },
    ru: {
      title: "ПРЕДУПРЕЖДЕНИЕ О ТОЧНОСТИ",
      subtitle: "ОБЯЗАТЕЛЬНО К ПРОЧТЕНИЮ",
      body_1: "Модуль 'NEON TRACE' использует экспериментальный ИИ (Gemini 3.0) для анализа открытых данных.",
      body_2: "ВАЖНО: ИИ работает на основе вероятностей. Возможны 'галлюцинации' (правдоподобные, но несуществующие ссылки). Это НЕ значит, что все данные ложные, но ручная проверка обязательна.",
      body_3: "Используя систему, вы подтверждаете, что будете проверять найденную информацию вручную.",
      btn_wait: "ЗАГРУЗКА ПРОТОКОЛОВ БЕЗОПАСНОСТИ...",
      btn_enter: "Я ПОНЯЛ // ЗАПУСТИТЬ СИСТЕМУ"
    }
  };

  const txt = t[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>

      <div className="relative w-full max-w-2xl bg-black border-2 border-red-600 shadow-[0_0_100px_rgba(255,0,0,0.3)] p-1 overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        
        {/* Animated Background Grid within modal */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="relative z-10 bg-black/80 p-6 md:p-10 flex flex-col items-center text-center">
            
            {/* Header Glitch */}
            <div className="mb-8 relative">
                 <h1 className="text-3xl md:text-5xl font-bold text-red-500 tracking-tighter glitch-text" data-text={txt.title}>
                    {txt.title}
                 </h1>
                 <div className="w-full h-1 bg-red-600 mt-4 shadow-[0_0_10px_red]"></div>
            </div>

            {/* Language Switcher */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button 
                    onClick={() => setLang('en')}
                    className={`px-2 py-1 text-[10px] font-mono border ${lang === 'en' ? 'border-red-500 text-red-500 bg-red-900/20' : 'border-gray-800 text-gray-600'}`}
                >
                    EN
                </button>
                <button 
                    onClick={() => setLang('ru')}
                    className={`px-2 py-1 text-[10px] font-mono border ${lang === 'ru' ? 'border-red-500 text-red-500 bg-red-900/20' : 'border-gray-800 text-gray-600'}`}
                >
                    RU
                </button>
            </div>

            {/* Body Text */}
            <div className="space-y-6 font-mono text-sm md:text-base text-gray-300 mb-8 max-w-lg">
                <p className="tracking-widest text-red-400 font-bold uppercase border-b border-red-900 pb-2">
                    [{txt.subtitle}]
                </p>
                <p>
                    {txt.body_1}
                </p>
                <div className="border-l-4 border-red-600 pl-4 py-2 bg-red-900/10 text-left">
                    <p className="text-red-500 font-bold animate-pulse">
                        {txt.body_2}
                    </p>
                </div>
                <p className="text-xs text-gray-500 uppercase">
                    {txt.body_3}
                </p>
            </div>

            {/* Action Button */}
            <div className="w-full max-w-md">
                {!canEnter && (
                    <div className="w-full h-1 bg-gray-900 mb-2 overflow-hidden">
                        <div 
                            className="h-full bg-red-600 transition-all duration-75 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
                
                <button
                    onClick={onAccept}
                    disabled={!canEnter}
                    className={`w-full py-4 uppercase tracking-[0.2em] font-bold text-sm transition-all duration-300 border relative overflow-hidden group
                        ${canEnter 
                            ? 'bg-red-900/20 border-red-500 text-red-500 hover:bg-red-600 hover:text-black hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] cursor-pointer' 
                            : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                        }
                    `}
                >
                    {canEnter ? txt.btn_enter : txt.btn_wait}
                    
                    {canEnter && <div className="absolute top-0 left-0 w-2 h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-[shine_0.5s_linear]"></div>}
                </button>
            </div>

            <div className="mt-6 text-[9px] text-red-900 uppercase tracking-[0.5em]">
                NEURAL SAFETY PROTOCOL V9.0
            </div>
        </div>
      </div>
    </div>
  );
};