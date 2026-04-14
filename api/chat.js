import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ text: "Method Not Allowed" });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Kamu adalah Aetheris, asisten AI yang cerdas, ramah, dan autentik. Gaya bicaramu mirip dengan Gemini: membantu, kreatif, dan mampu menjelaskan hal sulit dengan sederhana." 
                },
                { role: "user", content: req.body.prompt }
            ],
            model: "llama-3.1-8b-instant",
        });

        const responseText = chatCompletion.choices[0].message.content;
        return res.status(200).json({ text: responseText });
    } catch (error) {
        console.error("Groq Error:", error);
        return res.status(500).json({ text: "Aetheris sedang istirahat sejenak. Coba lagi ya!" });
    }
}
