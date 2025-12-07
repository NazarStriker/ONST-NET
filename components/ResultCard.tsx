import React, { useState } from 'react';
import { CyberPersona, Language } from '../types';
import { ScrambleText } from './ScrambleText';

interface ResultCardProps {
  data: CyberPersona;
  reset: () => void;
  lang: Language;
}

const t = {
  en: {
    target_id: "TARGET IDENTIFIED",
    profile_active: "PROFILE: ACTIVE",
    profile_not_found: "PROFILE: NOT FOUND",
    aka: "KNOWN AS:",
    threat: "THREAT SCORE",
    deep_analysis: "DEEP ANALYSIS LOG",
    geolocation: "GEOLOCATION",
    public_contact: "DECRYPTED CONTACTS",
    est_reach: "AUDIENCE REACH",
    bio_data: "BIO_METADATA",
    status_live: "LIVE",
    evidence: "SOURCE NODES",
    nodes_found: "MATCHES",
    network_nodes: "SOCIAL GRAPH",
    monitoring: "ACTIVE MONITORING",
    not_found_title: "TARGET UNREACHABLE",
    not_found_desc: "The handle did not return a 200 OK status on major platforms.",
    causes: "POSSIBLE CAUSES: Account Deleted, Banned, or 100% Private.",
    terminate: "FLUSH & RESTART",
    link: "OPEN LINK",
    access: "ACCESS",
    not_linked: "N/A",
    footer: "NEON TRACE // SYSTEM V3.1 // UNAUTHORIZED USE PROHIBITED",
    tech_id: "UID (RAW)",
    tech_region: "REGION LOCK",
    tech_lang: "LOCALE",
    tech_created: "FIRST SEEN",
    bio_modal_title: "RAW BIO DATA // FULL DUMP"
  },
  ru: {
    target_id: "ЦЕЛЬ ОПОЗНАНА",
    profile_active: "СТАТУС: АКТИВЕН",
    profile_not_found: "СТАТУС: НЕ НАЙДЕН",
    aka: "ИМЯ:", 
    threat: "УРОВЕНЬ УГРОЗЫ",
    deep_analysis: "ОТЧЕТ АНАЛИЗА",
    geolocation: "ГЕО-МЕТКА",
    public_contact: "РАСШИФРОВАННЫЕ КОНТАКТЫ",
    est_reach: "АУДИТОРИЯ",
    bio_data: "БИО-ДАННЫЕ",
    status_live: "ОНЛАЙН",
    evidence: "ИСТОЧНИКИ ДАННЫХ",
    nodes_found: "СОВПАДЕНИЙ",
    network_nodes: "СОЦ. ГРАФ",
    monitoring: "СЛЕЖКА АКТИВНА",
    not_found_title: "ЦЕЛЬ НЕДОСТУПНА",
    not_found_desc: "Хэндл не вернул статус 200 OK на основных платформах.",
    causes: "ПРИЧИНЫ: Аккаунт удален, забанен или полностью скрыт.",
    terminate: "СБРОС И ПОВТОР",
    link: "ОТКРЫТЬ",
    access: "ВОЙТИ",
    not_linked: "Н/Д",
    footer: "NEON TRACE // SYSTEM V3.1 // ТОЛЬКО ДЛЯ СЛУЖЕБНОГО ПОЛЬЗОВАНИЯ",
    tech_id: "UID (RAW)",
    tech_region: "РЕГИОН",
    tech_lang: "ЛОКАЛЬ",
    tech_created: "ДАТА СОЗДАНИЯ",
    bio_modal_title: "СЫРЫЕ БИО-ДАННЫЕ // ПОЛНЫЙ ДАМП"
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ data, reset, lang }) => {
  const [isBioOpen, setIsBioOpen] = useState(false);
  const isFound = data.found;
  const txt = t[lang];
  const hasTelegram = data.publicContact && data.publicContact.includes('t.me');

  // Filter platforms to ensure we ONLY show active, valid links in the UI
  const visiblePlatforms = data.platforms.filter(p => p.url && p.url.length > 5 && p.status === 'ACTIVE');

  return (
    <div className="w-full max-w-5xl animate-[slideUp_0.5s_ease-out] mb-24 font-mono relative">
      <div className={`border-2 relative bg-[#050505]/95 backdrop-blur-xl overflow-hidden ${isFound ? 'border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.15)]' : 'border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.15)]'}`}>
        
        {/* Background Grid Pattern (Same as Scanner) */}
        <div className={`absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(${isFound ? '0,255,0' : '255,0,0'},0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(${isFound ? '0,255,0' : '255,0,0'},0.1)_1px,transparent_1px)] bg-[size:20px_20px]`}></div>

        {/* Top Tech Header Bar */}
        <div className={`flex justify-between items-center px-4 py-1 border-b ${isFound ? 'border-green-900 bg-green-900/20' : 'border-red-900 bg-red-900/20'}`}>
            <div className="text-[9px] uppercase tracking-widest opacity-70">
                SESSION_ID: {Math.floor(Math.random() * 100000).toString(16).toUpperCase()}
            </div>
            <div className="text-[9px] uppercase tracking-widest opacity-70">
                ENCRYPTION: <span className={isFound ? 'text-green-400' : 'text-red-400'}>BYPASSED</span>
            </div>
        </div>

        <div className="p-6 md:p-10 relative z-10">
            {/* Tech Decorators */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-white"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-white"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-white"></div>

            {/* Main Header */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-800 pb-8 mb-8">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${isFound ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <div className="text-[10px] text-green-500 tracking-[0.3em] uppercase">{txt.target_id}</div>
                </div>
                
                {/* Scramble Effect on Handle */}
                <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight text-white mb-2 break-all">
                <ScrambleText text={data.handle} speed={40} />
                </h2>
                
                {data.realName !== 'UNKNOWN' && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="text-green-700 font-bold">> {txt.aka}</span>
                    <span className="text-white bg-gray-900 px-2 py-0.5">
                        <ScrambleText text={data.realName} delay={1000} speed={70} />
                    </span>
                    </div>
                )}
            </div>
            
            <div className="mt-6 md:mt-0 md:text-right flex flex-col items-end">
                <div className="text-[10px] text-gray-500 mb-1 tracking-[0.3em] uppercase">{txt.threat}</div>
                <div className={`text-5xl font-bold flex items-center gap-2 ${data.riskScore === 'HIGH' ? 'text-red-500' : 'text-green-500'}`}>
                    {data.riskScore === 'HIGH' && <span className="animate-pulse">⚠</span>}
                    {data.riskScore}
                </div>
            </div>
            </div>

            {isFound ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column: Deep Data */}
                <div className="md:col-span-8 space-y-8">
                    
                    {/* 1. TECHNICAL ID BLOCK */}
                    <div className="bg-gray-900/30 border border-green-900/50 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl font-bold text-green-500 pointer-events-none select-none">ID</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            <div>
                                <div className="text-[9px] text-green-600 uppercase mb-1 tracking-wider">{txt.tech_id}</div>
                                <div className="text-white text-sm font-bold tracking-widest break-all">
                                    <ScrambleText text={data.technical?.userId || '---'} delay={500} />
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] text-green-600 uppercase mb-1 tracking-wider">{txt.tech_region}</div>
                                <div className="text-white text-sm font-bold tracking-widest break-all">{data.technical?.region || '---'}</div>
                            </div>
                            <div>
                                <div className="text-[9px] text-green-600 uppercase mb-1 tracking-wider">{txt.tech_lang}</div>
                                <div className="text-white text-sm font-bold tracking-widest">{data.technical?.language || '---'}</div>
                            </div>
                            <div>
                                <div className="text-[9px] text-green-600 uppercase mb-1 tracking-wider">{txt.tech_created}</div>
                                <div className="text-white text-sm font-bold tracking-widest">{data.technical?.created || '---'}</div>
                            </div>
                        </div>
                    </div>

                    {/* 2. CONTACTS & GEO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-5 border-2 transition-all ${hasTelegram ? 'border-green-500 bg-green-900/20 shadow-[0_0_20px_rgba(0,255,0,0.1)]' : 'border-gray-800 bg-gray-900/20'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest">{txt.public_contact}</div>
                                {hasTelegram && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                            </div>
                            <div className={`text-lg font-bold break-all ${hasTelegram ? 'text-white' : 'text-gray-600'}`}>
                                {data.publicContact}
                            </div>
                        </div>

                        <div className="p-5 border border-gray-800 bg-gray-900/20">
                            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{txt.geolocation}</div>
                            <div className="text-lg text-white font-bold">{data.location}</div>
                        </div>
                    </div>

                    {/* 3. ANALYSIS TEXT */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest text-green-800 mb-3 flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-green-800"></span>
                            {txt.deep_analysis}
                        </h3>
                        <div className="text-green-400/90 font-mono text-sm leading-7 border-l-2 border-green-900 pl-4">
                            {data.analysis}
                        </div>
                    </div>

                    {/* 4. METRICS & BIO */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black border border-gray-800 p-3 flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 uppercase">{txt.est_reach}</span>
                            <span className="text-white font-bold">{data.followers}</span>
                        </div>
                        <div 
                            onClick={() => setIsBioOpen(true)}
                            className="bg-black border border-gray-800 hover:border-green-500 cursor-pointer transition-colors p-3 flex justify-between items-center group relative overflow-hidden"
                        >
                            <span className="text-[10px] text-gray-500 uppercase group-hover:text-green-500 transition-colors">{txt.bio_data}</span>
                            <span className="text-gray-400 text-xs truncate max-w-[100px] group-hover:text-white">{data.bio}</span>
                            <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-black to-transparent"></div>
                            <span className="absolute right-2 text-green-500 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">EXPAND [+]</span>
                        </div>
                    </div>

                </div>

                {/* Right Column: Network Graph */}
                <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-gray-800 md:pl-8 pt-8 md:pt-0">
                    <h3 className="text-[10px] uppercase tracking-widest text-green-700 mb-6">{txt.network_nodes}</h3>
                    
                    <div className="space-y-3">
                        {visiblePlatforms.length > 0 ? visiblePlatforms.map((p, i) => (
                            <div key={i} className="relative p-4 border transition-all group bg-green-900/10 border-green-800 hover:border-green-500">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-white text-sm">{p.name}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 border text-green-500 border-green-500">
                                        200 OK
                                    </span>
                                </div>
                                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-600 hover:text-white underline decoration-green-800 hover:decoration-green-500 underline-offset-4 mt-2 inline-block truncate w-full">
                                    {p.url}
                                </a>
                                <div className="absolute left-0 top-1/2 w-1 h-0 bg-green-500 group-hover:h-full transition-all duration-300 transform -translate-y-1/2"></div>
                            </div>
                        )) : (
                            <div className="text-gray-600 text-xs text-center border border-gray-800 p-4 border-dashed">
                                NO EXTERNAL NODES DETECTED
                            </div>
                        )}
                    </div>

                    {data.sources && data.sources.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-900">
                            <div className="text-[10px] uppercase text-gray-600 mb-3">{txt.evidence}</div>
                            <div className="space-y-2">
                                {data.sources.slice(0, 4).map((s, idx) => (
                                    <a key={idx} href={s.uri} target="_blank" className="block text-[10px] text-green-900 hover:text-green-500 truncate transition-colors">
                                        [{idx+1}] {s.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                </div>
            ) : (
                <div className="text-center py-20 space-y-8">
                    <div className="inline-block relative">
                        <div className="text-red-600 text-8xl opacity-80 animate-pulse">Ø</div>
                    </div>
                    <div>
                        <h3 className="text-3xl text-white font-bold uppercase tracking-widest mb-2">{txt.not_found_title}</h3>
                        <p className="text-gray-500 text-sm tracking-wider">{txt.not_found_desc}</p>
                    </div>
                    
                    <div className="max-w-lg mx-auto bg-gray-900/30 p-4 border border-gray-800 text-left">
                        <div className="text-[10px] text-red-500 uppercase mb-2">DEBUG_LOG:</div>
                        <p className="text-xs text-gray-500 font-mono">
                            > SEARCH_DEPTH: LEVEL 3 (DEEP)<br/>
                            > PROXY_NODES: 0/12 RESPONDING<br/>
                            > HANDLE_VERIFICATION: FAILED<br/>
                            > {txt.causes}
                        </p>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-gray-800 flex justify-center">
            <button 
                onClick={reset}
                className="relative group overflow-hidden px-12 py-4 bg-black border border-green-600 text-green-500 uppercase tracking-widest font-bold text-xs hover:text-black transition-colors duration-300"
            >
                <div className="absolute inset-0 w-full h-full bg-green-500 transition-all duration-300 ease-out transform translate-y-full group-hover:translate-y-0"></div>
                <span className="relative z-10">{txt.terminate}</span>
            </button>
            </div>
        </div>

        {/* BIO MODAL */}
        {isBioOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                <div className="w-full max-w-2xl bg-[#050505] border border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.2)] p-6 relative">
                    <div className="flex justify-between items-center mb-4 border-b border-green-900 pb-2">
                         <h3 className="text-green-500 font-bold tracking-widest uppercase">{txt.bio_modal_title}</h3>
                         <button onClick={() => setIsBioOpen(false)} className="text-green-700 hover:text-white font-mono">[X]</button>
                    </div>
                    <div className="font-mono text-green-400 whitespace-pre-wrap text-sm leading-relaxed p-4 bg-green-900/10 border border-green-900/30 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-black">
                        {data.bio || "NO_DATA_AVAILABLE"}
                    </div>
                    <div className="mt-4 text-right">
                        <span className="text-[10px] text-gray-600 uppercase">END_OF_FILE</span>
                    </div>
                </div>
            </div>
        )}

      </div>
      
      <div className="text-center mt-6 text-[9px] uppercase text-gray-800 tracking-[0.2em]">
         {txt.footer}
      </div>
    </div>
  );
};