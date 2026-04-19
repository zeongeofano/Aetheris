import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

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
      // Mengambil teks dari respon API
      setMsgs([...newHistory, { role: "assistant", content: data.text || "Aetheris tidak mendapatkan respon." }]);
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Maaf, terjadi gangguan koneksi ke sistem Aetheris." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0e0e0e] text-[#e3e3e3] font-sans overflow-hidden">
      {/* Navbar / Header */}
      <nav className="p-4 flex justify-between items-center bg-[#0e0e0e]/80 backdrop-blur-md border-b border-white/5 z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur-[1px]" />
          <span className="text-lg font-medium tracking-tight">Aetheris</span>
        </div>
      </nav>

      {/* Area Chat */}
      <main className="flex-1 overflow-y-auto px-4">
        <div className="max-w-3xl mx-auto py-10">
          <AnimatePresence>
            {msgs.length === 0 ? (
              /* Tampilan Awal (Universal - Tanpa Nama Zeon) */
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="h-[60vh] flex flex-col items-center justify-center text-center"
              >
                <div className="mb-6 p-4 bg-blue-500/10 rounded-full">
                  <Sparkles size={48} className="text-blue-400 animate-pulse" />
                </div>
                <h2 className="text-4xl md:text-5xl font-medium bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent mb-4">
                  Ada yang bisa saya bantu?
                </h2>
                <p className="text-gray-500 text-lg max-w-sm">
                  Tanyakan apa saja pada Aetheris, mulai dari coding hingga ide kreatif.
                </p>
              </motion.div>
            ) : (
              msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 group">
                  <div className="flex items-start gap-4">
                    {/* Ikon Avatar */}
                    <div className={`mt-1 p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-600' : 'text-cyan-400'}`}>
                      {m.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                    </div>
                    {/* Isi Pesan */}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">
                        {m.role === 'user' ? 'Anda' : 'Aetheris'}
                      </p>
                      <div className="prose prose-invert max-w-none text-[17px] leading-[1.8]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {loading && (
              <div className="flex items-start gap-4 animate-pulse">
                <div className="mt-1 p-2 text-cyan-600"><Sparkles size={18} /></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/5 w-3/4 rounded mt-4" />
                </div>
              </div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} className="h-20" />
        </div>
      </main>

      {/* Input Field Ala Gemini */}
      <footer className="p-4 md:p-8 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e] to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center bg-[#1e1e1e] border border-white/10 rounded-[28px] p-2 pr-4 shadow-2xl focus-within:border-blue-500/50 transition-all">
            <input 
              className="flex-1 bg-transparent px-5 py-3 outline-none text-[16px] md:text-lg placeholder-gray-500"
              placeholder="Ketik pertanyaan di sini..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button 
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-full disabled:bg-white/5 disabled:text-gray-600 hover:bg-blue-500 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[9px] text-center text-gray-600 mt-4 uppercase tracking-[0.2em]">
            Aetheris AI Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
    }
