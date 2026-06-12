'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const defaultMessages = [
  "Semoga panjang umur dan sehat selalu! 🎉",
  "Semoga semua impianmu tercapai 🌟",
  "Terima kasih sudah menjadi bagian dari hariku 💕",
  "Kamu itu spesial, jangan pernah lupa itu! ✨",
  "Semoga hari-harimu selalu diwarnai kebahagiaan 🌈",
];

const emojis = ['🎉', '🌟', '💕', '✨', '🌈', '💝', '🎂'];

export default function BirthdayMessage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    fetch('/api/pesan')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setMessages(data.map((m: any) => m.text));
        }
      })
      .catch(console.error);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const fullText = messages[currentIndex] || "";
    if (!isTyping || !fullText) return;

    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      // Done typing, wait then switch
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % messages.length);
          setDisplayedText('');
          setIsTyping(true);
        }, 500);
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, currentIndex, isTyping, messages]);

  if (messages.length === 0) return null;

  return (
    <div className="relative max-w-xl mx-auto px-4" style={{ perspective: '1000px' }}>
      {/* Outer glow */}
      <div
        className="absolute -inset-4 rounded-[2.5rem] opacity-30 blur-2xl animate-aurora pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,62,142,0.5), rgba(168,85,247,0.5), rgba(245,200,66,0.3))' }}
      />

      <motion.div
        whileHover={{ rotateX: 5, rotateY: -5, translateZ: 20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative rounded-[2.5rem] p-8 md:p-10"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shine overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            borderRadius: 'inherit',
          }}
        />

        {/* Top decorative bar */}
        <div className="flex items-center justify-center gap-3 mb-8 relative z-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                boxShadow: '0 0 10px rgba(255,62,142,0.5)',
              }}
            />
          ))}
        </div>

        {/* Emoji */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center text-5xl mb-6 relative z-20"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(255,62,142,0.4))' }}
          >
            {emojis[currentIndex % emojis.length]}
          </motion.div>
        </AnimatePresence>

        {/* Message with typewriter */}
        <div className="min-h-[80px] flex items-center justify-center relative z-20">
          <p
            className="text-xl md:text-2xl text-center text-rose-950 font-medium font-light leading-relaxed tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            &ldquo;{displayedText}&rdquo;
            <span
              className="animate-cursor border-r-2 ml-1 inline-block h-6"
              style={{ borderColor: '#ff3e8e', filter: 'drop-shadow(0 0 5px rgba(255,62,142,0.6))' }}
            >
              &nbsp;
            </span>
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mt-10 relative z-20">
          {messages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setDisplayedText('');
                setIsTyping(true);
              }}
              animate={{
                scale: currentIndex === index ? 1.3 : 1,
              }}
              className="relative"
            >
              <div
                className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                style={{
                  background: currentIndex === index
                    ? 'linear-gradient(135deg, #ff3e8e, #a855f7)'
                    : 'rgba(255,255,255,0.2)',
                  boxShadow: currentIndex === index ? '0 0 10px rgba(255,62,142,0.5)' : 'none',
                }}
              />
              {currentIndex === index && (
                <motion.div
                  layoutId="active-msg-dot"
                  className="absolute -inset-1.5 rounded-full"
                  style={{ border: '1px solid rgba(255,62,142,0.4)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Bottom decorative line */}
        <div className="flex items-center justify-center gap-3 mt-8 relative z-20 opacity-50">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2))' }} />
          <span className="text-rose-700 font-medium text-xs">✨</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.2))' }} />
        </div>
      </motion.div>
    </div>
  );
}
