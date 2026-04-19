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
  const [isSwitching, setIsSwitching] = useState(false); // State untuk animasi transisi
  const scrollRef = useRef(null);

  useEffect(() => {
    const savedChat = localStorage.getItem('aetheris_chat');
    if (savedChat) setMsgs(JSON.parse(savedChat));
  }, []);

  useEffect(() => {
    localStorage.setItem('aetheris_chat', JSON.stringify(msgs));
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  // Fungsi ganti mode dengan animasi
  const toggleMode = (newMode) => {
    if (newMode !== mode) {
      setIsSwitching(true);
      setTimeout(() => {
        setMode(newMode);
        setIsSwitching(false);
      }, 500); // Durasi animasi
    }
  };

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
      setMsgs([...newHistory, { role: "assistant", content: data.text || "..." }]);
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Koneksi terputus." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if(confirm("Hapus semua percakapan?")) {
      setMsgs([]);
      localStorage.removeItem('aetheris_chat');
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col transition-colors duration-1000 overflow-hidden ${mode === 'pro' ? 'bg-[#0a0a0b]' : 'bg-[#0f0a0f]'}`}>
      
      {/* ANIMASI OVERLAY SAAT GANTI MODE */}
      <AnimatePresence>
        {isSwitching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md ${mode === 'pro' ? 'bg-pink-500/20' : 'bg-blue-500/20'}`}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-white"
            >
              {mode === 'pro' ? <Heart size={80} className="text-pink-500" /> : <Zap size={80} className="text-blue-500" />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <motion.div 
            key={mode}
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${mode === 'pro' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-pink-600 shadow-pink-500/20'}`}
          >
            {mode === 'pro' ? <Zap size={16} className="text-white" /> : <Heart size={16} className="text-white" />}
          </motion.div>
          <span className="text-lg font-bold tracking-tighter text-white italic">AETHERIS</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 scale-90">
            <button onClick={() => toggleMode('pro')} className={`px-4 py-1 rounded-full text-[10px] font-black transition-all ${mode === 'pro' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>PRO</button>
            <button onClick={() => toggleMode('bestie')} className={`px-4 py-1 rounded-full text-[10px] font-black transition-all ${mode === 'bestie' ? 'bg-pink-600 text-white' : 'text-gray-500'}`}>BESTIE</button>
          </div>
        </div>
      </nav>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto px-4">
        <div className="max-w-3xl mx-auto py-8">
          <AnimatePresence mode='popLayout'>
            {msgs.length === 0 ? (
              <motion.div 
                key={mode + "empty"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center"
              >
                 <h2 className={`text-4xl font-black uppercase italic mb-2 tracking-widest ${mode === 'pro' ? 'text-blue-500' : 'text-pink-500'}`}>
                   {mode === 'pro' ? 'Tactical Mode' : 'Ready to Listen'}
                 </h2>
                 <p className="text-gray-600">Sistem siap digunakan.</p>
              </motion.div>
            ) : (
              msgs.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
                >
                  <div className={`flex gap-3 max-w-[88%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-4 rounded-2xl shadow-xl ${m.role === 'user' ? (mode === 'pro' ? 'bg-blue-600' : 'bg-purple-600') : 'bg-[#1a1a1c] border border-white/5 text-gray-200'}`}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                      {m.role === 'assistant' && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(m.content);
                          }}
                          className="mt-3 text-[9px] text-gray-500 hover:text-white uppercase font-black tracking-widest"
                        >
                          Copy Text
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <RefreshCw size={12} className="animate-spin mr-2" /> Aetheris Processing...
            </motion.div>
          )}
          <div ref={scrollRef} className="h-10" />
        </div>
      </main>

      {/* INPUT */}
      <footer className="p-4 bg-black/20 backdrop-blur-md">
        <div className={`max-w-3xl mx-auto flex items-center bg-[#161618] border rounded-full p-1.5 pr-3 transition-all duration-500 ${mode === 'pro' ? 'border-blue-500/30' : 'border-pink-500/30'}`}>
          <input 
            className="flex-1 bg-transparent px-5 py-3 outline-none text-white text-sm"
            placeholder={mode === 'pro' ? "Kirim instruksi..." : "Cerita apa hari ini?"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button onClick={send} className={`p-3 rounded-full transition-all active:scale-90 ${mode === 'pro' ? 'bg-blue-600' : 'bg-pink-600'}`}>
            <Send size={18} className="text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
    }
