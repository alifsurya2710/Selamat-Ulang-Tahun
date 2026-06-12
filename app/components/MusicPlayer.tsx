'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <audio ref={audioRef} loop>
        <source src="/birthday-song.mp3" type="audio/mpeg" />
      </audio>

      <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Pulse rings when playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px solid rgba(255,62,142,${0.5 - ring * 0.1})`,
                  }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1 + ring * 0.6, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: ring * 0.5,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Glow effect */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'radial-gradient(circle, rgba(255,62,142,0.3) 0%, transparent 70%)',
              filter: 'blur(12px)',
              transform: 'scale(2)',
            }}
          />
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.12, rotateY: 10 }}
          whileTap={{ scale: 0.88, rotateX: 5 }}
          onClick={togglePlay}
          className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-400"
          style={{
            background: isPlaying
              ? 'linear-gradient(135deg, #ff3e8e, #a855f7)'
              : 'rgba(255,255,255,0.06)',
            border: isPlaying
              ? '1px solid rgba(255,62,142,0.4)'
              : '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: isPlaying
              ? '0 10px 30px rgba(0,0,0,0.5), 0 0 30px rgba(255,62,142,0.4), 0 0 60px rgba(168,85,247,0.2)'
              : '0 10px 30px rgba(0,0,0,0.4), 0 0 15px rgba(255,255,255,0.05)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Inner shine */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }}
          />

          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                className="flex items-center gap-[3px] relative z-10"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [6, 18, 6] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-white rounded-full"
                    style={{ height: 6 }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.span
                key="paused"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 30 }}
                className="text-xl relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,110,180,0.6))',
                }}
              >
                🎵
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs text-rose-950 font-medium pointer-events-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play Music'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
