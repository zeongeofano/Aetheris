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
        setMsgs([...newHistory, { role: "assistant", content: "Hmm, kuncinya mungkin belum dipasang." }]);
      }
    } catch (e) {
      setMsgs([...newHistory, { role: "assistant", content: "Koneksi terputus nih..." }]);
    } finally {
      setLoading(false);
    }
  };
