'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Song {
  id: number;
  url: string;
  judul: string;
}

// Fallback song if no songs in database
const FALLBACK_SONGS: Song[] = [
  { id: 0, url: 'e8YfjBdrnAU', judul: 'Birthday Song' },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [songs, setSongs] = useState<Song[]>(FALLBACK_SONGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch songs from API, fallback to default if empty/error
  useEffect(() => {
    fetch('/api/lagu')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSongs(data);
        }
        // If empty or error, keep FALLBACK_SONGS
      })
      .catch(() => {
        // Keep fallback songs on error
      });
  }, []);

  const initPlayer = useCallback(() => {
    if (playerRef.current || !containerRef.current || songs.length === 0) return;
    playerRef.current = new window.YT.Player('yt-player', {
      videoId: songs[0].url,
      playerVars: {
        autoplay: 0,
        loop: songs.length === 1 ? 1 : 0,
        playlist: songs.length === 1 ? songs[0].url : undefined,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          setIsReady(true);
        },
        onStateChange: (event: any) => {
          // When song ends, play next (only if multiple songs)
          if (event.data === window.YT.PlayerState.ENDED && songs.length > 1) {
            const nextIndex = (currentIndex + 1) % songs.length;
            setCurrentIndex(nextIndex);
            playerRef.current?.loadVideoById(songs[nextIndex].url);
          }
        },
      },
    });
  }, [songs, currentIndex]);

  useEffect(() => {
    if (typeof window === 'undefined' || songs.length === 0) return;

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(tag, firstScript);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initPlayer, songs]);

  const togglePlay = () => {
    if (!playerRef.current || !isReady || songs.length === 0) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (songs.length <= 1 || !playerRef.current) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    playerRef.current.loadVideoById(songs[nextIndex].url);
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (songs.length <= 1 || !playerRef.current) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    playerRef.current.loadVideoById(songs[prevIndex].url);
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Hidden YouTube player */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div ref={containerRef}>
          <div id="yt-player" />
        </div>
      </div>

      <div className="flex items-center gap-2" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Song info tooltip */}
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
              {isPlaying ? `🎵 ${songs[currentIndex]?.judul || 'Playing...'}` : '▶ Play Music'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prev button */}
        {songs.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSong}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              fontSize: '0.7rem',
            }}
          >
            ⏮
          </motion.button>
        )}

        {/* Main play/pause button */}
        <div className="relative">
          {/* Pulse rings when playing - fewer on mobile */}
          <AnimatePresence>
            {isPlaying && (
              <>
                {(isMobile ? [1] : [1, 2, 3]).map((ring) => (
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

          {/* Glow effect - desktop only */}
          {isPlaying && !isMobile && (
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
        </div>

        {/* Next button */}
        {songs.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSong}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              fontSize: '0.7rem',
            }}
          >
            ⏭
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
