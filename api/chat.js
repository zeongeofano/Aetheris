const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Kamu adalah Aetheris, asisten AI cerdas untuk Forge Future. Kamu ahli dalam teknologi, desain modern, dan analisis pasar." 
        },
        { role: "user", content: req.body.prompt }
      ],
      // GANTI BAGIAN INI:
      model: "llama-3.1-8b-instant",
    });

    return res.status(200).json({ text: chatCompletion.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ text: "Groq Error: " + error.message });
  }
};
