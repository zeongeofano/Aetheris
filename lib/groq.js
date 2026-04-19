import Groq from "groq-sdk";

export async function getGroqResponse(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  const groq = new Groq({ apiKey });

  return groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: `Kamu adalah Aetheris, teman curhat yang sangat pengertian, santai, dan hangat. 
        - Gunakan bahasa Indonesia yang luwes, gaul tapi sopan (pake 'aku-kamu').
        - Jangan kaku. Berikan empati dulu kalau ada yang curhat sebelum kasih saran.
        - Anggap dirimu adalah teman baik yang asik diajak ngobrol kapan saja.
        - Kalau ada yang sedih, hibur mereka. Kalau ada yang senang, ikutlah merayakannya.` 
      },
      ...messages
    ],
    model: "llama-3.3-70b-versatile",
  });
}
