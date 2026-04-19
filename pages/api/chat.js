import { getGroqResponse } from "../../lib/groq";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Gunakan POST' });
  
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Format pesan salah" });
    }

    // Pastikan format role sesuai standar Groq (user/assistant)
    const formattedMessages = messages.map(m => ({
      role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
      content: m.content
    }));

    const completion = await getGroqResponse(formattedMessages);
    const answer = completion.choices[0]?.message?.content || "Maaf, aku bingung mau jawab apa...";
    
    res.status(200).json({ text: answer });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Aduh, ada masalah di server AI-nya." });
  }
}
