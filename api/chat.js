const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Set header agar tidak error CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') return res.status(405).json({ text: "Method Not Allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Kita panggil model dengan teks lengkap, kadang ini membantu di server US
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 500 },
    });

    const result = await chat.sendMessage(req.body.prompt || "Halo");
    const response = await result.response;
    
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    // Jika masih gagal, kita coba model paling dasar sebagai cadangan terakhir
    return res.status(500).json({ text: "Sistem sibuk, coba lagi: " + error.message });
  }
};
