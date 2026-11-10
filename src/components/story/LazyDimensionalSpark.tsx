'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Lightweight, dependency-free 3D projection Canvas motif (Icosahedron + Orbital Light Nodes)
 * Lazy-loaded strictly as a progressive enhancement on fine-pointer desktop when motion is enabled.
 * Automatically pauses via IntersectionObserver when scrolled off-screen (PRD Section 5.3).
 */
export default function LazyDimensionalSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let isVisible = true;
    let angleX = 0.35;
    let angleY = 0.55;

    // Golden ratio icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices: [number, number, number][] = [
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1],
    ];

    const edges: [number, number][] = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
      [4, 5], [2, 11], [6, 10], [8, 7], [9, 1],
    ];

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (isVisible) {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        angleY += 0.0045;
        angleX += 0.0022;

        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);

        const scale = Math.min(width, height) * 0.22;
        const cx = width / 2;
        const cy = height / 2;

        const projected = rawVertices.map(([vx, vy, vz]) => {
          // Rotate around Y
          const x1 = vx * cosY - vz * sinY;
          const z1 = vz * cosY + vx * sinY;
          // Rotate around X
          const y2 = vy * cosX - z1 * sinX;
          const z2 = z1 * cosX + vy * sinX;

          const perspective = 4 / (4 + z2 * 0.35);
          return {
            x: cx + x1 * scale * perspective,
            y: cy + y2 * scale * perspective,
            z: z2,
          };
        });

        ctx.lineWidth = 1;
        edges.forEach(([i, j]) => {
          const p1 = projected[i];
          const p2 = projected[j];
          const depthAlpha = Math.max(0.08, Math.min(0.42, (p1.z + p2.z + 4) / 8));
          ctx.strokeStyle = `rgba(155, 140, 255, ${depthAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        projected.forEach((p, idx) => {
          const radius = idx % 3 === 0 ? 2.4 : 1.6;
          ctx.fillStyle =
            idx % 2 === 0 ? 'rgba(232, 201, 152, 0.65)' : 'rgba(155, 140, 255, 0.65)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={440}
      height={440}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      aria-hidden="true"
    />
  );
}

