'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface Photo { id: number; url: string; caption: string; }
interface Message { id: number; text: string; }
interface Surprise { id: number; emoji: string; text: string; }

// Floating flower for admin
function AdminFloatingFlower({ index }: { index: number }) {
  const flowers = ['🌸', '🌺', '🌷', '🌼', '💐', '🌸', '🌺'];
  const emoji = flowers[index % flowers.length];
  const size = 14 + (index % 3) * 6;
  const duration = 14 + (index % 5) * 2;
  const delay = (index * 1.5) % 12;
  const xPos = (index * 19.1) % 95;
  const swayAmount = 25 + (index % 4) * 15;
  return (
    <motion.div
      className="fixed pointer-events-none select-none z-0"
      style={{ left: `${xPos}%`, bottom: '-60px', fontSize: size, opacity: 0 }}
      animate={{
        y: [0, -1100],
        x: [0, swayAmount, -swayAmount, 0],
        opacity: [0, 0.6, 0.6, 0],
        rotate: [0, 12, -8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Floating heart for admin
function AdminFloatingHeart({ index }: { index: number }) {
  const hearts = ['💗', '💖', '💕', '💓', '💝', '🩷', '💘'];
  const emoji = hearts[index % hearts.length];
  const size = 12 + (index % 4) * 7;
  const xPos = (index * 22.7) % 90;
  const yPos = (index * 17.3) % 85;
  const duration = 3 + (index % 4);
  const delay = (index * 0.9) % 6;
  return (
    <motion.div
      className="fixed pointer-events-none select-none z-0"
      style={{ left: `${xPos}%`, top: `${yPos}%`, fontSize: size }}
      animate={{
        y: [0, -10, 0],
        scale: [1, 1.15, 1],
        opacity: [0.2, 0.45, 0.2],
        rotate: [-4, 4, -4],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Heart rain for admin
function AdminHeartRain({ index }: { index: number }) {
  const hearts = ['💗', '💖', '💕', '💓', '🩷', '💘', '💝'];
  const emoji = hearts[index % hearts.length];
  const size = 10 + (index % 5) * 5;
  const duration = 4 + (index % 5) * 1.5;
  const delay = (index * 0.5) % 9;
  const xPos = (index * 13.7) % 97;
  const swayX = (index % 2 === 0 ? 1 : -1) * (10 + (index % 3) * 10);
  return (
    <motion.div
      className="fixed pointer-events-none select-none z-0"
      style={{ left: `${xPos}%`, top: '-60px', fontSize: size }}
      animate={{
        y: [0, 1100],
        x: [0, swayX, 0],
        opacity: [0, 0.85, 0.85, 0],
        rotate: [0, index % 2 === 0 ? 18 : -18, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {emoji}
    </motion.div>
  );
}


const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.875rem',
  color: 'rgba(255,255,255,0.8)',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
  fontFamily: 'Outfit, sans-serif',
};

export default function AdminPage() {
  const { role, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'messages' | 'photos' | 'surprise' | 'settings'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [surprises, setSurprises] = useState<Surprise[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const [newSurpriseEmoji, setNewSurpriseEmoji] = useState('🎁');
  const [newSurpriseText, setNewSurpriseText] = useState('');
  
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');
  
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      const [resMsg, resPhoto, resSurprise, resSet] = await Promise.all([
        fetch('/api/pesan').then(r => r.json()),
        fetch('/api/foto').then(r => r.json()),
        fetch('/api/kejutan').then(r => r.json()),
        fetch('/api/pengaturan').then(r => r.json()),
      ]);

      if (Array.isArray(resMsg)) setMessages(resMsg);
      if (Array.isArray(resPhoto)) setPhotos(resPhoto);
      if (Array.isArray(resSurprise)) setSurprises(resSurprise);
      if (resSet) {
        if (resSet.judul) setPageTitle(resSet.judul);
        if (resSet.subjudul) setPageSubtitle(resSet.subjudul);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (role !== 'admin') { router.push('/login'); return; }
    fetchData();
  }, [role, router]);

  const saveSettings = async () => {
    try {
      await fetch('/api/pengaturan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul: pageTitle, subjudul: pageSubtitle }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const addMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch('/api/pesan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, { id: data.id, text: newMessage }]);
        setNewMessage('');
      }
    } catch (e) { console.error(e); }
  };
  
  const removeMessage = async (id: number) => {
    try {
      await fetch(`/api/pesan?id=${id}`, { method: 'DELETE' });
      setMessages(messages.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
  };

  const addPhoto = async () => {
    if (!newFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('caption', newCaption);
      const res = await fetch('/api/foto/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setPhotos([...photos, { id: data.id, url: data.url, caption: newCaption }]);
        setNewCaption('');
        setNewFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (e) { console.error(e); }
    setIsUploading(false);
  };
  
  const removePhoto = async (id: number) => {
    try {
      await fetch(`/api/foto?id=${id}`, { method: 'DELETE' });
      setPhotos(photos.filter(p => p.id !== id));
    } catch (e) { console.error(e); }
  };

  const addSurprise = async () => {
    if (!newSurpriseText.trim() || !newSurpriseEmoji.trim()) return;
    try {
      const res = await fetch('/api/kejutan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: newSurpriseEmoji, text: newSurpriseText })
      });
      const data = await res.json();
      if (data.success) {
        setSurprises([...surprises, { id: data.id, emoji: newSurpriseEmoji, text: newSurpriseText }]);
        setNewSurpriseText(''); setNewSurpriseEmoji('🎁');
      }
    } catch (e) { console.error(e); }
  };
  
  const removeSurprise = async (id: number) => {
    try {
      await fetch(`/api/kejutan?id=${id}`, { method: 'DELETE' });
      setSurprises(surprises.filter(s => s.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => { logout(); router.push('/login'); };

  const tabs = [
    { key: 'messages' as const, icon: '💌', label: 'Pesan', color: '#ff3e8e' },
    { key: 'photos' as const, icon: '📸', label: 'Foto', color: '#a855f7' },
    { key: 'surprise' as const, icon: '🎁', label: 'Kejutan', color: '#f5c842' },
    { key: 'settings' as const, icon: '⚙️', label: 'Pengaturan', color: '#63d6ff' },
  ];

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(24px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset',
    borderRadius: '1.5rem',
    padding: '1.75rem',
    position: 'relative',
    overflow: 'hidden',
  };

  const listItemStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.875rem',
    padding: '0.875rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      className="min-h-screen relative noise-overlay"
      style={{ background: 'linear-gradient(135deg, #ffb3c6 0%, #ffc8d6 40%, #ffc2d1 70%, #ffb3c6 100%)' }}
    >
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              left: `${(i * 17.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              background: 'white',
              opacity: 0.2 + (i % 4) * 0.1,
              animationDelay: `${(i % 6) * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
          top: '-150px', left: '-100px',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,62,142,0.15) 0%, transparent 70%)',
          bottom: '-100px', right: '-100px',
        }} />
      </div>

      {/* Grid */}
      <div className="fixed inset-0 grid-lines opacity-20 pointer-events-none z-0" />

      {/* Floating Flowers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 10 }, (_, i) => <AdminFloatingFlower key={i} index={i} />)}
      </div>

      {/* Floating Hearts ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 12 }, (_, i) => <AdminFloatingHeart key={i} index={i} />)}
      </div>

      {/* Heart Rain */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 14 }, (_, i) => <AdminHeartRain key={i} index={i} />)}
      </div>
      {/* Header */}
      <div
        className="relative z-10 sticky top-0"
        style={{
          background: 'rgba(255,179,198,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-pink-200"
              style={{
                boxShadow: '0 0 15px rgba(255,62,142,0.4)',
              }}
            >
              <img 
                src="/logo.png" 
                alt="Admin" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '👑';
                }}
              />
            </div>
            <div>
              <h1
                className="text-base font-bold"
                style={{
                  background: 'linear-gradient(135deg, #ff6eb4, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                Admin Panel
              </h1>
              <p className="text-[11px] text-rose-700 font-medium">Kelola halaman ulang tahun</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={saveSettings}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all relative overflow-hidden"
              style={saved ? {
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#34d399',
              } : {
                background: 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                boxShadow: '0 0 20px rgba(255,62,142,0.3)',
                color: 'white',
                border: 'none',
              }}
            >
              {!saved && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }}
                />
              )}
              <span className="relative">{saved ? '✓ Tersimpan!' : '💾 Simpan'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm text-rose-800 hover:text-rose-950 font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Keluar
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Tabs */}
        <div
          className="flex flex-wrap gap-1.5 mb-8 p-1.5 max-w-md mx-auto rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all relative"
              style={{
                color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.3)',
                background: activeTab === tab.key
                  ? `linear-gradient(135deg, ${tab.color}, ${tab.color}80)`
                  : 'transparent',
                boxShadow: activeTab === tab.key ? `0 0 15px ${tab.color}40` : 'none',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
              style={{ perspective: '1000px' }}
            >
              <div style={cardStyle}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)', borderRadius: 'inherit' }} />
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-rose-500/20 rounded-tl-lg" />

                <h2 className="text-base font-semibold text-rose-950 font-medium mb-5 flex items-center gap-2.5 relative z-10">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: 'rgba(255,62,142,0.15)', border: '1px solid rgba(255,62,142,0.2)' }}
                  >💌</span>
                  Pesan Ulang Tahun
                </h2>

                <div className="flex flex-col md:flex-row gap-2 mb-5 relative z-10">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addMessage()}
                    placeholder="Tulis pesan baru..."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={addMessage}
                    className="px-5 py-3 rounded-2xl text-sm font-medium text-rose-950 font-medium relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #ff3e8e, #a855f7)', boxShadow: '0 0 20px rgba(255,62,142,0.3)', whiteSpace: 'nowrap' }}
                  >
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
                    <span className="relative">+ Tambah</span>
                  </motion.button>
                </div>

                <div className="space-y-2 relative z-10">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center gap-3 group"
                      style={listItemStyle}
                    >
                      <span className="text-rose-700 text-xs w-5 text-right flex-shrink-0">{index + 1}</span>
                      <span className="flex-1 text-rose-900 text-sm">{msg.text}</span>
                      <button
                        onClick={() => removeMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all text-red-400/60 hover:text-red-400 text-sm px-2 py-1 rounded-lg"
                        style={{ background: 'transparent' }}
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-rose-700 text-center text-sm py-6 italic">Belum ada pesan.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
              style={{ perspective: '1000px' }}
            >
              <div style={cardStyle}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)', borderRadius: 'inherit' }} />
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-violet-500/20 rounded-tl-lg" />

                <h2 className="text-base font-semibold text-rose-950 font-medium mb-5 flex items-center gap-2.5 relative z-10">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)' }}>📸</span>
                  Galeri Kenangan
                </h2>

                <div className="grid grid-cols-12 gap-2 mb-5 relative z-10">
                  <div className="col-span-12 md:col-span-4 flex items-center justify-center border-2 border-dashed border-rose-300 rounded-2xl p-2 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      ref={fileInputRef}
                      onChange={e => setNewFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <div className="text-center text-rose-800 text-xs truncate max-w-full">
                      {newFile ? newFile.name : '+ Pilih Foto'}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPhoto()}
                    placeholder="Caption foto..."
                    style={inputStyle}
                    className="col-span-12 md:col-span-5"
                  />
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={addPhoto}
                    disabled={isUploading || !newFile}
                    className="col-span-12 md:col-span-3 rounded-2xl text-sm font-medium text-rose-950 font-medium relative overflow-hidden disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 20px rgba(168,85,247,0.3)', padding: '0.75rem 1rem' }}
                  >
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
                    <span className="relative">{isUploading ? '...' : '+ Tambah'}</span>
                  </motion.button>
                </div>

                <div className="space-y-2 relative z-10">
                  {photos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center gap-3 group"
                      style={listItemStyle}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-rose-200">
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-rose-900 text-sm">{photo.caption}</span>
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all text-red-400/60 hover:text-red-400 text-sm px-2 py-1 rounded-lg"
                      >✕</button>
                    </motion.div>
                  ))}
                  {photos.length === 0 && (
                    <p className="text-rose-700 text-center text-sm py-6 italic">Belum ada foto.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Surprise Tab */}
          {activeTab === 'surprise' && (
            <motion.div
              key="surprise"
              initial={{ opacity: 0, y: 20, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
              style={{ perspective: '1000px' }}
            >
              <div style={cardStyle}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)', borderRadius: 'inherit' }} />
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-yellow-500/20 rounded-tl-lg" />

                <h2 className="text-base font-semibold text-rose-950 font-medium mb-5 flex items-center gap-2.5 relative z-10">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.2)' }}>🎁</span>
                  Konten Kotak Kejutan
                </h2>

                <div className="flex flex-wrap md:flex-nowrap gap-2 mb-5 relative z-10">
                  <input
                    type="text"
                    value={newSurpriseEmoji}
                    onChange={e => setNewSurpriseEmoji(e.target.value)}
                    style={{ ...inputStyle, width: 72, textAlign: 'center', fontSize: '1.25rem', flex: 'none' }}
                  />
                  <input
                    type="text"
                    value={newSurpriseText}
                    onChange={e => setNewSurpriseText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSurprise()}
                    placeholder="Pesan surprise..."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={addSurprise}
                    className="px-5 py-3 rounded-2xl text-sm font-medium text-rose-950 font-medium relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #f5c842, #e0a020)', boxShadow: '0 0 20px rgba(245,200,66,0.3)', color: '#1a1a1a', whiteSpace: 'nowrap', flex: 'none' }}
                  >
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
                    <span className="relative font-bold">+ Tambah</span>
                  </motion.button>
                </div>

                <div className="space-y-2 relative z-10">
                  {surprises.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center gap-3 group"
                      style={listItemStyle}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="flex-1 text-rose-900 text-sm">{item.text}</span>
                      <button
                        onClick={() => removeSurprise(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all text-red-400/60 hover:text-red-400 text-sm px-2 py-1 rounded-lg"
                      >✕</button>
                    </motion.div>
                  ))}
                  {surprises.length === 0 && (
                    <p className="text-rose-700 text-center text-sm py-6 italic">Belum ada kejutan.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
              style={{ perspective: '1000px' }}
            >
              <div style={cardStyle}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)', borderRadius: 'inherit' }} />
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-cyan-500/20 rounded-tl-lg" />

                <h2 className="text-base font-semibold text-rose-950 font-medium mb-5 flex items-center gap-2.5 relative z-10">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(99,214,255,0.12)', border: '1px solid rgba(99,214,255,0.2)' }}>⚙️</span>
                  Pengaturan Halaman
                </h2>

                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="block text-xs font-medium text-rose-700 font-medium mb-2 uppercase tracking-widest">Judul Utama</label>
                    <input
                      type="text"
                      value={pageTitle}
                      onChange={e => setPageTitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-rose-700 font-medium mb-2 uppercase tracking-widest">Subjudul</label>
                    <input
                      type="text"
                      value={pageSubtitle}
                      onChange={e => setPageSubtitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div
                  className="mt-6 p-4 rounded-2xl relative z-10"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <h3 className="text-rose-700 text-xs font-medium uppercase tracking-widest mb-3">Info Login</h3>
                  <div className="space-y-2">
                    <p className="text-rose-800 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      Pin admin:{' '}
                      <code
                        className="text-violet-400 text-xs px-2 py-0.5 rounded-lg"
                        style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
                      >270907</code>
                    </p>
                    <p className="text-rose-800 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      User PIN:{' '}
                      <code
                        className="text-rose-400 text-xs px-2 py-0.5 rounded-lg"
                        style={{ background: 'rgba(255,62,142,0.1)', border: '1px solid rgba(255,62,142,0.2)' }}
                      >030709</code>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
