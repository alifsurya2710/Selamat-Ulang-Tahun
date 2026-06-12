'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import BirthdayCard from './components/BirthdayCard';
import PhotoGallery from './components/PhotoGallery';
import MusicPlayer from './components/MusicPlayer';

type Tab = 'celebration' | 'surprise' | 'moments';

// Floating particle
function FloatingEmoji({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-2xl"
      style={style}
      animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4], rotate: [-5, 5, -5] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {emoji}
    </motion.div>
  );
}

// Star
function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <div
      className="absolute rounded-full animate-twinkle"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: 'white',
        boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.8)`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function Home() {
  const { role, logout } = useAuth();
  const router = useRouter();
  const [showCard, setShowCard] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [activeTab, setActiveTab] = useState<Tab>('celebration');
  const [pageTitle, setPageTitle] = useState('Happy Birthday!');
  const [pageSubtitle, setPageSubtitle] = useState('Untuk seseorang yang spesial');
  const [messages, setMessages] = useState<string[]>([]);
  const [surprises, setSurprises] = useState<{ id: number; emoji: string; text: string }[]>([]);
  const [revealedSurprise, setRevealedSurprise] = useState<{ id: number; emoji: string; text: string } | null>(null);
  const [isGiftHovered, setIsGiftHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [giftPhase, setGiftPhase] = useState<'intro' | 'pick' | 'done'>('intro');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const surpriseCardRef = useRef<HTMLDivElement>(null);
  const surpriseCardRef2 = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  const stars = Array.from({ length: isMobile ? 4 : 60 }, (_, i) => ({
    x: (i * 11.3) % 100,
    y: (i * 17.9) % 100,
    size: 1 + (i % 3),
    delay: (i * 0.3) % 4,
  }));

  useEffect(() => {
    if (!role) { router.push('/login'); return; }
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 8,
      });
    };
    window.addEventListener('mousemove', handleMouse);

    fetch('/api/pengaturan')
      .then(res => res.json())
      .then(data => {
        if (data.judul) setPageTitle(data.judul);
        if (data.subjudul) setPageSubtitle(data.subjudul);
      }).catch(console.error);

    fetch('/api/pesan')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data.map((p: any) => p.text));
      }).catch(console.error);

    fetch('/api/kejutan')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setSurprises(data);
      }).catch(console.error);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
    };
  }, [role, router]);

  const handleCardOpen = () => {
    setShowCard(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
  };

  const handleDownloadSurprise = useCallback(async () => {
    const refs = [surpriseCardRef.current, surpriseCardRef2.current].filter(Boolean) as HTMLDivElement[];
    if (refs.length === 0) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const timestamp = Date.now();
      await Promise.all(
        refs.map(async (el, i) => {
          const canvas = await html2canvas(el, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            logging: false,
          });
          const link = document.createElement('a');
          link.download = `hadiah-${i + 1}-ulang-tahun-${timestamp}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        })
      );
    } catch (err) {
      console.error('Gagal download gambar:', err);
    } finally {
      setIsDownloading(false);
      setDownloadDone(true);
    }
  }, []);

  if (!role) return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'celebration', label: 'Perayaan', icon: '✨' },
    { id: 'surprise', label: 'Kejutan', icon: '🎁' },
    { id: 'moments', label: 'Kenangan', icon: '💝' },
  ];

  return (
    <main
      className={`min-h-screen relative${isMobile ? '' : ' noise-overlay'}`}
      style={{
        background: 'linear-gradient(135deg, #ffb3c6 0%, #ffc8d6 40%, #ffc2d1 70%, #ffb3c6 100%)',
      }}
    >
      {/* Starfield - static on mobile for perf */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {stars.map((s, i) => (
          isMobile ? (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: s.size,
                height: s.size,
                left: `${s.x}%`,
                top: `${s.y}%`,
                background: 'white',
                opacity: 0.3,
              }}
            />
          ) : <Star key={i} {...s} />
        ))}
      </div>

      {/* Ambient orbs */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: 800,
              height: 800,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
              top: '-300px',
              left: '-200px',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{
              position: 'absolute',
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,62,142,0.2) 0%, transparent 70%)',
              bottom: '-200px',
              right: '-200px',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            style={{
              position: 'absolute',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,200,66,0.15) 0%, transparent 70%)',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}

      {/* Grid - desktop only */}
      {!isMobile && <div className="fixed inset-0 grid-lines opacity-20 pointer-events-none z-0" />}

      {/* Confetti */}
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={isMobile ? 20 : 400}
          recycle={false}
          colors={['#ff3e8e', '#a855f7', '#f5c842', '#ff6eb4', '#7c3aed', '#ec4899', '#fbbf24']}
          gravity={0.15}
        />
      )}

      {/* Birthday Card */}
      <AnimatePresence>
        {showCard && <BirthdayCard onOpen={handleCardOpen} />}
      </AnimatePresence>

      {/* Top Bar */}
      {!showCard && (
        <div
          className="sticky top-0 z-50"
          style={{
            background: 'rgba(255,179,198,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(255,62,142,0.6))' }}>🎂</span>
              <span
                className="text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #ff6eb4, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                color: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Happy Birthday Intan Juliyanti 🎉
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="text-xs text-rose-800 hover:text-rose-950 font-medium px-5 py-2 rounded-full transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Keluar
            </motion.button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showCard && (
        <div className="relative z-10">
          {/* Tabs */}
          <div className="flex justify-center pt-8 pb-6 px-2 md:px-4">
            <div
              className="flex flex-wrap justify-center p-1.5 rounded-2xl gap-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-5 py-2.5 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.35)',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                        boxShadow: '0 0 20px rgba(255,62,142,0.4), 0 4px 15px rgba(0,0,0,0.3)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">

            {/* === CELEBRATION TAB === */}
            {activeTab === 'celebration' && (
              <motion.section
                key="celebration"
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -30, rotateX: -5 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto px-4 pb-24"
                style={{ perspective: '1200px' }}
              >
                {/* 3D Hero Card */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0, rotateX: 20 }}
                  animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 80 }}
                  style={{
                    perspective: '1000px',
                    rotateX: isMobile ? 0 : mousePos.y * 0.05,
                    rotateY: isMobile ? 0 : mousePos.x * 0.05,
                  }}
                  className="relative mx-auto w-full max-w-sm mb-8"
                >
                  <div
                    className="relative aspect-square rounded-[2.5rem] overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, #1a0a2e, #2d1158)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `
                        0 40px 80px rgba(0,0,0,0.7),
                        0 0 0 1px rgba(255,255,255,0.05) inset,
                        0 0 60px rgba(168,85,247,0.15),
                        0 0 120px rgba(255,62,142,0.08)
                      `,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Animated gradient bg */}
                    <div
                    className="absolute inset-0 animate-gradient"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,62,142,0.3), rgba(168,85,247,0.3), rgba(245,200,66,0.15), rgba(255,62,142,0.3))',
                        backgroundSize: '300% 300%',
                      }}
                    />

                    {/* Glassy grid */}
                    <div className="absolute inset-0 grid-lines opacity-30" />

                    {/* Shine */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%)',
                      }}
                    />

                    {/* Floating particles inside - desktop only */}
                    {!isMobile && (
                      <div className="absolute inset-0 overflow-hidden">
                        {['✨', '💕', '⭐', '🌸', '💫', '🎀'].map((emoji, i) => (
                          <FloatingEmoji
                            key={i}
                            emoji={emoji}
                            style={{
                              left: `${15 + i * 14}%`,
                              top: `${10 + (i % 3) * 25}%`,
                              fontSize: i % 2 === 0 ? '1.5rem' : '1rem',
                              opacity: 0.5,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="text-center relative z-10">
                        <motion.h2
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, type: 'spring' }}
                          className="text-4xl md:text-5xl font-black leading-tight mb-3"
                          style={{
                            fontFamily: 'Playfair Display, serif',
                            background: 'linear-gradient(135deg, #ffffff 0%, #ff9fe0 40%, #f5c842 80%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                color: 'transparent',
                            backgroundClip: 'text',
                            textShadow: 'none',
                            filter: 'drop-shadow(0 4px 20px rgba(255,62,142,0.4))',
                          }}
                        >
                          {pageTitle}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-rose-900 text-sm font-light tracking-wide"
                        >
                          {pageSubtitle}
                        </motion.p>

                        {/* 3D cake */}
                        <motion.div
                          animate={{ y: [0, -8, 0], rotateY: [0, 10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-5xl mt-4 inline-block"
                          style={{ filter: 'drop-shadow(0 10px 20px rgba(255,62,142,0.5))' }}
                        >
                          🎂
                        </motion.div>
                      </div>
                    </div>

                    {/* Bottom glow bar */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,62,142,0.6), rgba(168,85,247,0.6), transparent)' }}
                    />
                  </div>
                </motion.div>

                {/* Message label */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative px-6 py-2.5 rounded-full overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                      boxShadow: '0 0 30px rgba(255,62,142,0.4), 0 0 60px rgba(168,85,247,0.2)',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }}
                    />
                    <span className="relative text-rose-950 font-medium text-xs font-semibold tracking-[0.15em] uppercase">
                      Ucapan Dari Fans Terbaikmu
                    </span>
                  </motion.div>
                </div>

                {/* Message Card */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.25, type: 'spring' }}
                  className="relative rounded-3xl p-8 md:p-10 overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
                  }}
                >
                  {/* Shine */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)', borderRadius: 'inherit' }}
                  />

                  {/* Corner decorations */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-rose-500/20 rounded-tl-lg" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-violet-500/20 rounded-br-lg" />

                  <div className="space-y-5 relative z-10">
                    {messages.length > 0 ? (
                      messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + i * 0.12 }}
                          className="flex items-start gap-3"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                            style={{
                              background: i % 2 === 0
                                ? 'linear-gradient(135deg, #ff3e8e, #ff6eb4)'
                                : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                              boxShadow: i % 2 === 0
                                ? '0 0 8px rgba(255,62,142,0.6)'
                                : '0 0 8px rgba(168,85,247,0.6)',
                            }}
                          />
                          <p
                            className="text-rose-900 text-base leading-relaxed italic"
                            style={{ fontFamily: 'Georgia, serif' }}
                          >
                            &ldquo;{msg}&rdquo;
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-rose-700 text-center italic text-sm">
                        Belum ada pesan. Admin bisa menambahkan pesan di panel admin.
                      </p>
                    )}
                  </div>

                  {/* Floating emojis bottom - simplified on mobile */}
                  <div className="flex justify-center gap-5 mt-8 text-2xl">
                    {(isMobile ? ['🎁', '🎂', '💖'] : ['🎁', '🎈', '🎂', '✨', '💖']).map((emoji, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }}
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(255,62,142,0.3))' }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.section>
            )}

            {/* === SURPRISE TAB === */}
            {activeTab === 'surprise' && (
              <motion.section
                key="surprise"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto px-4 pb-24"
              >
                {/* === INTRO PHASE === */}
                {giftPhase === 'intro' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center mb-10"
                    >
                      <h2
                        className="text-4xl md:text-5xl font-black mb-2"
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          background: 'linear-gradient(135deg, #ff6eb4 0%, #ff3e8e 40%, #f5c842 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          color: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(0 0 30px rgba(255,62,142,0.4))',
                        }}
                      >
                        Hadiahmu Menunggu!
                      </h2>
                      <p className="text-rose-700 font-medium text-sm tracking-widest uppercase">
                        Kamu bisa pilih 2 hadiah spesial 🎁
                      </p>
                    </motion.div>

                    {/* Big Gift Box Intro */}
                  {/* Intro rings - simplified on mobile */}
                  <div className="relative flex items-center justify-center mb-10" style={{ height: isMobile ? 200 : 300 }}>
                    {(isMobile ? [200, 280] : [280, 340, 400]).map((size, idx) => (
                        <motion.div
                          key={idx}
                          className="absolute rounded-full"
                          style={{
                            width: size,
                            height: size,
                            border: `1px ${idx === 0 ? 'solid' : 'dashed'} rgba(255,62,142,${0.12 - idx * 0.03})`,
                          }}
                          animate={{ rotate: idx % 2 === 0 ? 360 : -360 }}
                          transition={{ duration: 20 + idx * 8, repeat: Infinity, ease: 'linear' }}
                        />
                      ))}
                      <div
                        className="absolute w-48 h-48 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(255,62,142,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }}
                      />
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
                        onHoverStart={() => setIsGiftHovered(true)}
                        onHoverEnd={() => setIsGiftHovered(false)}
                        whileHover={{ scale: 1.08, rotateY: 10, rotateX: -5 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          if (surprises.length === 0) return;
                          setGiftPhase('pick');
                          setSelectedGifts([]);
                          setFlippedCards([]);
                        }}
                        className="relative w-52 h-52 rounded-[2.5rem] flex items-center justify-center cursor-pointer"
                        style={{
                          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: isGiftHovered
                            ? '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,62,142,0.3)'
                            : '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,62,142,0.1)',
                          transformStyle: 'preserve-3d',
                          transition: 'box-shadow 0.4s ease',
                        }}
                      >
                        <div className="absolute inset-0 pointer-events-none rounded-[2.5rem]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)' }} />
                        <motion.span
                          animate={isGiftHovered ? { y: [-5, -15, -5], scale: [1, 1.15, 1], rotate: [-5, 5, -5] } : { y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-8xl"
                          style={{ filter: 'drop-shadow(0 10px 30px rgba(255,62,142,0.5))' }}
                        >
                          🎁
                        </motion.span>
                        <AnimatePresence>
                          {isGiftHovered && (
                            <>
                              {['✨', '⭐', '💫', '🌟'].map((spark, i) => (
                                <motion.span key={i} className="absolute text-lg"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 15)], y: [0, -(40 + i * 10)] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                >{spark}</motion.span>
                              ))}
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { if (surprises.length > 0) { setGiftPhase('pick'); setSelectedGifts([]); setFlippedCards([]); } }}
                        className="px-10 py-4 rounded-2xl font-bold text-white text-sm tracking-wide"
                        style={{
                          background: surprises.length === 0 ? 'rgba(200,150,170,0.4)' : 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                          boxShadow: surprises.length === 0 ? 'none' : '0 0 30px rgba(255,62,142,0.4), 0 8px 20px rgba(0,0,0,0.3)',
                          fontFamily: 'Outfit, sans-serif',
                          cursor: surprises.length === 0 ? 'not-allowed' : 'pointer',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {surprises.length === 0 ? 'Belum ada hadiah tersedia' : '✨ Buka Hadiahnya!'}
                      </motion.button>
                    </motion.div>
                  </>
                )}

                {/* === PICK PHASE === */}
                {giftPhase === 'pick' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-8"
                    >
                      <h2
                        className="text-3xl md:text-4xl font-black mb-2"
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          background: 'linear-gradient(135deg, #ff6eb4 0%, #ff3e8e 40%, #f5c842 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          color: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(0 0 20px rgba(255,62,142,0.4))',
                        }}
                      >
                        Pilih 2 Hadiahmu! 🎀
                      </h2>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        {[0, 1].map(i => (
                          <motion.div
                            key={i}
                            animate={{ scale: selectedGifts.length > i ? 1.2 : 1 }}
                            className="w-4 h-4 rounded-full border-2"
                            style={{
                              borderColor: selectedGifts.length > i ? '#ff3e8e' : 'rgba(255,62,142,0.3)',
                              background: selectedGifts.length > i ? 'linear-gradient(135deg, #ff3e8e, #a855f7)' : 'transparent',
                              boxShadow: selectedGifts.length > i ? '0 0 10px rgba(255,62,142,0.5)' : 'none',
                            }}
                          />
                        ))}
                        <span className="text-rose-700 text-sm font-medium ml-1">
                          {selectedGifts.length}/2 dipilih
                        </span>
                      </div>
                    </motion.div>

                    {/* Mystery Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {surprises.map((surprise, i) => {
                        const isFlipped = flippedCards.includes(surprise.id);
                        const isSelected = selectedGifts.includes(surprise.id);
                        const maxReached = selectedGifts.length >= 2 && !isSelected;
                        return (
                          <motion.div
                            key={surprise.id}
                            initial={{ opacity: 0, y: 30, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
                            style={{ perspective: '600px' }}
                          >
                            <motion.div
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                              style={{ transformStyle: 'preserve-3d', position: 'relative', height: '160px' }}
                            >
                              {/* Card Back (mystery) */}
                              <div
                                onClick={() => {
                                  if (isFlipped || maxReached) return;
                                  setFlippedCards(prev => [...prev, surprise.id]);
                                  setSelectedGifts(prev => [...prev, surprise.id]);
                                  if (selectedGifts.length + 1 >= 2) {
                                    setTimeout(() => setGiftPhase('done'), 400);
                                    setShowConfetti(true);
                                    setTimeout(() => setShowConfetti(false), 5000);
                                  }
                                }}
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  backfaceVisibility: 'hidden',
                                  WebkitBackfaceVisibility: 'hidden',
                                  borderRadius: '1.5rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: isFlipped || maxReached ? 'not-allowed' : 'pointer',
                                  background: maxReached
                                    ? 'linear-gradient(145deg, rgba(200,150,170,0.3), rgba(200,150,170,0.2))'
                                    : 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
                                  border: `2px solid ${maxReached ? 'rgba(200,150,170,0.2)' : 'rgba(255,255,255,0.15)'}`,
                                  backdropFilter: 'blur(16px)',
                                  boxShadow: maxReached ? 'none' : '0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255,62,142,0.08)',
                                  opacity: maxReached ? 0.5 : 1,
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)', borderRadius: 'inherit', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                                <motion.span
                                  animate={maxReached ? {} : { y: [0, -6, 0], rotate: [-5, 5, -5] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                                  style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 12px rgba(255,62,142,0.4))', display: 'block' }}
                                >
                                  🎁
                                </motion.span>
                                <span style={{ color: maxReached ? 'rgba(180,120,140,0.6)' : 'rgba(255,62,142,0.7)', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.1em', marginTop: '8px', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
                                  {maxReached ? 'Sudah penuh' : 'Ketuk!'}
                                </span>
                              </div>

                              {/* Card Front (revealed) */}
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  backfaceVisibility: 'hidden',
                                  WebkitBackfaceVisibility: 'hidden',
                                  transform: 'rotateY(180deg)',
                                  borderRadius: '1.5rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: '1rem',
                                  textAlign: 'center',
                                  background: 'linear-gradient(145deg, rgba(255,180,210,0.95), rgba(255,210,230,0.9))',
                                  border: '2px solid rgba(255,255,255,0.5)',
                                  backdropFilter: 'blur(16px)',
                                  boxShadow: '0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255,62,142,0.15)',
                                }}
                              >
                                <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%)', borderRadius: 'inherit', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                                <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 10px rgba(255,62,142,0.4))', display: 'block', marginBottom: '6px' }}>
                                  {surprise.emoji}
                                </span>
                                <p style={{ color: '#7f1d3a', fontSize: '0.7rem', fontWeight: '600', lineHeight: '1.3', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                  {surprise.text.length > 40 ? surprise.text.slice(0, 40) + '...' : surprise.text}
                                </p>
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <motion.div className="text-center">
                      <button
                        onClick={() => { setGiftPhase('intro'); setSelectedGifts([]); setFlippedCards([]); }}
                        style={{ color: 'rgba(255,62,142,0.6)', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        ← Kembali
                      </button>
                    </motion.div>
                  </>
                )}

                {/* === DONE PHASE === */}
                {giftPhase === 'done' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        className="text-6xl mb-3"
                        style={{ filter: 'drop-shadow(0 8px 20px rgba(255,62,142,0.4))' }}
                      >
                        🎉
                      </motion.div>
                      <h2
                        className="text-3xl md:text-4xl font-black mb-2"
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          background: 'linear-gradient(135deg, #ff6eb4 0%, #ff3e8e 40%, #f5c842 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          color: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        Hadiahmu!
                      </h2>
                      <p className="text-rose-700 text-sm font-medium">Inilah 2 hadiah spesial yang kamu pilih ✨</p>
                    </motion.div>

                    <div className="space-y-5 mb-8">
                      {surprises.filter(s => selectedGifts.includes(s.id)).map((gift, i) => (
                        <motion.div
                          key={gift.id}
                          initial={{ opacity: 0, x: i === 0 ? -40 : 40, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: i * 0.2, type: 'spring', stiffness: 100 }}
                          ref={i === 0 ? surpriseCardRef : surpriseCardRef2}
                          className="rounded-3xl p-7 relative overflow-hidden"
                          style={{
                            background: i === 0
                              ? 'linear-gradient(145deg, rgba(255,180,210,0.95), rgba(255,210,230,0.9))'
                              : 'linear-gradient(145deg, rgba(220,180,255,0.95), rgba(240,210,255,0.9))',
                            border: '1px solid rgba(255,255,255,0.5)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: i === 0
                              ? '0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(255,62,142,0.15)'
                              : '0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(168,85,247,0.15)',
                          }}
                        >
                          <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)', borderRadius: 'inherit', position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                          <div className="flex items-center gap-5 relative z-10">
                            <motion.span
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', delay: i * 0.2 + 0.15, stiffness: 200 }}
                              style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 8px 16px rgba(255,62,142,0.4))', flexShrink: 0 }}
                            >
                              {gift.emoji}
                            </motion.span>
                            <div>
                              <div style={{ background: i === 0 ? 'linear-gradient(135deg, #ff3e8e, #ff6eb4)' : 'linear-gradient(135deg, #a855f7, #7c3aed)', borderRadius: '999px', padding: '2px 10px', display: 'inline-block', marginBottom: '6px' }}>
                                <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.1em', fontFamily: 'Outfit, sans-serif' }}>HADIAH {i + 1}</span>
                              </div>
                              <p style={{ color: '#5b0e2a', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.5', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                &ldquo;{gift.text}&rdquo;
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3">
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleDownloadSurprise}
                        disabled={isDownloading}
                        whileHover={isDownloading ? {} : { scale: 1.03 }}
                        whileTap={isDownloading ? {} : { scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-sm"
                        style={{
                          background: isDownloading ? 'rgba(255,62,142,0.3)' : 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                          color: 'white',
                          boxShadow: isDownloading ? 'none' : '0 0 25px rgba(255,62,142,0.45), 0 4px 15px rgba(0,0,0,0.3)',
                          fontFamily: 'Outfit, sans-serif',
                          cursor: isDownloading ? 'not-allowed' : 'pointer',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {isDownloading ? (
                          <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⏳</motion.span> Menyiapkan gambar...</>
                        ) : (
                          <><span>📥</span> Download Kartu Hadiahku</>
                        )}
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65 }}
                        onClick={() => { setGiftPhase('intro'); setSelectedGifts([]); setFlippedCards([]); setDownloadDone(false); }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-6 rounded-2xl font-medium text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,62,142,0.25)',
                          color: '#c0396e',
                          fontFamily: 'Outfit, sans-serif',
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer',
                        }}
                      >
                        🔄 Pilih Ulang Hadiah
                      </motion.button>
                    </div>

                    {/* Post-download message */}
                    <AnimatePresence>
                      {downloadDone && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 120 }}
                          className="mt-5 text-center px-5 py-4 rounded-2xl relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,200,220,0.6), rgba(220,190,255,0.5))',
                            border: '1px solid rgba(255,255,255,0.4)',
                            backdropFilter: 'blur(12px)',
                          }}
                        >
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)', borderRadius: 'inherit', pointerEvents: 'none' }} />
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                              color: '#7f1d3a',
                              fontSize: '0.95rem',
                              fontFamily: 'Georgia, serif',
                              fontStyle: 'italic',
                              fontWeight: '500',
                              lineHeight: '1.6',
                            }}
                          >
                            Kalau sudah di-download, kirim ke aku yaa 😊
                          </motion.p>
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ fontSize: '1.4rem', marginTop: '6px' }}
                          >
                            💌
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.section>
            )}

            {/* === MOMENTS TAB === */}
            {activeTab === 'moments' && (
              <motion.section
                key="moments"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto px-4 pb-24"
              >
                <div className="text-center mb-10">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black mb-2"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      background: 'linear-gradient(135deg, #ff6eb4 0%, #ff3e8e 40%, #f5c842 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                color: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 20px rgba(255,62,142,0.3))',
                    }}
                  >
                    Kenangan Bersama
                  </motion.h2>
                  <p className="text-rose-700 font-medium text-sm tracking-wider">Momen-momen indah yang tak terlupakan</p>
                </div>
                <PhotoGallery />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-12 text-center px-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                background: 'linear-gradient(135deg, rgba(255,110,180,0.5), rgba(168,85,247,0.5))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dibuat dengan 💖 untuk seseorang yang istimewa
            </p>
          </motion.footer>

          <MusicPlayer />
        </div>
      )}
    </main>
  );
}
