const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Kamu adalah Aetheris, asisten AI yang cerdas." },
        { role: "user", content: req.body.prompt }
      ],
      model: "llama3-8b-8192",
    });

    return res.status(200).json({ text: chatCompletion.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ text: "Groq Error: " + error.message });
  }
};
