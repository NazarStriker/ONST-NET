import { GoogleGenAI, Chat } from "@google/genai";
import { CyberPersona, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePersona = async (username: string, lang: Language): Promise<CyberPersona> => {
  // Using Gemini 3.0 Pro Preview as the "Virtual Backend" processor
  const model = "gemini-3-pro-preview";
  
  const langInstruction = lang === 'ru' 
    ? "OUTPUT LANGUAGE: RUSSIAN (Technical keys stay in English)." 
    : "OUTPUT LANGUAGE: ENGLISH.";

  const cleanHandle = username.replace('@', '');

  // VIRTUAL BACKEND PROMPT
  const prompt = `
  SYSTEM_ROLE: VIRTUAL_PYTHON_BACKEND_V3.
  MODE: EXECUTE_SCRIPT "osint_tiktok_deep_scan.py"
  TARGET_USER: "${cleanHandle}"
  
  ${langInstruction}

  [VIRTUAL_SCRIPT_LOGIC]
  def main(target):
      # STEP 1: MIRROR SEARCH
      sources = google_search([
          f"site:urlebird.com {target}",
          f"site:exolyt.com {target}",
          f"site:tiktokstalk.com {target}", 
          f"site:tik.fail {target}"
      ])
      
      # STEP 2: BIO & CONTACT EXTRACTION
      bio_text = extract_text_from_snippets(sources)
      
      # CRITICAL REGEX FOR TELEGRAM: match t.me/username or telegram.me/username
      # Often found in bio like "ТГК: t.me/pipyka_top0"
      contacts = regex_findall(r"(t\.me\/[\w_]+|telegram\.me\/[\w_]+|instagram\.com\/[\w_\.]+|vk\.com\/[\w_\.]+)", bio_text)
      
      # STEP 3: REGION INFERENCE
      if "🇷🇺" in bio_text or "Moscow" in bio_text or is_cyrillic_russian(bio_text):
          region = "RU (Russia)"
      elif "🇺🇦" in bio_text or "Kiev" in bio_text or "Odessa" in bio_text:
          region = "UA (Ukraine)"
      elif "🇰🇿" in bio_text:
          region = "KZ (Kazakhstan)"
      else:
          region = extract_region_from_exolyt_metadata(sources)

      # STEP 4: DYNAMIC SOCIAL GRAPH (Discovery Mode)
      found_platforms = []
      
      # Always add TikTok if found
      if check_url(f"tiktok.com/@{target}"): 
          found_platforms.append({"name": "TikTok", "url": f"https://www.tiktok.com/@{target}", "status": "ACTIVE"})
      
      # CRITICAL: If contacts contains a t.me link, ADD TELEGRAM TO PLATFORMS
      for contact in contacts:
          if "t.me" in contact or "telegram.me" in contact:
              clean_tg = "https://" + contact if not contact.startswith("http") else contact
              found_platforms.append({"name": "Telegram", "url": clean_tg, "status": "ACTIVE"})
          if "instagram.com" in contact:
              clean_ig = "https://" + contact if not contact.startswith("http") else contact
              found_platforms.append({"name": "Instagram", "url": clean_ig, "status": "ACTIVE"})

      return compile_json(region, contacts, found_platforms)

  [INSTRUCTION]
  Act as the interpreter. 
  1. SCRAPE the bio and search results.
  2. POPULATE 'platforms' array DYNAMICALLY.
  3. IMPORTANT: If you see a Telegram link (t.me/...) in the bio text, YOU MUST ADD IT to 'platforms' and 'publicContact'.
  4. DO NOT include platforms with "UNKNOWN" status or empty URLs.

  OUTPUT SCHEMA (JSON Only):
  {
    "found": boolean,
    "handle": "@${cleanHandle}",
    "realName": "string",
    "location": "string",
    "publicContact": "string",
    "bio": "string",
    "followers": "string",
    "riskScore": "HIGH/MEDIUM/LOW",
    "technical": {
       "userId": "string",
       "region": "string",
       "language": "string",
       "created": "string"
    },
    "platforms": [
       // ONLY ACTIVE LINKS HERE. NO PLACEHOLDERS.
       { "name": "String", "url": "String", "status": "ACTIVE" }
    ],
    "analysis": "string"
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  const text = response.text || "{}";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
    .filter((s: any) => s !== null);

  let cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = cleanJson.indexOf('{');
  const lastBrace = cleanJson.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
  }

  try {
    const data = JSON.parse(cleanJson) as CyberPersona;
    data.sources = sources;

    // --- DATA SANITIZATION (Prevent UI Crashes) ---
    if (!data.platforms) data.platforms = [];
    if (!data.handle) data.handle = "@" + cleanHandle;
    if (!data.realName) data.realName = "UNKNOWN";
    if (!data.publicContact) data.publicContact = "HIDDEN";
    if (!data.location) data.location = "UNKNOWN";
    
    // --- POST-PROCESSING FILTERS ---
    
    // 1. Strict Filter: Remove any platform that has no URL or "..." or "UNKNOWN"
    data.platforms = data.platforms.filter(p => 
        p.status === 'ACTIVE' && 
        p.url && 
        p.url.length > 8 && 
        !p.url.includes("...") && 
        p.url !== "UNKNOWN"
    );

    // 2. Telegram Link Extractions from BIO (Regex Fallback)
    // Sometimes the AI puts it in Bio but forgets to add to platforms
    if (data.bio) {
        const tgRegex = /(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/g;
        const matches = data.bio.match(tgRegex);
        if (matches) {
            matches.forEach(match => {
                const url = match.startsWith('http') ? match : `https://${match}`;
                // Check if already exists to avoid duplicates
                if (!data.platforms.some(p => p.url.includes(match))) {
                    data.platforms.push({
                        name: "Telegram",
                        url: url,
                        status: "ACTIVE"
                    });
                    // Also update public contact if empty
                    if (!data.publicContact || data.publicContact === "UNKNOWN" || data.publicContact === "HIDDEN") {
                        data.publicContact = url;
                    }
                }
            });
        }
    }

    // 3. Fallback: If found=true but platforms is empty, force TikTok
    if (data.found && data.platforms.length === 0) {
        data.platforms.push({
            name: "TikTok",
            url: `https://www.tiktok.com/@${cleanHandle}`,
            status: "ACTIVE"
        });
    }

    // 4. Ghost Protocol (Mirrors)
    const mirrorSources = sources.filter(s => 
        s.uri.includes('urlebird') || 
        s.uri.includes('exolyt') || 
        s.uri.includes('tiktok')
    );
    
    if (mirrorSources.length > 0 && !data.found) {
        data.found = true;
        data.analysis += " [GHOST_PROTOCOL: Found via Mirrors]";
        if (!data.platforms.some(p => p.name === 'TikTok')) {
             data.platforms.unshift({
                name: "TikTok",
                url: `https://www.tiktok.com/@${cleanHandle}`,
                status: "ACTIVE"
            });
        }
    }

    return data;
  } catch (e) {
    console.error("OSINT Runtime Error", e);
    return {
        found: false,
        handle: username,
        realName: "RUNTIME_ERROR",
        location: "UNKNOWN",
        publicContact: "UNKNOWN",
        bio: "Script execution failed.",
        followers: "UNKNOWN",
        riskScore: "LOW",
        platforms: [],
        analysis: lang === 'ru' ? "Критическая ошибка виртуальной машины." : "Virtual Machine Critical Error.",
        sources: sources
    };
  }
};

// --- CHAT BOT SERVICE ---

export const createHackerChat = (initialData: CyberPersona, lang: Language): Chat => {
  const model = "gemini-2.5-flash"; 
  
  const personaContext = JSON.stringify(initialData);
  
  const systemInstruction = `
    ROLE: CLI Output Interface.
    Language: ${lang === 'ru' ? 'Russian' : 'English'}.
    CONTEXT: ${personaContext}
    BEHAVIOR: Explain the results technically. If multiple platforms were found (e.g. YouTube + TikTok), mention the cross-reference connection.
  `;

  return ai.chats.create({
    model,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }]
    }
  });
};