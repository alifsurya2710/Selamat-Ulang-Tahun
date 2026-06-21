'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface FloatingParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  hue: number;
}

export default function StarryBackground({ variant = 'night' }: { variant?: 'night' | 'warm' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 80 : 250;
    const particleCount = isMobile ? 12 : 40;

    let animationId: number;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let particles: FloatingParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isMobile ? 1.8 : 2.5) + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.3 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isMobile ? 3 : 4) + 1,
        opacity: Math.random() * 0.5 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.5 - 0.1,
        hue: Math.random() > 0.5 ? Math.random() * 40 + 300 : Math.random() * 40 + 260, // Pink to Violet
      }));
    };

    const spawnShootingStar = () => {
      const spawnChance = isMobile ? 0.002 : 0.008;
      if (Math.random() > spawnChance) return;
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: Math.random() * (isMobile ? 50 : 100) + 30,
        speed: Math.random() * (isMobile ? 6 : 10) + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        life: 0,
        maxLife: isMobile ? 40 : 60,
        hue: Math.random() > 0.5 ? 330 : 280, // Rose or Violet
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const alpha = star.opacity * 0.3 + twinkle * 0.7;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Deep space star colors (slight tint of blue/purple/pink)
        const isColored = Math.random() > 0.8;
        if (isColored) {
          ctx.fillStyle = `hsla(${Math.random() * 60 + 260}, 80%, 80%, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fill();

        // Glow for bigger stars
        if (star.size > 1.8) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.4})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      // Draw shooting stars
      spawnShootingStar();
      shootingStars = shootingStars.filter((ss) => {
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity = 1 - ss.life / ss.maxLife;

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, `hsla(${ss.hue}, 80%, 60%, 0)`);
        gradient.addColorStop(1, `hsla(${ss.hue}, 80%, 70%, ${ss.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 4, 0, Math.PI * 2);
        const headGradient = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 8);
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        headGradient.addColorStop(1, `hsla(${ss.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = headGradient;
        ctx.fill();

        return ss.life < ss.maxLife;
      });

      // Draw floating particles (like cosmic dust)
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        const dustGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        dustGradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.opacity})`);
        dustGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = dustGradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 mix-blend-screen"
    />
  );
}
