import Groq from "groq-sdk";

export async function getGroqResponse(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const groq = new Groq({ apiKey });

  return groq.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "Kamu adalah Aetheris, asisten AI Zeon yang cerdas, manusiawi, dan asik diajak ngobrol. Gunakan bahasa Indonesia yang luwes." 
      },
      ...messages
    ],
    // Ganti ke model terbaru di bawah ini:
    model: "llama-3.3-70b-versatile", 
  });
}
