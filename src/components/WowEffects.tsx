"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * ScrambleText Component
 * Randomly changes characters before settling on the final text.
 */
export function ScrambleText({ text, trigger, duration = 1500, className = "" }: { text: string; trigger: boolean; duration?: number; className?: string }) {
  const [displayText, setDisplayText] = useState(trigger ? text : "");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  useEffect(() => {
    if (!trigger) {
      const t = setTimeout(() => setDisplayText("****************"), 0);
      return () => clearTimeout(t);
    }

    const start = Date.now();
    let frame: number;

    const tick = () => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        const currentScramble = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            // Reveal characters gradually from left to right
            if (progress * text.length > index) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        setDisplayText(currentScramble);
        frame = requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [trigger, text, duration]);

  return <span className={`font-mono ${className}`}>{displayText}</span>;
}

/**
 * ParticleBackground Component
 * Renders floating particles with connected lines on a canvas.
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    let frame: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update particles
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6, 182, 212, 0.5)"; // cyan-500
        ctx.fill();

        for (let j = i + 1; j < numParticles; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ background: "radial-gradient(circle at center, #020617 0%, #000000 100%)" }}
    />
  );
}
