import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if(!input.trim() || loading) return;
    
    const userMsg = { role: "user", content: input };
    const newHistory = [...msgs, userMsg];
    
    setMsgs(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ messages: newHistory })
      });
      
      const data = await res.json();
      
      if (data.text) {
        setMsgs([...newHistory, { role: "assistant", content: data.text }]);
      } else {
        setMsgs([...newHistory, { role: "assistant", content: "Koneksi ke otak Aetheris terputus. Cek API Key kamu." }]);
      }
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Terjadi kesalahan pada sistem." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Header Full Width */}
      <header className="p-6 border-b border-white/10 bg-black/50 backdrop-blur-md z-10">
        <h1 className="text-2xl font-light tracking-[0.2em] text-blue-400 text-center uppercase">
          Aetheris
        </h1>
      </header>

      {/* Chat Area - Full Flex */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6">
        <div className="max-w-4xl mx-auto w-full">
          <AnimatePresence>
            {msgs.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-20 text-gray-500">
                <p className="text-lg">Selamat datang di Aetheris. Apa yang bisa saya bantu hari ini?</p>
              </motion.div>
            )}
            {msgs.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                key={i}
                className={`flex mb-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-5 rounded-2xl shadow-xl max-w-[90%] md:max-w-[70%] ${
                  m.role === 'user' 
                  ? 'bg-blue-600/10 border border-blue-500/30 text-blue-50' 
                  : 'bg-white/5 border border-white/10 text-gray-200 backdrop-blur-sm'
                }`}>
                  <p className="leading-relaxed">{m.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl animate-pulse text-sm text-gray-400">
                Aetheris sedang mengetik...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Input Area - Full Width Bottom */}
      <footer className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input 
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all text-lg" 
            placeholder="Ketik pesan untuk Aetheris..."
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
          />
          <button 
            onClick={send} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-8 py-4 rounded-2xl transition-all active:scale-95 font-medium"
          >
            Kirim
          </button>
        </div>
      </footer>
    </div>
  );
      }
