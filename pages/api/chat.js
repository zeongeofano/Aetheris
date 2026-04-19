import { getGroqResponse } from "../../lib/groq";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  // Ambil API Key dari environment
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ text: "Error: API Key tidak ditemukan di sistem Vercel." });
  }

  try {
    const { messages } = req.body;
    
    // Konversi role agar sesuai standar Groq
    const cleanMessages = messages.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content)
    }));

    const completion = await getGroqResponse(cleanMessages);
    
    if (completion.choices && completion.choices.length > 0) {
      res.status(200).json({ text: completion.choices[0].message.content });
    } else {
      res.status(200).json({ text: "Sistem Groq tidak memberikan respon." });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({ text: `Gagal konek: ${error.message}` });
  }
    }
