'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BirthdayCardProps {
  onOpen: () => void;
}

export default function BirthdayCard({ onOpen }: BirthdayCardProps) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'opened'>('idle');
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => setPhase('opened'), 600);
    setTimeout(onOpen, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      className={`fixed inset-0 flex items-center justify-center z-50 overflow-hidden${isMobile ? '' : ' noise-overlay'}`}
      style={{
        background: 'linear-gradient(135deg, #ffb3c6 0%, #ffc8d6 40%, #ffc2d1 70%, #ffb3c6 100%)',
      }}
      onClick={handleClick}
    >
      {/* Starfield - static on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: isMobile ? 6 : 60 }, (_, i) => (
          isMobile ? (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 1 + (i % 3),
                height: 1 + (i % 3),
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 17.9) % 100}%`,
                background: 'white',
                opacity: 0.3,
              }}
            />
          ) : (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: 1 + (i % 3),
                height: 1 + (i % 3),
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 17.9) % 100}%`,
                background: 'white',
                opacity: 0.3 + (i % 5) * 0.1,
                animationDelay: `${(i % 5) * 0.4}s`,
              }}
            />
          )
        ))}
      </div>

      {/* Ambient orbs */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              position: 'absolute',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
              top: '-200px',
              left: '-150px',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            style={{
              position: 'absolute',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,62,142,0.25) 0%, transparent 70%)',
              bottom: '-150px',
              right: '-100px',
            }}
          />
        </div>
      )}

      {/* Grid */}
      {!isMobile && <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />}

      {/* Floating emojis - fewer on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {(isMobile ? ['✨', '💕'] : ['✨', '💕', '🌸', '⭐', '💖', '🎀', '💫', '🌟', '🎈', '🎊', '💝', '🌺']).map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-xl"
            initial={{
              x: `${(i * 8.7) % 100}vw`,
              y: `${(i * 13.3) % 100}vh`,
            }}
            animate={{
              y: [`${(i * 13.3) % 80}vh`, `${((i * 13.3) % 80) - 15}vh`, `${(i * 13.3) % 80}vh`],
              opacity: [0.3, 0.6, 0.3],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Envelope 3D Container */}
      <div className="relative" style={{ perspective: '1200px' }}>
        <motion.div
          animate={phase !== 'idle' ? { scale: 0.88, y: -20, rotateX: -10 } : { scale: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[90vw] max-w-[340px] h-[230px] cursor-pointer mx-auto"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Envelope glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-6 rounded-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,62,142,0.15) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Envelope body */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: isMobile ? 'blur(8px)' : 'blur(20px)',
              boxShadow: isMobile ? `
                0 20px 40px rgba(0,0,0,0.5),
                0 1px 0 rgba(255,255,255,0.15) inset
              ` : `
                0 30px 80px rgba(0,0,0,0.7),
                0 1px 0 rgba(255,255,255,0.15) inset,
                0 0 60px rgba(255,62,142,0.08)
              `,
            }}
          >
            {/* Shine */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)' }}
            />

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-rose-400/30 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-violet-400/30 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-rose-400/30 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-violet-400/30 rounded-br-lg" />

            {/* Inner content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={phase === 'idle' ? {
                    y: [0, -8, 0],
                    filter: ['drop-shadow(0 0 10px rgba(255,62,142,0.4))', 'drop-shadow(0 0 25px rgba(255,62,142,0.7))', 'drop-shadow(0 0 10px rgba(255,62,142,0.4))'],
                  } : {}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-6xl mb-4 inline-block"
                >
                  💌
                </motion.div>
                <p className="text-rose-800 text-sm font-light tracking-wider">
                  Ada sesuatu untukmu...
                </p>
                {phase === 'idle' && (
                  <motion.p
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-rose-700 text-xs mt-3 tracking-widest uppercase"
                  >
                    tap untuk membuka
                  </motion.p>
                )}
              </div>
            </div>

            {/* Bottom glow line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,62,142,0.5), rgba(168,85,247,0.5), transparent)' }}
            />
          </div>

          {/* Envelope flap */}
          <motion.div
            animate={phase !== 'idle' ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
            className="absolute top-0 left-0 right-0 h-[115px] rounded-t-3xl overflow-hidden"
          >
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2">
                <motion.div
                  animate={phase === 'idle' ? { scale: [1, 1.15, 1], boxShadow: ['0 0 15px rgba(255,62,142,0.4)', '0 0 35px rgba(255,62,142,0.7)', '0 0 15px rgba(255,62,142,0.4)'] } : { scale: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                    boxShadow: '0 0 25px rgba(255,62,142,0.5)',
                  }}
                >
                  <span className="text-rose-950 font-medium text-base">✉</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Letter coming out */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={
            phase === 'opened' ? { y: -200, opacity: 1, rotateX: 0 } :
            phase === 'opening' ? { y: -50, opacity: 0.5, rotateX: 10 } :
            {}
          }
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: phase === 'opening' ? 0.3 : 0 }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[85vw] max-w-[300px]"
          style={{ perspective: '800px' }}
        >
          <div
            className="rounded-2xl p-7 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,62,142,0.15)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)', borderRadius: 'inherit' }}
            />
            <div
              className="text-5xl mb-4 inline-block"
              style={{ filter: 'drop-shadow(0 8px 20px rgba(255,62,142,0.5))' }}
            >
              🎂
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #ff6eb4, #f5c842)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Playfair Display, serif',
              }}
            >
              Selamat Ulang Tahun!
            </h2>
            <p className="text-rose-800 text-xs tracking-wide">Untuk seseorang yang spesial</p>
            <div className="flex justify-center gap-2 mt-4 text-xl">
              {['🎈', '✨', '💝', '✨', '🎈'].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(255,62,142,0.4))' }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 text-center"
      >
        <p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,110,180,0.25)' }}
        >
          Kejutan Spesial Menantimu
        </p>
      </motion.div>
    </motion.div>
  );
}
