import { getGroqResponse } from "../../lib/groq";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const formatted = req.body.messages.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content
    }));
    const completion = await getGroqResponse(formatted);
    res.status(200).json({ text: completion.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
