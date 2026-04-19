import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Heart, Zap, Coffee, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  // Mode default: 'pro' (Biru) | 'bestie' (Pink/Ungu)
  const [mode, setMode] = useState('pro'); 
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll ke bawah
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
        body: JSON.stringify({ 
          messages: newHistory,
          mode: mode 
        })
      });
      const data = await res.json();
      setMsgs([...newHistory, { role: "assistant", content: data.text || "Aetheris lagi bengong, coba lagi ya." }]);
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Koneksi terputus. Coba lagi ya!" }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMsgs([]);

  return (
    <div className={`h-screen w-screen flex flex-col transition-colors duration-700 overflow-hidden ${mode === 'pro' ? 'bg-[#0a0a0b]' : 'bg-[#0f0a0f]'}`}>
      
      {/* NAVBAR */}
      <nav className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-500 ${mode === 'pro' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-pink-600 shadow-pink-500/20'}`}>
            {mode === 'pro' ? <Zap size={16} className="text-white" /> : <Heart size={16} className="text-white" />}
          </div>
          <span className="text-lg font-bold tracking-tighter text-white uppercase italic">Aetheris <span className={mode === 'pro' ? 'text-blue-500' : 'text-pink-500'}>{mode}</span></span>
        </div>

        {/* MODE SWITCHER */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 scale-90 md:scale-100">
          <button 
            onClick={() => {setMode('pro'); clearChat();}}
            className={`px-4 py-1 rounded-full text-[10px] font-black transition-all ${mode === 'pro' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            PRO
          </button>
          <button 
            onClick={() => {setMode('bestie'); clearChat();}}
            className={`px-4 py-1 rounded-full text-[10px] font-black transition-all ${mode === 'bestie' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            BESTIE
          </button>
        </div>
      </nav>

      {/* CHAT MAIN AREA */}
      <main className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="max-w-3xl mx-auto py-8">
          <AnimatePresence mode='wait'>
            {msgs.length === 0 ? (
              /* WELCOME SCREEN */
              <motion.div 
                key={mode}
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center px-6"
              >
                <div className={`mb-6 p-6 rounded-3xl border shadow-2xl transition-all duration-500 ${mode === 'pro' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-pink-500/10 border-pink-500/20 text-pink-400'}`}>
                  {mode === 'pro' ? <Sparkles size={48} /> : <Coffee size={48} />}
                </div>
                <h2 className={`text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter ${mode === 'pro' ? 'text-white' : 'bg-gradient-to-r from-pink-300 via-white to-purple-400 bg-clip-text text-transparent'}`}>
                  {mode === 'pro' ? 'System Online.' : 'Lagi Galau?'}
                </h2>
                <p className="text-gray-500 text-base md:text-lg max-w-xs leading-relaxed">
                  {mode === 'pro' ? 'Siap membantu coding, tugas, dan analisis profesional.' : 'Ceritain aja semuanya ke aku. Aku janji bakal dengerin.'}
                </p>
              </motion.div>
            ) : (
              /* MESSAGE LIST */
              msgs.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
                >
                  <div className={`flex gap-3 max-w-[88%] md:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* AVATAR */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
                      m.role === 'user' ? (mode === 'pro' ? 'bg-blue-600' : 'bg-purple-600') : 'bg-[#1a1a1a] border border-white/10'
                    }`}>
                      {m.role === 'user' ? <User size={14} className="text-white" /> : (mode === 'pro' ? <Zap size={14} className="text-blue-400" /> : <Heart size={14} className="text-pink-400" />)}
                    </div>

                    {/* BUBBLE */}
                    <div className={`p-4 rounded-2xl shadow-xl ${
                      m.role === 'user' 
                      ? (mode === 'pro' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-purple-600 text-white rounded-tr-none') 
                      : 'bg-[#1a1a1c] border border-white/5 text-gray-200 rounded-tl-none'
                    }`}>
                      <div className="prose prose-invert prose-sm md:prose-base max-w-none leading-relaxed prose-strong:text-blue-400">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          
          {/* LOADING INDICATOR */}
          {loading && (
            <div className="flex justify-start mb-8 animate-pulse">
              <div className="flex gap-3 items-center bg-[#1a1a1c] px-4 py-3 rounded-2xl border border-white/5">
                <RefreshCw size={14} className="animate-spin text-gray-500" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Aetheris Thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-10" />
        </div>
      </main>

      {/* INPUT BAR */}
      <footer className="p-4 md:p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-3xl mx-auto relative group">
          <div className={`relative flex items-center bg-[#161618] border rounded-[26px] p-1.5 pr-3 transition-all duration-500 shadow-2xl ${mode === 'pro' ? 'border-blue-500/20 focus-within:border-blue-500/50' : 'border-pink-500/20 focus-within:border-pink-500/50'}`}>
            <input 
              className="flex-1 bg-transparent px-5 py-3 outline-none text-sm md:text-base text-white placeholder-gray-600"
              placeholder={mode === 'pro' ? "Berikan instruksi..." : "Tumpahin curhatanmu di sini..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button 
              onClick={send}
              disabled={loading || !input.trim()}
              className={`p-3 rounded-full text-white transition-all active:scale-90 disabled:opacity-20 shadow-lg ${mode === 'pro' ? 'bg-blue-600 shadow-blue-500/30' : 'bg-pink-600 shadow-pink-500/30'}`}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[9px] text-center text-gray-700 mt-4 font-black uppercase tracking-[0.4em] italic">
            {mode === 'pro' ? 'Aetheris Tactical Intelligence' : 'Aetheris Emotional Support'}
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .prose strong { color: ${mode === 'pro' ? '#60a5fa' : '#f472b6'} !important; }
      `}</style>
    </div>
  );
              }
