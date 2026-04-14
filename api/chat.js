const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ text: "Gunakan POST" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Atau "gpt-4" kalau akunmu mendukung
      messages: [
        { role: "system", content: "Kamu adalah Aetheris, asisten AI yang cerdas." },
        { role: "user", content: req.body.prompt }
      ],
    });

    const responseText = completion.choices[0].message.content;
    return res.status(200).json({ text: responseText });
  } catch (error) {
    return res.status(500).json({ text: "OpenAI Error: " + error.message });
  }
};
