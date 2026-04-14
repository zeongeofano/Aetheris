const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // 1. Pastikan method-nya POST
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method tidak diizinkan" });
  }

  // 2. Cek API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "API Key belum diset di Vercel." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // 3. Gunakan nama model yang paling standar
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = req.body.prompt || "Halo";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Gagal memproses pesan: " + error.message });
  }
};
