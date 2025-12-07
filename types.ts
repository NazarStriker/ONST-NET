export type Language = 'en' | 'ru';

export interface CyberPersona {
  found: boolean;
  handle: string;
  realName: string;
  location: string;
  publicContact: string; // This is where Telegram should go
  bio: string;
  followers: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  // New Technical Fields mimicking Tikip
  technical?: {
    userId?: string;
    region?: string;
    language?: string;
    created?: string;
  };
  platforms: {
    name: string;
    url: string; 
    username?: string; 
    status: string;
  }[];
  analysis: string;
  sources?: {
    title: string;
    uri: string;
  }[];
}

export enum ScanStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  DECRYPTING = 'DECRYPTING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'hacker';
  text: string;
  isThinking?: boolean;
}