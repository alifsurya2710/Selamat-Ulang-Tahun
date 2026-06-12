'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: { [index: number]: { transcript: string } };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

// Floating particle component
function Particle({ index }: { index: number }) {
  const colors = ['#ff3e8e', '#a855f7', '#f5c842', '#ff6eb4', '#7c3aed'];
  const color = colors[index % colors.length];
  const size = 3 + (index % 4) * 2;
  const duration = 8 + (index % 5) * 3;
  const delay = (index % 8) * 0.7;
  const xPos = (index * 13.7) % 100;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        left: `${xPos}%`,
        bottom: '-10px',
      }}
      animate={{
        y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 900) - 100],
        x: [0, Math.sin(index) * 80],
        opacity: [0, 0.8, 0.8, 0],
        scale: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Star component
function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: 'white',
        boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.8)`,
      }}
      animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
      transition={{ duration: 2 + delay, repeat: Infinity, delay }}
    />
  );
}

// Floating flower component
function FloatingFlower({ index }: { index: number }) {
  const flowers = ['🌸', '🌺', '🌷', '🌼', '💐', '🌸', '🌺'];
  const emoji = flowers[index % flowers.length];
  const size = 16 + (index % 3) * 8;
  const duration = 12 + (index % 6) * 2;
  const delay = (index * 1.3) % 10;
  const xPos = (index * 17.3) % 95;
  const swayAmount = 30 + (index % 4) * 20;
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${xPos}%`, bottom: '-60px', fontSize: size, opacity: 0 }}
      animate={{
        y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 100 : 1000)],
        x: [0, swayAmount, -swayAmount, swayAmount / 2, 0],
        opacity: [0, 0.7, 0.7, 0.5, 0],
        rotate: [0, 15, -10, 10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.2, 0.5, 0.8, 1],
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Floating heart component (static floating)
function FloatingHeart({ index }: { index: number }) {
  const hearts = ['💗', '💖', '💕', '💓', '💝', '❤️', '🩷'];
  const emoji = hearts[index % hearts.length];
  const size = 14 + (index % 4) * 8;
  const xPos = (index * 23.1) % 90;
  const yPos = (index * 19.7) % 85;
  const duration = 3 + (index % 4);
  const delay = (index * 0.8) % 5;
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${xPos}%`, top: `${yPos}%`, fontSize: size }}
      animate={{
        y: [0, -12, 0],
        scale: [1, 1.1, 1],
        opacity: [0.25, 0.5, 0.25],
        rotate: [-5, 5, -5],
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

// Heart rain component
function HeartRain({ index }: { index: number }) {
  const hearts = ['💗', '💖', '💕', '💓', '🩷', '❤️‍🔥', '💘'];
  const emoji = hearts[index % hearts.length];
  const size = 12 + (index % 5) * 6;
  const duration = 5 + (index % 5) * 1.5;
  const delay = (index * 0.6) % 8;
  const xPos = (index * 11.3) % 97;
  const swayX = (index % 2 === 0 ? 1 : -1) * (15 + (index % 3) * 10);
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${xPos}%`, top: '-60px', fontSize: size }}
      animate={{
        y: [0, typeof window !== 'undefined' ? window.innerHeight + 100 : 900],
        x: [0, swayX, 0],
        opacity: [0, 0.9, 0.9, 0],
        rotate: [0, index % 2 === 0 ? 20 : -20, 0],
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

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [lockTaps, setLockTaps] = useState(0);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voicePhase, setVoicePhase] = useState<'idle' | 'listening' | 'success' | 'fail'>('idle');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const PIN_LENGTH = 6;

  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 17.3) % 100,
    y: (i * 23.7) % 100,
    size: 1 + (i % 3),
    delay: (i % 5) * 0.4,
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const checkVoiceMatch = useCallback((transcript: string): boolean => {
    const lower = transcript.toLowerCase().trim()
      .replace(/[.,!?]/g, '') // hapus tanda baca
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // hapus aksen

    // Frasa lengkap (semua variasi)
    const fullPhrases = [
      'selamat ulang tahun', 'slamat ulang tahun',
      'selamat ulang taun', 'slamat ulang taun',
      'selamat ualang tahun', 'selamat ultah',
      'happy birthday',
    ];
    for (const phrase of fullPhrases) {
      if (lower.includes(phrase)) return true;
    }

    // Cukup ada 2 dari 3 kata kunci
    const hasSelamat = lower.includes('selamat') || lower.includes('slamat') || lower.includes('lam');
    const hasUlang = lower.includes('ulang') || lower.includes('ulan') || lower.includes('ultah') || lower.includes('hari jadi');
    const hasTahun = lower.includes('tahun') || lower.includes('taun') || lower.includes('tahum');
    const matchCount = [hasSelamat, hasUlang, hasTahun].filter(Boolean).length;
    return matchCount >= 2;
  }, []);

  const startListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoicePhase('idle');
      return;
    }
    const SpeechRecognitionAPI = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;
    if (!SpeechRecognitionAPI) {
      setError('Gunakan Chrome untuk voice recognition.');
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'id-ID';
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setIsListening(true);
    setVoicePhase('listening');
    setVoiceText('');
    setError('');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      const transcript = finalTranscript.toLowerCase();
      setVoiceText(transcript);
      if (finalTranscript && checkVoiceMatch(finalTranscript)) {
        setVoicePhase('success');
        setIsListening(false);
        setTimeout(() => {
          const success = login('user', '030709');
          if (success) router.push('/');
        }, 800);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setVoicePhase('fail');
        setVoiceText('Tidak terdengar, coba lagi');
        setTimeout(() => { setVoicePhase('idle'); setVoiceText(''); }, 2000);
      } else if (event.error !== 'aborted') {
        setVoicePhase('fail');
        setTimeout(() => { setVoicePhase('idle'); setVoiceText(''); }, 2000);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (voicePhase === 'listening') {
        if (voiceText && checkVoiceMatch(voiceText)) {
          setVoicePhase('success');
          setTimeout(() => {
            const success = login('user', '030709');
            if (success) router.push('/');
          }, 800);
        } else if (voiceText) {
          setVoicePhase('fail');
          setTimeout(() => { setVoicePhase('idle'); setVoiceText(''); }, 2000);
        }
      }
    };
    recognition.start();
  };

  const handlePinInput = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError('');
    if (newPin.length === PIN_LENGTH) {
      setTimeout(() => {
        const role = adminMode ? 'admin' : 'user';
        const success = login(role, newPin);
        if (success) {
          router.push(role === 'admin' ? '/admin' : '/');
        } else {
          setError(adminMode ? 'Password salah!' : 'PIN salah, coba lagi');
          setShake(true);
          setTimeout(() => { setShake(false); setPin(''); }, 600);
        }
      }, 200);
    }
  };

  const handleDelete = () => { setPin(pin.slice(0, -1)); setError(''); };

  const handleLockTap = () => {
    const newTaps = lockTaps + 1;
    setLockTaps(newTaps);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => setLockTaps(0), 1500);
    if (newTaps >= 3) {
      setAdminMode(!adminMode);
      setPin(''); setError(''); setLockTaps(0);
    }
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden noise-overlay"
      style={{
        background: 'linear-gradient(135deg, #ffb3c6 0%, #ffc8d6 40%, #ffc2d1 70%, #ffb3c6 100%)',
      }}
    >
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((s, i) => <Star key={i} {...s} />)}
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => <Particle key={i} index={i} />)}
      </div>

      {/* Floating Flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => <FloatingFlower key={i} index={i} />)}
      </div>

      {/* Floating Hearts (ambient) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }, (_, i) => <FloatingHeart key={i} index={i} />)}
      </div>

      {/* Heart Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }, (_, i) => <HeartRain key={i} index={i} />)}
      </div>
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            top: '-200px',
            left: '-100px',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute"
          style={{
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,62,142,0.25) 0%, transparent 70%)',
            bottom: '-150px',
            right: '-100px',
          }}
        />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />

      {/* 3D Card container */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          perspective: '1200px',
          rotateX: mousePos.y * 0.1,
          rotateY: mousePos.x * 0.1,
        }}
        className="relative z-10 flex flex-col items-center w-full max-w-sm px-4"
      >
        {/* Main card */}
        <div
          className="w-full rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: `
              0 30px 80px rgba(0,0,0,0.6),
              0 0 0 1px rgba(255,255,255,0.06) inset,
              0 1px 0 rgba(255,255,255,0.15) inset,
              0 0 60px rgba(168,85,247,0.1)
            `,
          }}
        >
          {/* Card inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
              borderRadius: 'inherit',
            }}
          />

          {/* Decorative corner lines */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-rose-500/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-violet-500/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-rose-500/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-violet-500/30 rounded-br-lg" />

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {/* Floating Logo */}
            <div className="relative inline-block mb-4">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
                <img 
                  src="/logo.png" 
                  alt="Selamat Ulang Tahun" 
                  className="w-28 h-28 object-contain rounded-full border-2 border-pink-200"
                  style={{ filter: 'drop-shadow(0 0 15px rgba(255,62,142,0.5))' }}
                  onError={(e) => {
                    // Fallback to emoji if image is not uploaded yet
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-6xl">{adminMode ? '🔐' : '🎁'}</span>
              </motion.div>

              {/* Orbiting sparkles */}
              {!adminMode && (
                <>
                  <motion.span
                    className="absolute text-sm"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{ top: 0, left: '50%', transformOrigin: '0 50px' }}
                  >✨</motion.span>
                  <motion.span
                    className="absolute text-xs"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ top: '50%', left: 0, transformOrigin: '50px 0' }}
                  >💫</motion.span>
                </>
              )}
            </div>

            <h1
              className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                backgroundImage: adminMode
                  ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                  : 'linear-gradient(135deg, #ff6eb4 0%, #ff3e8e 40%, #f5c842 100%)',
              }}
            >
              {adminMode ? 'Akses Admin' : 'Selamat Datang'}
            </h1>
            <p className="text-rose-800 text-sm font-light">
              {adminMode
                ? 'Masukkan pin admin'
                : voicePhase === 'idle'
                  ? 'Masukkan PIN atau ucapkan kata ajaib'
                  : voicePhase === 'listening'
                    ? '🎙️ Mendengarkan...'
                    : voicePhase === 'success'
                      ? '✨ Benar! Selamat datang!'
                      : '💔 Coba lagi ya...'}
            </p>
          </motion.div>

          {/* Voice Section */}
          <AnimatePresence>
            {!adminMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mb-6"
              >
                <div className="flex flex-col items-center">
                  {/* 3D Mic button */}
                  <div className="relative mb-4" style={{ perspective: '800px' }}>
                    <motion.button
                      whileHover={{ scale: 1.08, rotateX: -10 }}
                      whileTap={{ scale: 0.92, rotateX: 5 }}
                      onClick={startListening}
                      className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isListening
                          ? 'linear-gradient(135deg, #ff3e8e, #ff6eb4)'
                          : voicePhase === 'success'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, rgba(255,62,142,0.15), rgba(168,85,247,0.15))',
                        border: isListening
                          ? '2px solid rgba(255,62,142,0.6)'
                          : '1px solid rgba(255,255,255,0.15)',
                        boxShadow: isListening
                          ? '0 0 30px rgba(255,62,142,0.5), 0 0 60px rgba(255,62,142,0.2), 0 10px 30px rgba(0,0,0,0.4)'
                          : '0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.2)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Pulse rings when listening */}
                      <AnimatePresence>
                        {isListening && (
                          <>
                            {[1, 2, 3].map((ring) => (
                              <motion.div
                                key={ring}
                                className="absolute inset-0 rounded-full"
                                style={{ border: '2px solid rgba(255,62,142,0.5)' }}
                                initial={{ scale: 1, opacity: 0.7 }}
                                animate={{ scale: 2.5 + ring * 0.3, opacity: 0 }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: ring * 0.4,
                                  ease: 'easeOut',
                                }}
                              />
                            ))}
                          </>
                        )}
                      </AnimatePresence>

                      {isListening ? (
                        <div className="flex items-center gap-[3px]">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [6, 20, 6] }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: 'easeInOut',
                              }}
                              className="w-[3px] bg-white rounded-full"
                              style={{ height: 6 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <motion.span
                          animate={voicePhase === 'success' ? { scale: [1, 1.3, 1] } : {}}
                          className="text-3xl"
                          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
                        >
                          {voicePhase === 'success' ? '✅' : '🎙️'}
                        </motion.span>
                      )}
                    </motion.button>
                  </div>

                  {/* Voice status */}
                  <AnimatePresence mode="wait">
                    {voiceText ? (
                      <motion.div
                        key={voiceText}
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-4 py-2 rounded-full text-xs text-center"
                        style={{
                          background: voicePhase === 'success'
                            ? 'rgba(16,185,129,0.15)'
                            : voicePhase === 'fail'
                              ? 'rgba(239,68,68,0.15)'
                              : 'rgba(255,255,255,0.05)',
                          border: voicePhase === 'success'
                            ? '1px solid rgba(16,185,129,0.4)'
                            : voicePhase === 'fail'
                              ? '1px solid rgba(239,68,68,0.4)'
                              : '1px solid rgba(255,255,255,0.1)',
                          color: voicePhase === 'success' ? '#34d399' : voicePhase === 'fail' ? '#f87171' : 'rgba(255,255,255,0.5)',
                          maxWidth: 220,
                        }}
                      >
                        &ldquo;{voiceText}&rdquo;
                      </motion.div>
                    ) : !isListening ? (
                      <p className="text-rose-700 text-[10px] text-center italic">
                        Ucapkan: &ldquo;selamat ulang tahun yaa&rdquo;
                      </p>
                    ) : null}
                  </AnimatePresence>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mt-5 mb-2 w-full">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                    <span className="text-rose-700 text-[10px] uppercase tracking-widest">atau PIN</span>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PIN dots */}
          <motion.div
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="flex gap-3 justify-center mb-2"
          >
            {[...Array(PIN_LENGTH)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: i === pin.length ? 1.4 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-3.5 h-3.5 rounded-full relative"
                style={{
                  background: i < pin.length
                    ? adminMode
                      ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                      : 'linear-gradient(135deg, #ff3e8e, #ff6eb4)'
                    : 'rgba(255,255,255,0.08)',
                  border: i < pin.length ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: i < pin.length
                    ? adminMode
                      ? '0 0 15px rgba(168,85,247,0.6)'
                      : '0 0 15px rgba(255,62,142,0.6)'
                    : 'none',
                }}
              />
            ))}
          </motion.div>

          {/* Error */}
          <div className="h-7 flex items-center justify-center">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Number pad */}
          <AnimatePresence>
            {voicePhase !== 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 gap-3 w-full mt-2"
              >
                {digits.map((digit, index) => {
                  if (digit === '') return <div key={index} />;
                  if (digit === 'del') {
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={handleDelete}
                        className="h-14 rounded-2xl flex items-center justify-center transition-all"
                        style={{
                          color: 'rgba(255,255,255,0.35)',
                          background: 'transparent',
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                          <line x1="18" y1="9" x2="12" y2="15" />
                          <line x1="12" y1="9" x2="18" y2="15" />
                        </svg>
                      </motion.button>
                    );
                  }
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.06, y: -2 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => handlePinInput(digit)}
                      disabled={pin.length >= PIN_LENGTH}
                      className="h-14 rounded-2xl flex items-center justify-center text-rose-950 font-medium text-xl font-light transition-all relative overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1) inset',
                      }}
                    >
                      {/* Shine effect */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-50"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
                        }}
                      />
                      <span className="relative z-10">{digit}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to user */}
          <AnimatePresence>
            {adminMode && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setAdminMode(false); setPin(''); setError(''); }}
                className="mt-5 w-full text-rose-700 font-medium text-xs hover:text-rose-900 transition-colors"
              >
                ← Kembali ke mode user
              </motion.button>
            )}
          </AnimatePresence>
        </div>


      </motion.div>

      {/* Secret lock */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={handleLockTap}
        className="fixed bottom-5 right-5 z-20 p-2 opacity-[0.06] hover:opacity-[0.2] transition-opacity duration-500"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </motion.button>

      {lockTaps > 0 && lockTaps < 3 && (
        <div className="fixed bottom-12 right-5 flex gap-1 z-20">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-all duration-300 ${
              i < lockTaps ? 'bg-violet-400/60' : 'bg-white/10'
            }`} />
          ))}
        </div>
      )}
    </div>
  );
}
