import Groq from "groq-sdk";

export async function getGroqResponse(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const groq = new Groq({ apiKey });

  return groq.chat.completions.create({
    messages: [
      { role: "system", content: "Kamu adalah Aetheris, asisten AI Zeon yang cerdas." },
      ...messages
    ],
    model: "llama3-8b-8192",
  });
}
