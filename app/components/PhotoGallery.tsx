'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  id: number;
  url: string;
  caption: string;
}

const cardGradients = [
  { bg: 'linear-gradient(145deg, rgba(255,62,142,0.12), rgba(168,85,247,0.08))', glow: 'rgba(255,62,142,0.3)', accent: '#ff3e8e' },
  { bg: 'linear-gradient(145deg, rgba(168,85,247,0.12), rgba(124,58,237,0.08))', glow: 'rgba(168,85,247,0.3)', accent: '#a855f7' },
  { bg: 'linear-gradient(145deg, rgba(245,200,66,0.12), rgba(255,154,67,0.08))', glow: 'rgba(245,200,66,0.3)', accent: '#f5c842' },
  { bg: 'linear-gradient(145deg, rgba(99,214,255,0.12), rgba(56,189,248,0.08))', glow: 'rgba(99,214,255,0.25)', accent: '#63d6ff' },
  { bg: 'linear-gradient(145deg, rgba(52,211,153,0.12), rgba(16,185,129,0.08))', glow: 'rgba(52,211,153,0.25)', accent: '#34d399' },
  { bg: 'linear-gradient(145deg, rgba(251,113,133,0.12), rgba(244,63,94,0.08))', glow: 'rgba(251,113,133,0.3)', accent: '#fb7185' },
];

const rotations = [-4, 3, -3, 4, -2, 3];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/foto')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setPhotos(data);
      })
      .catch(console.error);
  }, []);

  if (photos.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
        style={{ perspective: '1200px' }}
      >
        {photos.map((photo, index) => {
          const gradient = cardGradients[index % cardGradients.length];
          const rotation = rotations[index % rotations.length];
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 80, rotate: rotation * 2, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotate: rotation, rotateX: 0 }}
              transition={{
                delay: index * 0.15,
                type: 'spring',
                stiffness: 70,
                damping: 15,
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="cursor-pointer relative group"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow behind card */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                  opacity: isHovered ? 0.8 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.4 }}
                style={{
                  background: gradient.bg,
                  filter: `blur(25px)`,
                  transform: 'translateZ(-20px)',
                  boxShadow: isHovered ? `0 0 40px ${gradient.glow}` : 'none',
                }}
              />

              {/* 3D Card */}
              <motion.div
                animate={{
                  rotateX: isHovered ? -8 : 0,
                  rotateY: isHovered ? (index % 2 === 0 ? 6 : -6) : 0,
                  translateZ: isHovered ? 30 : 0,
                  scale: isHovered ? 1.04 : 1,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                  border: `1px solid ${isHovered ? gradient.accent + '40' : 'rgba(255,255,255,0.1)'}`,
                  backdropFilter: 'blur(20px)',
                  boxShadow: isHovered
                    ? `0 40px 80px rgba(0,0,0,0.6), 0 0 40px ${gradient.glow}, 0 1px 0 rgba(255,255,255,0.1) inset`
                    : '0 15px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset',
                  transformStyle: 'preserve-3d',
                  transition: 'border-color 0.3s ease',
                }}
              >
                {/* Shine overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  }}
                />

                {/* Polaroid white area */}
                <div className="p-3 pb-0">
                  {/* Photo area */}
                  <div
                    className="relative overflow-hidden rounded-xl aspect-square"
                    style={{ background: gradient.bg }}
                  >
                    {/* Animated gradient inside */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: isHovered
                          ? `radial-gradient(circle at 50% 50%, ${gradient.accent}30 0%, transparent 70%)`
                          : 'transparent',
                      }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Noise texture */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                      }}
                    />

                    {/* Photo Image */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center overflow-hidden"
                      animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </motion.div>

                    {/* Light leak */}
                    <div
                      className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20"
                      style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.9), transparent)' }}
                    />

                    {/* Bottom gradient */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }}
                    />
                  </div>
                </div>

                {/* Caption area (polaroid bottom) */}
                <div className="p-4 pt-3">
                  <p
                    className="text-rose-900 text-sm text-center font-light tracking-wide"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {photo.caption}
                  </p>

                  {/* Accent line */}
                  <div className="flex justify-center mt-2">
                    <div
                      className="h-px w-8 rounded-full"
                      style={{ background: `linear-gradient(90deg, transparent, ${gradient.accent}, transparent)` }}
                    />
                  </div>
                </div>

                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${gradient.accent}60, transparent)`,
                    opacity: isHovered ? 1 : 0.3,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              </motion.div>

              {/* Index number badge */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-rose-950 font-medium z-20"
                style={{
                  background: `linear-gradient(135deg, ${gradient.accent}, ${gradient.accent}80)`,
                  boxShadow: `0 0 15px ${gradient.glow}`,
                }}
              >
                {index + 1}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
