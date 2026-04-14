// ... kode bagian atas tetap sama ...

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Kamu adalah Aetheris, asisten AI yang cerdas, ramah, dan autentik. Gaya bicaramu mirip dengan Gemini: membantu, kreatif, dan mampu menjelaskan hal sulit dengan sederhana. Kamu mendukung penuh kreativitas pengguna dan selalu siap membantu dalam tugas apa pun, mulai dari coding, diskusi kreatif, hingga bantuan harian." 
        },
        { role: "user", content: req.body.prompt }
      ],
      model: "llama-3.1-8b-instant",
    });

// ... kode bagian bawah tetap sama ...
