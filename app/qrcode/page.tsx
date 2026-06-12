'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function QRCodePage() {
  const [copied, setCopied] = useState(false);
  const url = 'http://ulang-tahun-gebetan.test';

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/qrcode.png';
    link.download = 'qrcode-ulang-tahun.png';
    link.click();
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #ffb3c6 0%, #ffc8d6 40%, #ffc2d1 70%, #ffb3c6 100%)',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
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
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,62,142,0.25) 0%, transparent 70%)',
            bottom: '-150px',
            right: '-150px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card */}
        <div
          className="rounded-[2rem] p-8 text-center relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.5)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.6) inset',
          }}
        >
          {/* Shine */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
              borderRadius: 'inherit',
            }}
          />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-2"
          >
            <motion.span
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl inline-block"
              style={{ filter: 'drop-shadow(0 4px 10px rgba(255,62,142,0.4))' }}
            >
              🎁
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black mb-1"
            style={{
              fontFamily: 'Playfair Display, serif',
              background: 'linear-gradient(135deg, #c0136d, #7c1d4e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Scan untuk Buka!
          </motion.h1>
          <p className="text-rose-600 text-xs font-medium tracking-widest uppercase mb-6">
            Hadiah ulang tahun istimewa 🎂
          </p>

          {/* QR Code Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className="relative mx-auto mb-6"
            style={{ width: 220, height: 220 }}
          >
            {/* Glow ring */}
            <div
              className="absolute -inset-3 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #ff3e8e, #a855f7, #ff3e8e)',
                backgroundSize: '200% 200%',
                animation: 'spin 4s linear infinite',
                padding: 3,
                borderRadius: '1.25rem',
              }}
            />
            <div
              className="relative rounded-2xl overflow-hidden z-10"
              style={{
                background: 'white',
                padding: 10,
                boxShadow: '0 0 0 3px white, 0 8px 30px rgba(255,62,142,0.3)',
              }}
            >
              <Image
                src="/qrcode.png"
                alt="QR Code ulang tahun"
                width={200}
                height={200}
                style={{ display: 'block', borderRadius: 8 }}
                priority
              />
            </div>
          </motion.div>

          {/* URL label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-5 px-4 py-2 rounded-full text-xs font-mono truncate"
            style={{
              background: 'rgba(124,29,78,0.08)',
              color: '#9d174d',
              border: '1px solid rgba(124,29,78,0.15)',
            }}
          >
            {url}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #ff3e8e, #a855f7)',
                boxShadow: '0 0 20px rgba(255,62,142,0.4), 0 4px 15px rgba(0,0,0,0.15)',
              }}
            >
              <span>📥</span> Download QR Code
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopy}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{
                background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,62,142,0.08)',
                color: copied ? '#15803d' : '#9d174d',
                border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,62,142,0.2)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              <span>{copied ? '✅' : '🔗'}</span>
              {copied ? 'Link Tersalin!' : 'Salin Link'}
            </motion.button>
          </motion.div>

          {/* Note */}
          <p className="mt-5 text-rose-400 text-xs leading-relaxed">
            📱 Scan dengan kamera HP → website langsung terbuka di HP tersebut
          </p>
        </div>

        {/* Floating emojis */}
        {['💖', '✨', '🎀', '⭐', '🌸'].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-xl pointer-events-none select-none"
            style={{
              left: `${-10 + i * 28}%`,
              top: i % 2 === 0 ? '-2rem' : 'auto',
              bottom: i % 2 !== 0 ? '-2rem' : 'auto',
            }}
            animate={{ y: [0, -12, 0], rotate: [-5, 5, -5], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      <style jsx global>{`
        @keyframes spin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}
