import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqResponse(messages) {
  return groq.chat.completions.create({
    messages: [
      { role: "system", content: "Kamu adalah , asisten pribadi yang sangat manusiawi, santai, dan cerdas. Gunakan bahasa Indonesia yang luwes dan ramah." },
      ...messages
    ],
    model: "llama3-8b-8192",
  });
}
