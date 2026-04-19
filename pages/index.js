import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';
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
      setMsgs([...newHistory, { role: "assistant", content: data.text }]);
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Maaf, sistem sedang sibuk." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0e0e0e] text-[#e3e3e3] font-sans">
      {/* Header */}
      <nav className="p-5 flex justify-between items-center bg-[#0e0e0e]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur-[2px] animate-pulse" />
          <span className="text-xl font-medium tracking-tight">Aetheris</span>
        </div>
      </nav>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <AnimatePresence>
            {msgs.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[50vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-4">
                  Halo, Zeon
                </h2>
                <p className="text-gray-400 text-lg">Ada yang bisa Aetheris bantu hari ini?</p>
              </motion.div>
            ) : (
              msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 group">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-transparent text-cyan-400'}`}>
                      {m.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-semibold">
                        {m.role === 'user' ? 'Anda' : 'Aetheris'}
                      </p>
                      <div className="prose prose-invert max-w-none text-[17px] leading-[1.7] prose-strong:text-blue-400 prose-code:bg-white/10 prose-code:p-1 prose-code:rounded">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {loading && (
              <div className="flex items-start gap-4 animate-pulse">
                <div className="mt-1 p-2 text-cyan-600"><Sparkles size={18} /></div>
                <div className="h-4 bg-white/10 w-24 rounded mt-4" />
              </div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Input Box Ala Gemini */}
      <footer className="p-4 md:p-8 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e] to-transparent">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-[30px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex items-center bg-[#1e1e1e] border border-white/10 rounded-[28px] p-2 pr-4 shadow-2xl">
            <input 
              className="flex-1 bg-transparent px-6 py-3 outline-none text-lg placeholder-gray-500"
              placeholder="Tanya Aetheris sesuatu..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button 
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-full disabled:bg-white/5 disabled:text-gray-600 transition-all hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-3 uppercase tracking-[0.2em]">
            Aetheris AI • Didukung oleh Llama 3.3
          </p>
        </div>
      </footer>
    </div>
  );
          }
