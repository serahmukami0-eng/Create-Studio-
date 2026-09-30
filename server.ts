import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Creative Concept Generator & Business Assistant Endpoint
app.post('/api/ai/creative-concept', async (req: Request, res: Response) => {
  try {
    const { category, title, details, targetAudience, currency } = req.body;

    const prompt = `You are an expert creative director, commercial digital artist, and business advisor helping a digital artist (with a background in Business Information Technology) scale their creative studio in Kenya and globally.
The user wants to plan or generate a creative concept for:
- Category: ${category || 'Digital Artwork'}
- Project / Idea: ${title || 'Luxury Birthday Celebration Poster'}
- Additional Details / Brief: ${details || 'Elegant black dress, gold decorations, high-end celebratory vibe'}
- Target Audience / Client Type: ${targetAudience || 'Individual Client / VIP Event'}
- Primary Currency: ${currency || 'KSh'}

Provide an actionable, structured creative & commercial brief in JSON format with the following keys:
{
  "conceptTitle": "string (Catchy, commercial title)",
  "artisticDirection": "string (Rich visual breakdown, lighting, textures, composition, vibe)",
  "recommendedDimensions": "string (e.g. 4000x5000px, 300 DPI, Aspect Ratio 4:5 for Instagram / A2 Print)",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "typographyPairing": "string (e.g. Display Serif 'Playfair' with modern clean sans 'Plus Jakarta Sans')",
  "suggestedPriceKSh": "string (e.g. KSh 3,500 - KSh 6,000)",
  "suggestedPriceUSD": "string (e.g. $35 - $60)",
  "revisionPolicy": "string (e.g. 1 included round of revisions, additional revisions at KSh 500 / $5 each)",
  "recommendedTools": ["Canva", "Procreate", "Photoshop", "AI Concept Synthesis"],
  "socialMediaHook": "string (Instagram & TikTok 3-second hook to stop scrolling)",
  "socialMediaCaption": "string (Engaging caption with call to action to DM for commissions)",
  "whatsappClientPitch": "string (A polite, ultra-professional response to send when someone asks 'How much for a poster?')"
}

Ensure the response is strictly valid JSON without markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const json = JSON.parse(text);
    return res.json({ success: true, data: json });
  } catch (error: any) {
    console.error('Error generating creative concept:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate creative concept',
    });
  }
});

// AI Contract & Commission Terms Generator
app.post('/api/ai/contract', async (req: Request, res: Response) => {
  try {
    const { clientName, serviceName, price, currency, revisions, turnaroundDays, licenseType } = req.body;

    const prompt = `Generate a clear, professional, friendly yet legally protective Digital Art Commission Agreement for a freelance digital artist & designer named Mukami Creative Studio.
Details:
- Client Name: ${clientName || 'Valued Client'}
- Project / Service: ${serviceName || 'Custom Digital Portrait'}
- Agreed Fee: ${currency || 'KSh'} ${price || '3,500'} (50% deposit required to begin draft, 50% on approval before final high-res watermark removal)
- Revisions: ${revisions || 1} included round of minor revisions. Additional structural revisions billed at ${currency === 'USD' ? '$5' : 'KSh 300'} each.
- Turnaround Time: ${turnaroundDays || 4} business days.
- Licensing: ${licenseType || 'Personal Use Only (Non-Commercial)'}. Artist retains moral rights and right to display in portfolio.

Write the contract in clean markdown text with clear numbered clauses:
1. Scope & Deliverables (300 DPI high-resolution PNG/JPG)
2. Payment Milestones (50% upfront deposit via M-Pesa / Card, 50% upon low-res watermarked preview approval)
3. Revision & Feedback Limits (strictly preventing scope creep)
4. Intellectual Property & Commercial Rights
5. Cancellation & Kill-Fee Policy.

Keep it human, polite, and executive.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ success: true, agreement: response.text });
  } catch (error: any) {
    console.error('Error generating contract:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate contract',
    });
  }
});

// AI Customer Outreach & Pitch Generator
app.post('/api/ai/pitch', async (req: Request, res: Response) => {
  try {
    const { prospectType, serviceOffer, tone } = req.body;

    const prompt = `As a digital art and business strategist, draft 3 distinct client outreach pitch templates for Mukami's Creative Studio (combining digital design and Business Information Technology):
Prospect: ${prospectType || 'Local Nairobi Restaurant / Cafe'}
Offering: ${serviceOffer || 'Promotional Social Media Posters & Digital Menu Graphics'}
Tone: ${tone || 'Warm, confident, value-first'}

Provide JSON with:
{
  "whatsappTemplate": "string (Short, personal, direct message with immediate sample offer)",
  "instagramDMTemplate": "string (High-engagement direct message complimenting their brand and offering a quick mockup)",
  "coldEmailTemplate": "string (Subject line + concise value proposition highlighting ROI of clean branding)",
  "followUpTip": "string (Actionable advice on when and how to follow up if they don't reply)"
}

Return strictly valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const json = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: json });
  } catch (error: any) {
    console.error('Error generating outreach pitch:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate outreach pitch',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
