import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Heart } from 'lucide-react';
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
      setMsgs([...newHistory, { role: "assistant", content: data.text || "Duh, maaf ya, aku lagi agak lemot nih. Bisa ulang?" }]);
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Koneksi kita terputus sebentar, coba lagi ya." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d0d0f] text-[#e4e4e7] font-sans overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="p-4 flex justify-between items-center bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Heart size={18} className="text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">Aetheris</span>
        </div>
      </nav>

      {/* CHAT DISPLAY */}
      <main className="flex-1 overflow-y-auto px-4 scrollbar-hide">
        <div className="max-w-3xl mx-auto py-10">
          <AnimatePresence>
            {msgs.length === 0 ? (
              /* TAMPILAN AWAL TEMAN CURHAT */
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="h-[60vh] flex flex-col items-center justify-center text-center px-6"
              >
                <div className="mb-6 p-5 bg-pink-500/10 rounded-full border border-pink-500/20">
                  <Sparkles size={40} className="text-pink-400 animate-pulse" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 via-white to-purple-400 bg-clip-text text-transparent mb-6">
                  Lagi pengen cerita apa?
                </h2>
                <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
                  Apapun yang ada di pikiranmu, ceritain aja ke aku. Aku siap dengerin kok.
                </p>
              </motion.div>
            ) : (
              /* BUBBLE CHAT */
              msgs.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-8`}
                >
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* AVATAR */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                      m.role === 'user' ? 'bg-purple-600' : 'bg-[#18181b] border border-white/10 text-pink-400'
                    }`}>
                      {m.role === 'user' ? <User size={16} /> : <Heart size={16} />}
                    </div>

                    {/* BUBBLE */}
                    <div className={`p-4 rounded-2xl ${
                      m.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-purple-500/10 shadow-lg' 
                      : 'bg-[#18181b] border border-white/5 text-gray-200 rounded-tl-none'
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
            
            {loading && (
              <div className="flex justify-start mb-8">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#18181b] flex items-center justify-center text-pink-400 border border-white/5">
                    <Heart size={16} className="animate-pulse" />
                  </div>
                  <div className="bg-[#18181b] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-duration:0.8s]" />
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} className="h-20" />
        </div>
      </main>

      {/* INPUT BOX */}
      <footer className="p-4 md:p-8 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f] to-transparent">
        <div className="max-w-3xl mx-auto relative group">
          <div className="relative flex items-center bg-[#18181b] border border-white/10 rounded-full p-2 pr-3 focus-within:border-pink-500/30 transition-all duration-300 shadow-2xl">
            <input 
              className="flex-1 bg-transparent px-5 py-3 outline-none text-base md:text-lg placeholder-gray-500"
              placeholder="Cerita di sini..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button 
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full disabled:opacity-20 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-pink-500/20"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-4 uppercase tracking-[0.3em] font-medium">
            Aetheris • Your Personal Bestie
          </p>
        </div>
      </footer>
    </div>
  );
    }
