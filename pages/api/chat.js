import { getGroqResponse } from "../../lib/groq";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { messages, mode } = req.body; 

  // Membatasi hanya 10 pesan terakhir agar API tidak error karena kepanjangan
  const limitedMessages = messages.slice(-10);

  const systemPrompt = mode === 'bestie' 
    ? "Kamu adalah Aetheris Bestie. Teman curhat yang hangat dan gaul. Gunakan bahasa aku-kamu. Fokus pada empati." 
    : "Kamu adalah Aetheris Pro. Ahli teknologi yang cerdas. Berikan jawaban teknis yang padat dan sangat rapi.";

  try {
    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...limitedMessages
    ];

    const completion = await getGroqResponse(fullMessages);
    res.status(200).json({ text: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ text: "Aetheris lagi overload, coba sebentar lagi ya!" });
  }
}
