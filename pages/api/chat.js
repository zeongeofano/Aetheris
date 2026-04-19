import { getGroqResponse } from "../../lib/groq";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  // Ambil pesan dan "mode" dari frontend
  const { messages, mode } = req.body; 

  // Instruksi rahasia untuk AI sesuai pilihanmu
  const systemPrompt = mode === 'bestie' 
    ? "Kamu adalah Aetheris Bestie. Jadilah teman curhat yang sangat hangat, santai, dan penuh empati. Gunakan bahasa aku-kamu yang luwes seperti sahabat sendiri. Jangan kaku, jangan pakai list nomor kecuali diminta." 
    : "Kamu adalah Aetheris Pro. Jadilah asisten cerdas yang ahli teknologi dan analisis. Berikan jawaban yang profesional, padat, dan teknis. Gunakan format yang rapi.";

  try {
    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const completion = await getGroqResponse(fullMessages);
    res.status(200).json({ text: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ text: "Aduh, otak aku lagi panas. Coba tanya lagi ya!" });
  }
    }
