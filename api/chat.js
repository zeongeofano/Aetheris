const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method tidak diizinkan" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "API Key belum diset di Vercel." });
  }

  // Inisialisasi genAI
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Kita coba gunakan 'gemini-1.5-flash-latest' atau 'gemini-1.5-flash'
    // yang secara otomatis akan diarahkan ke versi v1beta jika diperlukan oleh library
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = req.body.prompt || "Halo";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text: text });
  } catch (error) {
    console.error("Detail Error:", error);
    // Jika masih gagal, kita berikan pesan yang sangat detail untuk debugging
    return res.status(500).json({ text: "Aetheris sedang gangguan teknis: " + error.message });
  }
};
