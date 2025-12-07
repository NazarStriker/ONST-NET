import React, { useEffect, useState, useRef } from 'react';
import { ScanStatus } from '../types';
import { ScrambleText } from './ScrambleText';

interface ScanAnimationProps {
  logs: string[];
  status: ScanStatus;
}

export const ScanAnimation: React.FC<ScanAnimationProps> = ({ logs, status }) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [hexDump, setHexDump] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [coords, setCoords] = useState({ lat: '00.0000', lon: '00.0000' });

  // Sync logs (Keep last 6 for layout stability)
  useEffect(() => {
    setDisplayedLogs(logs.slice(-6)); 
  }, [logs]);

  // Generate fake Hex Dump effect
  useEffect(() => {
    const interval = setInterval(() => {
      const hexLine = Array(4).fill(0).map(() => Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase()).join(' ');
      const address = `0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')}`;
      setHexDump(prev => [`${address} : ${hexLine}`, ...prev].slice(0, 12));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Fake Radar Coordinates
  useEffect(() => {
    const interval = setInterval(() => {
        setCoords({
            lat: (Math.random() * 180 - 90).toFixed(4),
            lon: (Math.random() * 360 - 180).toFixed(4)
        });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Fake Progress Bar based on status
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(old => {
        if (status === ScanStatus.COMPLETE) return 100;
        const increment = Math.random() * 5;
        return Math.min(old + increment, 95);
      });
    }, 200);
    return () => clearInterval(timer);
  }, [status]);

  const getStatusColor = () => {
    if (status === ScanStatus.DECRYPTING) return "text-red-500 border-red-500";
    if (status === ScanStatus.ANALYZING) return "text-yellow-400 border-yellow-400";
    return "text-green-500 border-green-500";
  };

  const getStatusBg = () => {
    if (status === ScanStatus.DECRYPTING) return "bg-red-500";
    if (status === ScanStatus.ANALYZING) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className={`w-full max-w-3xl relative bg-black/90 p-1 border-2 ${getStatusColor()} shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-500`}>
      
      {/* CORNER DECORATORS */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${getStatusColor()}`}></div>
      <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${getStatusColor()}`}></div>
      <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${getStatusColor()}`}></div>
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${getStatusColor()}`}></div>

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusBg()}`}></div>
            <span className={`font-mono text-xs font-bold tracking-widest ${getStatusColor()}`}>
                OSINT_MODULE_V3.1 // {status}
            </span>
        </div>
        <div className="font-mono text-[10px] text-gray-500">
            PID: {Math.floor(Math.random() * 9999)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 min-h-[300px]">
        
        {/* LEFT COLUMN: RADAR (3 cols) */}
        <div className="md:col-span-4 border-r border-gray-800 relative overflow-hidden flex flex-col items-center justify-center p-4">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border border-gray-700 flex items-center justify-center">
                {/* Radar Rings */}
                <div className="absolute inset-0 rounded-full border border-gray-800 scale-75"></div>
                <div className="absolute inset-0 rounded-full border border-gray-800 scale-50"></div>
                <div className="absolute w-[1px] h-full bg-gray-800"></div>
                <div className="absolute h-[1px] w-full bg-gray-800"></div>
                
                {/* Radar Sweep */}
                <div className={`absolute w-full h-full rounded-full animate-[spin_2s_linear_infinite] opacity-30 bg-[conic-gradient(transparent_270deg,${status === ScanStatus.DECRYPTING ? 'red' : '#00ff41'})]`}></div>
                
                {/* Random Blips */}
                <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-8 right-12 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
            </div>
            <div className="mt-6 text-center">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Target Coordinates</div>
                <div className={`text-xs font-bold font-mono ${getStatusColor()} opacity-80`}>
                    LAT: {coords.lat}
                </div>
                <div className={`text-xs font-bold font-mono ${getStatusColor()} opacity-80`}>
                    LON: {coords.lon}
                </div>
            </div>
            {/* Background Grid for Radar */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
        </div>

        {/* MIDDLE COLUMN: LOGS (5 cols) */}
        <div className="md:col-span-5 p-4 flex flex-col font-mono text-xs relative overflow-hidden bg-black/40">
             <div className="text-[9px] text-gray-600 mb-2 uppercase border-b border-gray-800 pb-1 flex justify-between">
                <span>System Log</span>
                <span className={`animate-pulse ${getStatusColor()}`}>● REC</span>
             </div>
             <div className="flex-1 space-y-2 relative z-10">
                {displayedLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-gray-600 shrink-0">[{new Date().toLocaleTimeString('en-US', {hour12: false}).split(' ')[0]}]</span>
                        <span className={`${getStatusColor()} opacity-90 break-words`}>
                            {'>'} <ScrambleText text={log} speed={10} className="inline" />
                        </span>
                    </div>
                ))}
                {/* Blinking Block Cursor */}
                <div className={`w-2 h-4 ${getStatusBg()} animate-pulse mt-1`}></div>
             </div>
        </div>

        {/* RIGHT COLUMN: HEX DUMP (3 cols) */}
        <div className="hidden md:block md:col-span-3 border-l border-gray-800 p-4 font-mono text-[10px] text-gray-500 bg-gray-900/10 overflow-hidden relative">
            <div className="text-[9px] text-gray-600 mb-2 uppercase border-b border-gray-800 pb-1">Memory Dump</div>
            <div className="opacity-60">
                {hexDump.map((line, i) => (
                    <div key={i} className="whitespace-nowrap font-mono">{line}</div>
                ))}
            </div>
            {/* Scanline overlay specifically for hex */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-[20%] animate-[scan_3s_linear_infinite] pointer-events-none"></div>
        </div>

      </div>

      {/* FOOTER PROGRESS */}
      <div className="h-1 w-full bg-gray-900 relative">
        <div 
            className={`h-full transition-all duration-200 ease-out ${getStatusBg()}`} 
            style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center px-2 py-1 text-[9px] uppercase text-gray-600 font-mono">
         <span>Mem: {Math.floor(Math.random() * 200 + 400)}MB</span>
         <span>Net: Encrypted</span>
         <span>Sec: {status === ScanStatus.SCANNING ? 'Bypassing' : 'Handshake'}</span>
      </div>

    </div>
  );
};