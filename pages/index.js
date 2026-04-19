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

  // Auto scroll ke bawah setiap ada pesan baru
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
      setMsgs([...newHistory, { role: "assistant", content: data.text || "Aetheris sedang tidak bisa merespon." }]);
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Terjadi gangguan koneksi. Coba lagi nanti." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0b0b0b] text-[#e3e3e3] font-sans overflow-hidden">
      
      {/* HEADER / NAVBAR */}
      <nav className="p-4 flex justify-between items-center bg-[#0b0b0b]/80 backdrop-blur-lg border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg rotate-12 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={16} className="text-white -rotate-12" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Aetheris</span>
        </div>
      </nav>

      {/* CHAT DISPLAY */}
      <main className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="max-w-4xl mx-auto py-10">
          <AnimatePresence>
            {msgs.length === 0 ? (
              /* WELCOME SCREEN */
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="h-[60vh] flex flex-col items-center justify-center text-center px-6"
              >
                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text text-transparent mb-6">
                  Ada yang bisa saya bantu?
                </h2>
                <p className="text-gray-500 text-lg md:text-xl max-w-lg leading-relaxed">
                  Tanyakan apa saja, mulai dari tugas harian hingga ide kreatif yang kompleks.
                </p>
              </motion.div>
            ) : (
              /* CHAT MESSAGES */
              msgs.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-8`}
                >
                  <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* AVATAR */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      m.role === 'user' ? 'bg-blue-600' : 'bg-[#1e1e1e] border border-white/10 text-cyan-400'
                    }`}>
                      {m.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                    </div>

                    {/* MESSAGE BUBBLE */}
                    <div className={`p-4 md:p-5 rounded-2xl shadow-xl ${
                      m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-[#1a1a1a] border border-white/5 text-gray-200 rounded-tl-none'
                    }`}>
                      <div className="prose prose-invert prose-sm md:prose-base max-w-none leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {/* LOADING STATE */}
            {loading && (
              <div className="flex justify-start mb-8 animate-pulse">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-10 h-10 rounded-full bg-[#1e1e1e] flex items-center justify-center text-cyan-800">
                    <Sparkles size={18} />
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} className="h-10" />
        </div>
      </main>

      {/* INPUT BOX */}
      <footer className="p-4 md:p-10 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b] to-transparent z-10">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center bg-[#181818] border border-white/10 rounded-[30px] p-2 pr-4 shadow-2xl focus-within:border-blue-500/30 transition-all duration-300">
            <input 
              className="flex-1 bg-transparent px-5 py-3 outline-none text-base md:text-lg placeholder-gray-500"
              placeholder="Tanya sesuatu..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button 
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-full disabled:bg-white/5 disabled:text-gray-700 hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-700 mt-4 uppercase tracking-[0.3em]">
            Aetheris AI Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
       }
