'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceMessage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(2500); // estimated ms
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      speechSynthesis.cancel();
    };
  }, []);

  const playVoice = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      return;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance('selamat ulang tahun yaa');
      utterance.lang = 'id-ID';
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 1;

      const voices = speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.startsWith('id')) 
        || voices.find(v => v.lang.startsWith('ms'))
        || voices.find(v => v.name.includes('Female') || v.name.includes('female'));
      if (idVoice) utterance.voice = idVoice;

      utteranceRef.current = utterance;

      utterance.onstart = () => {
        setIsPlaying(true);
        setHasPlayed(true);
        setProgress(0);
        
        const startTime = Date.now();
        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const p = Math.min((elapsed / durationRef.current) * 100, 100);
          setProgress(p);
        }, 50);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setProgress(0), 1000);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };

      durationRef.current = (utterance.text.length / utterance.rate) * 400 + 500;
      speechSynthesis.speak(utterance);
    }
  };

  const bars = 24;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="max-w-md mx-auto relative px-4 md:px-0"
      style={{ perspective: '1000px' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background glow */}
      <div
        className="absolute -inset-4 rounded-[2.5rem] opacity-30 blur-2xl animate-aurora pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,62,142,0.5), rgba(168,85,247,0.5), rgba(99,214,255,0.4))' }}
      />

      <motion.div
        animate={{
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? -5 : 0,
          translateZ: isHovered ? 10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative rounded-[2.5rem] p-8 text-center"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shine */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            borderRadius: 'inherit',
          }}
        />

        {/* Label */}
        <div className="relative z-20">
          <p
            className="text-rose-800 text-[10px] uppercase tracking-[0.4em] mb-3"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Pesan Suara
          </p>
          <h3 className="text-rose-950 font-medium text-lg font-light mb-8 tracking-wide">
            Tap untuk mendengarkan
          </h3>
        </div>

        {/* 3D Play button */}
        <div className="relative mb-8" style={{ perspective: '800px' }}>
          <motion.button
            whileHover={{ scale: 1.08, rotateX: -10 }}
            whileTap={{ scale: 0.92, rotateX: 5 }}
            onClick={playVoice}
            className="relative mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 z-20"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #ff3e8e, #a855f7)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
              border: isPlaying
                ? '1px solid rgba(255,62,142,0.5)'
                : '1px solid rgba(255,255,255,0.15)',
              boxShadow: isPlaying
                ? '0 20px 40px rgba(0,0,0,0.6), 0 0 40px rgba(255,62,142,0.4), 0 1px 0 rgba(255,255,255,0.2) inset'
                : '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(168,85,247,0.15), 0 1px 0 rgba(255,255,255,0.1) inset',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
            />

            {/* Pulse rings */}
            <AnimatePresence>
              {isPlaying && (
                <>
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ border: `2px solid rgba(255,62,142,${0.6 - ring * 0.15})` }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.5 + ring * 0.5, opacity: 0 }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: ring * 0.5, ease: 'easeOut' }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <motion.span
              animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl relative z-10"
              style={{ filter: isPlaying ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}
            >
              {isPlaying ? '🔊' : hasPlayed ? '🔄' : '🎙️'}
            </motion.span>
          </motion.button>
        </div>

        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-[4px] h-12 mb-6 relative z-20">
          {[...Array(bars)].map((_, i) => {
            const distance = Math.abs(i - bars / 2) / (bars / 2);
            const maxHeight = isPlaying ? (1 - distance * 0.5) * 40 : 6;
            const minHeight = 6;
            
            return (
              <motion.div
                key={i}
                animate={isPlaying ? {
                  height: [minHeight, maxHeight * (0.4 + Math.random() * 0.6), minHeight],
                  opacity: [0.6, 1, 0.6],
                } : {
                  height: minHeight,
                  opacity: 0.3,
                }}
                transition={isPlaying ? {
                  duration: 0.3 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: i * 0.02,
                  ease: 'easeInOut',
                } : {
                  duration: 0.3,
                }}
                className="w-[3px] rounded-full"
                style={{
                  background: isPlaying
                    ? `linear-gradient(to top, #ff3e8e, #a855f7)`
                    : 'rgba(255,255,255,0.2)',
                  boxShadow: isPlaying ? '0 0 10px rgba(255,62,142,0.5)' : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden relative z-20 shadow-inner">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #ff3e8e, #a855f7, #63d6ff)',
              boxShadow: '0 0 10px rgba(168,85,247,0.5)',
            }}
          />
        </div>

        {/* Text */}
        <AnimatePresence mode="wait">
          <div className="h-8 mt-5 relative z-20 flex items-center justify-center">
            {isPlaying ? (
              <motion.p
                key="playing"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-rose-900 text-sm italic font-light tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                &ldquo;selamat ulang tahun yaa&rdquo;
              </motion.p>
            ) : hasPlayed ? (
              <motion.p
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-rose-700 font-medium text-xs tracking-widest uppercase"
              >
                Tap untuk putar ulang
              </motion.p>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-rose-700 font-medium text-xs tracking-widest uppercase"
              >
                Ada pesan spesial untukmu...
              </motion.p>
            )}
          </div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
