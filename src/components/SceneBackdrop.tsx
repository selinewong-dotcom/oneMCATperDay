import React, { useEffect, useRef, useState } from 'react';

export const SceneBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phoneRinging, setPhoneRinging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed virtual low-resolution pixel grid for authentic pixel-art scaling
    const W = 400;
    const H = 225;
    canvas.width = W;
    canvas.height = H;

    let animationFrameId: number;
    let tick = 0;

    // Floating particles (dust motes / bioluminescent bio-spores)
    const spores = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * (H * 0.75),
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.05 - Math.random() * 0.1,
      alpha: 0.1 + Math.random() * 0.5,
      size: Math.random() > 0.8 ? 2 : 1,
    }));

    const render = () => {
      tick++;

      // 1. CLEAR & DEEP NAVY WALL
      ctx.fillStyle = '#060c20';
      ctx.fillRect(0, 0, W, H);

      // Back wall subtle gradient
      const wallGrad = ctx.createLinearGradient(0, 0, 0, H * 0.65);
      wallGrad.addColorStop(0, '#040816');
      wallGrad.addColorStop(1, '#09153a');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, W, H * 0.65);

      // 2. FLOOR PERSPECTIVE & TILES (Horizon at y = 145)
      const horizonY = 145;
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, H);
      floorGrad.addColorStop(0, '#0a1738');
      floorGrad.addColorStop(1, '#050c22');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // Floor horizontal tile lines with geometric foreshortening
      ctx.fillStyle = '#0f2452';
      const tileSteps = [146, 150, 156, 164, 175, 189, 206, 224];
      for (const y of tileSteps) {
        ctx.fillRect(0, y, W, 1);
      }

      // Floor perspective diagonal lines
      const vanishingX = W / 2;
      ctx.strokeStyle = '#0f224c';
      ctx.lineWidth = 1;
      const numLines = 18;
      for (let i = -numLines; i <= numLines; i++) {
        const destX = vanishingX + i * 32;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(destX, H);
        ctx.stroke();
      }

      // 3. TALL SIDE WINDOWS GLOWING MUTED YELLOW-GREEN
      // Left tall window (x: 28 to 68)
      // Right tall window (x: 332 to 372)
      const drawWindow = (x: number, y: number, w: number, h: number, isLeft: boolean) => {
        // Window outer light spill onto wall
        const glowGrad = ctx.createRadialGradient(
          x + w / 2, y + h / 2, 5,
          x + w / 2, y + h / 2, 75
        );
        glowGrad.addColorStop(0, 'rgba(168, 217, 111, 0.28)');
        glowGrad.addColorStop(0.6, 'rgba(120, 180, 80, 0.08)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(x - 30, y - 10, w + 60, h + 80);

        // Window opening / night sky with moonlit green-yellow tint
        ctx.fillStyle = '#1e382b';
        ctx.fillRect(x, y, w, h);

        const glassGrad = ctx.createLinearGradient(x, y, x, y + h);
        glassGrad.addColorStop(0, '#5a8247');
        glassGrad.addColorStop(0.4, '#8eb865');
        glassGrad.addColorStop(0.7, '#a9d66e');
        glassGrad.addColorStop(1, '#6b9c48');
        ctx.fillStyle = glassGrad;
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

        // Window mullions (vertical and horizontal wooden grid)
        ctx.fillStyle = '#060d1f';
        // Arch top curved frame
        ctx.fillRect(x, y, w, 2);
        ctx.fillRect(x, y + h - 2, w, 2);
        ctx.fillRect(x, y, 2, h);
        ctx.fillRect(x + w - 2, y, 2, h);

        // Vertical central mullion
        const midX = x + Math.floor(w / 2);
        ctx.fillRect(midX - 1, y, 2, h);

        // Horizontal bars
        const numBars = 4;
        for (let b = 1; b < numBars; b++) {
          const barY = y + Math.floor((h / numBars) * b);
          ctx.fillRect(x, barY - 1, w, 2);
        }

        // Window sill
        ctx.fillStyle = '#0d1d40';
        ctx.fillRect(x - 4, y + h, w + 8, 4);
        ctx.fillStyle = '#172f63';
        ctx.fillRect(x - 4, y + h, w + 8, 1);

        // Light projection cast onto the floor
        ctx.beginPath();
        if (isLeft) {
          ctx.moveTo(x - 2, horizonY);
          ctx.lineTo(x + w + 10, horizonY);
          ctx.lineTo(x + w + 55, H);
          ctx.lineTo(x - 15, H);
        } else {
          ctx.moveTo(x - 10, horizonY);
          ctx.lineTo(x + w + 2, horizonY);
          ctx.lineTo(x + w + 15, H);
          ctx.lineTo(x - 55, H);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(168, 217, 111, 0.055)';
        ctx.fill();
      };

      // Draw tall left and right windows
      drawWindow(32, 22, 38, 105, true);
      drawWindow(330, 22, 38, 105, false);

      // 4. OPEN DOORWAY ON FAR LEFT (x: 0 to 22)
      // Warm faint corridor light
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 18, 22, horizonY - 18);

      // Interior doorway glow
      const doorGlow = ctx.createLinearGradient(0, 18, 20, 18);
      doorGlow.addColorStop(0, '#1a3028');
      doorGlow.addColorStop(0.7, '#0d1e2e');
      doorGlow.addColorStop(1, '#050d1e');
      ctx.fillStyle = doorGlow;
      ctx.fillRect(0, 20, 20, horizonY - 20);

      // Door frame edge
      ctx.fillStyle = '#0e1e40';
      ctx.fillRect(20, 18, 3, horizonY - 18 + 4);
      ctx.fillStyle = '#19336d';
      ctx.fillRect(20, 18, 1, horizonY - 18);

      // 5. SMALL WHITE PIXEL-ART CHARACTER PEEKING THROUGH DOORWAY
      // Cute ghostly / researcher pixel creature peeking around the doorway post
      const peekingCharY = 88;
      const isBlinking = tick % 140 > 132;
      const peekOffset = Math.sin(tick * 0.03) * 1.5; // gentle idle bobbing

      // White pixel body/head (peeking from x: 12 to 24)
      ctx.fillStyle = '#ffffff';
      // Head curve
      ctx.fillRect(14 + peekOffset, peekingCharY, 7, 11);
      ctx.fillRect(13 + peekOffset, peekingCharY + 2, 9, 8);
      ctx.fillRect(15 + peekOffset, peekingCharY - 2, 5, 2);

      // Shadow underside of creature
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(13 + peekOffset, peekingCharY + 9, 9, 2);

      // Cute pixel eyes (dark navy/black)
      if (!isBlinking) {
        ctx.fillStyle = '#0a1638';
        // Eye 1
        ctx.fillRect(17 + peekOffset, peekingCharY + 3, 2, 3);
        // Eye 2 (partially visible on side profile)
        ctx.fillRect(20 + peekOffset, peekingCharY + 3, 2, 3);

        // Eye highlights (white pixel)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(17 + peekOffset, peekingCharY + 3, 1, 1);
        ctx.fillRect(20 + peekOffset, peekingCharY + 3, 1, 1);
      } else {
        // Blink line
        ctx.fillStyle = '#0a1638';
        ctx.fillRect(17 + peekOffset, peekingCharY + 4, 2, 1);
        ctx.fillRect(20 + peekOffset, peekingCharY + 4, 2, 1);
      }

      // Little cute researcher pixel antenna / hair tuft
      ctx.fillStyle = '#bef264';
      ctx.fillRect(16 + peekOffset, peekingCharY - 4, 2, 2);

      // 6. CENTRAL BENCH / TABLE ALONG THE BOTTOM
      // Dark laboratory table top resting along the bottom
      const tableTopY = 196;
      // Front face
      ctx.fillStyle = '#071025';
      ctx.fillRect(36, tableTopY + 4, W - 72, H - tableTopY);

      // Table surface
      ctx.fillStyle = '#0c1a40';
      ctx.fillRect(34, tableTopY, W - 68, 5);
      // Top chamfer highlight
      ctx.fillStyle = '#1d3570';
      ctx.fillRect(34, tableTopY, W - 68, 1);

      // Table legs / support pillars
      ctx.fillStyle = '#050a1a';
      ctx.fillRect(44, tableTopY + 5, 8, H - tableTopY);
      ctx.fillRect(W - 52, tableTopY + 5, 8, H - tableTopY);

      // Small pixel test-tube rack on the left table corner
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(56, tableTopY - 14, 20, 14);
      // Test tubes with glowing liquids
      ctx.fillStyle = 'rgba(163, 230, 53, 0.9)'; // lime glow
      ctx.fillRect(58, tableTopY - 12, 3, 10);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)'; // cyan glow
      ctx.fillRect(63, tableTopY - 10, 3, 8);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.85)'; // pink glow
      ctx.fillRect(68, tableTopY - 13, 3, 11);

      // 7. ROTARY / RETRO TELEPHONE ON THE RIGHT FLOOR (x: 348 to 382, y: 168 to 198)
      const phoneX = 354;
      const phoneY = 172;
      const ringJitter = phoneRinging ? (Math.sin(tick * 0.8) > 0 ? 1 : -1) : 0;

      // Phone shadow on floor
      ctx.fillStyle = 'rgba(2, 6, 18, 0.8)';
      ctx.beginPath();
      ctx.ellipse(phoneX + 14, phoneY + 22, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Phone body base (vintage cream/beige / charcoal)
      ctx.fillStyle = '#182442';
      ctx.fillRect(phoneX, phoneY + 8 + ringJitter, 28, 14);
      ctx.fillStyle = '#22325c';
      ctx.fillRect(phoneX + 2, phoneY + 6 + ringJitter, 24, 4);

      // Rotary dial circle (silver / beige)
      ctx.fillStyle = '#d6cbba';
      ctx.beginPath();
      ctx.arc(phoneX + 14, phoneY + 15 + ringJitter, 6, 0, Math.PI * 2);
      ctx.fill();

      // Center dial hub
      ctx.fillStyle = '#0a1638';
      ctx.beginPath();
      ctx.arc(phoneX + 14, phoneY + 15 + ringJitter, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dial finger holes (tiny dark pixels)
      ctx.fillStyle = '#64748b';
      for (let d = 0; d < 6; d++) {
        const angle = (d * Math.PI) / 3;
        const hx = phoneX + 14 + Math.cos(angle) * 4;
        const hy = phoneY + 15 + Math.sin(angle) * 4;
        ctx.fillRect(Math.round(hx), Math.round(hy) + ringJitter, 1, 1);
      }

      // Cradle forks
      ctx.fillStyle = '#475569';
      ctx.fillRect(phoneX + 4, phoneY + 4 + ringJitter, 3, 3);
      ctx.fillRect(phoneX + 21, phoneY + 4 + ringJitter, 3, 3);

      // Handset receiver (horizontal bar with two earpieces)
      ctx.fillStyle = '#2d3f6d';
      ctx.fillRect(phoneX - 2, phoneY + 2 + ringJitter, 32, 3);
      // Left mouthpiece
      ctx.fillRect(phoneX - 3, phoneY + 1 + ringJitter, 6, 5);
      // Right earpiece
      ctx.fillRect(phoneX + 25, phoneY + 1 + ringJitter, 6, 5);

      // Coiled spiral cord curling onto the floor
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(phoneX + 3, phoneY + 18);
      for (let c = 0; c < 5; c++) {
        const cx = phoneX - 4 - c * 5;
        const cy = phoneY + 20 + (c % 2 === 0 ? 2 : -2);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // Tiny blinking red/green message LED on phone
      const ledOn = (tick % 60) < 30;
      ctx.fillStyle = ledOn ? '#bef264' : '#14532d';
      ctx.fillRect(phoneX + 23, phoneY + 8 + ringJitter, 2, 2);

      // 8. DRIFTING PARTICLES / BIO-SPORES
      for (const spore of spores) {
        spore.x += spore.vx;
        spore.y += spore.vy;
        if (spore.y < 10) spore.y = H * 0.75;
        if (spore.x < 0) spore.x = W;
        if (spore.x > W) spore.x = 0;

        ctx.fillStyle = `rgba(180, 235, 120, ${spore.alpha * 0.6})`;
        ctx.fillRect(Math.floor(spore.x), Math.floor(spore.y), spore.size, spore.size);
      }

      // 9. CENTRAL VIGNETTE TO GUARANTEE UI LEGIBILITY
      const centerVignette = ctx.createRadialGradient(
        W / 2, H / 2, 20,
        W / 2, H / 2, 170
      );
      centerVignette.addColorStop(0, 'rgba(6, 14, 38, 0.45)');
      centerVignette.addColorStop(0.7, 'rgba(6, 14, 38, 0.7)');
      centerVignette.addColorStop(1, 'rgba(4, 9, 24, 0.88)');
      ctx.fillStyle = centerVignette;
      ctx.fillRect(0, 0, W, H);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [phoneRinging]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-navy-950">
      {/* Pixel-scaled canvas with crisp nearest-neighbor rendering */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{
          imageRendering: 'pixelated',
        }}
      />

      {/* Interactive invisible hot-spot over phone to trigger ring easter egg */}
      <div
        className="absolute bottom-8 right-6 w-20 h-20 cursor-pointer pointer-events-auto"
        title="Retro Telephone (click to test ring)"
        onClick={() => {
          setPhoneRinging(true);
          setTimeout(() => setPhoneRinging(false), 2200);
        }}
      />
    </div>
  );
};
