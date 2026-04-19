import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');

  const send = async () => {
    if(!input.trim()) return;
    const current = [...msgs, { role: "user", content: input }];
    setMsgs(current);
    setInput('');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ messages: current })
    });
    const data = await res.json();
    setMsgs([...current, { role: "assistant", content: data.text }]);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl h-[80vh] rounded-[2rem] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10 text-blue-400 font-bold">ZNFX CHAT</div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {msgs.map((m, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
              className={`p-4 rounded-2xl ${m.role === 'user' ? 'ml-auto bg-blue-600/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'}`}>
              {m.content}
            </motion.div>
          ))}
        </div>
        <div className="p-6 flex gap-3">
          <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 outline-none focus:border-blue-500" 
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
          <button onClick={send} className="bg-blue-600 px-6 py-2 rounded-xl">Kirim</button>
        </div>
      </div>
    </div>
  );
}
