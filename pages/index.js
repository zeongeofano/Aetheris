import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Heart, Zap, Coffee, RefreshCw, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [mode, setMode] = useState('pro'); 
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // 1. FITUR INGATAN: Ambil chat lama saat web dibuka
  useEffect(() => {
    const savedChat = localStorage.getItem('aetheris_chat');
    if (savedChat) setMsgs(JSON.parse(savedChat));
  }, []);

  // Simpan chat ke memori HP setiap kali ada pesan baru
  useEffect(() => {
    if (msgs.length > 0) {
      localStorage.setItem('aetheris_chat', JSON.stringify(msgs));
    }
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
        body: JSON.stringify({ messages: newHistory, mode: mode })
      });
      
      const data = await res.json();
      
      // 2. EFEK STREAMING SEDERHANA:
      // Kita tambahkan sedikit delay agar teks tidak muncul "jedug" sekaligus
      setMsgs([...newHistory, { role: "assistant", content: data.text || "..." }]);
      
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Koneksi terputus." }]);
    } finally {
      setLoading(false);
    }
  };

  // Fitur Hapus Chat
  const clearChat = () => {
    if(confirm("Hapus semua percakapan?")) {
      setMsgs([]);
      localStorage.removeItem('aetheris_chat');
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col transition-colors duration-700 overflow-hidden ${mode === 'pro' ? 'bg-[#0a0a0b]' : 'bg-[#0f0a0f]'}`}>
      
      {/* NAVBAR */}
      <nav className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${mode === 'pro' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-pink-600 shadow-pink-500/20'}`}>
            {mode === 'pro' ? <Zap size={16} className="text-white" /> : <Heart size={16} className="text-white" />}
          </div>
          <span className="text-lg font-bold tracking-tighter text-white italic">AETHERIS</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 scale-90">
            <button onClick={() => setMode('pro')} className={`px-4 py-1 rounded-full text-[10px] font-black ${mode === 'pro' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>PRO</button>
            <button onClick={() => setMode('bestie')} className={`px-4 py-1 rounded-full text-[10px] font-black ${mode === 'bestie' ? 'bg-pink-600 text-white' : 'text-gray-500'}`}>BESTIE</button>
          </div>
        </div>
      </nav>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="max-w-3xl mx-auto py-8">
          <AnimatePresence>
            {msgs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center">
                 <h2 className="text-3xl font-black text-white uppercase italic mb-2 tracking-widest">
                   {mode === 'pro' ? 'Tactical Mode' : 'Ready to Listen'}
                 </h2>
                 <p className="text-gray-600">Mulai obrolanmu sekarang...</p>
              </motion.div>
            ) : (
              msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                  <div className={`flex gap-3 max-w-[88%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-4 rounded-2xl shadow-xl ${m.role === 'user' ? (mode === 'pro' ? 'bg-blue-600' : 'bg-purple-600') : 'bg-[#1a1a1c] border border-white/5 text-gray-200'}`}>
                      {/* 3. TOMBOL COPY (Otomatis untuk setiap pesan AI) */}
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                      {m.role === 'assistant' && (
                        <button 
                          onClick={() => navigator.clipboard.writeText(m.content)}
                          className="mt-2 text-[10px] text-gray-500 hover:text-white uppercase font-bold"
                        >
                          Copy Text
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start mb-8 animate-pulse text-gray-500 text-xs font-bold uppercase">
              Aetheris is typing...
            </div>
          )}
          <div ref={scrollRef} className="h-10" />
        </div>
      </main>

      {/* INPUT */}
      <footer className="p-4 bg-black">
        <div className="max-w-3xl mx-auto flex items-center bg-[#161618] border border-white/10 rounded-full p-1.5 pr-3">
          <input 
            className="flex-1 bg-transparent px-5 py-3 outline-none text-white text-sm"
            placeholder="Type here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button onClick={send} className={`p-3 rounded-full ${mode === 'pro' ? 'bg-blue-600' : 'bg-pink-600'}`}>
            <Send size={18} className="text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
              }
