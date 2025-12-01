"use client";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["400", "700", "900"] });

interface KineticTypographyProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const words = text.split(" ");


  // Background animation with depth
  const bgPulse = spring({
    fps,
    frame: frame - 5,
    config: { damping: 20, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${colors.background} 0%, ${colors.secondary}05 100%)`,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements with depth */}
      {[...Array(8)].map((_, i) => {
        const depth = (i + 1) / 8;
        const rotation = frame * (0.3 + depth * 0.4) * (i % 2 === 0 ? 1 : -1);
        const scale = 0.3 + Math.sin(frame * 0.02 + i * 0.8) * 0.15 * depth;
        const opacity = 0.1 + depth * 0.2;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 150 + i * 80,
              height: 150 + i * 80,
              border: `1px solid ${colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`,
              borderRadius: "50%",
              transform: `rotate(${rotation}deg) scale(${scale}) translateZ(${depth * 50}px)`,
              transformStyle: "preserve-3d",
              opacity: bgPulse * opacity,
            }}
          />
        );
      })}

      {/* Main text with word-by-word animation */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 40px", maxWidth: "90%" }}>
        {words.map((word, wordIndex) => {
          const wordChars = word.split("");
          const wordStartDelay = wordIndex * 8; // Stagger words

          return (
            <div key={wordIndex} style={{ display: "flex" }}>
              {wordChars.map((char, charIndex) => {
                const charDelay = wordStartDelay + charIndex * 3;
                const charProgress = spring({
                  fps,
                  frame: frame - charDelay,
                  config: { damping: 15, stiffness: 180, mass: 0.6 },
                });

                // Advanced animation with anticipation
                const y = interpolate(charProgress, [0, 0.3, 0.7, 1], [120, -20, 5, 0], {
                  easing: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, // easeOutQuad
                });
                const opacity = interpolate(charProgress, [0, 0.2, 0.8, 1], [0, 0.7, 1, 1]);
                const rotateX = interpolate(charProgress, [0, 0.4, 0.8, 1], [90, -10, 2, 0]);
                const scale = interpolate(charProgress, [0, 0.3, 0.9, 1], [0.8, 1.1, 0.98, 1]);

                // Subtle wave effect during hold
                const holdStart = durationInFrames * 0.6;
                const wave = frame > holdStart ? Math.sin((frame - holdStart) * 0.1 + charIndex * 0.3) * 2 : 0;

                // Exit animation with follow-through
                const exitStart = durationInFrames - 25;
                const exitProgress = spring({
                  fps,
                  frame: frame - exitStart,
                  config: { damping: 8, stiffness: 100 },
                });
                const exitY = interpolate(exitProgress, [0, 1], [0, -50]);
                const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
                const exitRotate = interpolate(exitProgress, [0, 1], [0, 15]);

                return (
                  <span
                    key={charIndex}
                    style={{
                      fontFamily,
                      fontSize: 100,
                      fontWeight: 900,
                      color: colors.text,
                      opacity: opacity * (frame < exitStart ? 1 : exitOpacity),
                      transform: `translateY(${y + wave + (frame >= exitStart ? exitY : 0)}px)
                                 rotateX(${rotateX + (frame >= exitStart ? exitRotate : 0)}deg)
                                 scale(${scale})`,
                      textShadow: glowEffect
                        ? `0 0 20px ${colors.primary}80, 0 0 40px ${colors.secondary}60, 0 0 80px ${colors.primary}40`
                        : `3px 3px 0 ${colors.primary}40, 6px 6px 0 ${colors.secondary}20`,
                      display: "inline-block",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      perspective: 1000,
                      letterSpacing: "2px",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Professional gradient overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 300,
          background: `linear-gradient(to bottom, ${colors.background}E0, transparent)`,
          opacity: bgPulse * 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 300,
          background: `linear-gradient(to top, ${colors.background}E0, transparent)`,
          opacity: bgPulse * 0.8,
        }}
      />

      {/* Subtle particle effects */}
      {[...Array(12)].map((_, i) => {
        const particleProgress = spring({
          fps,
          frame: frame - i * 10,
          config: { damping: 25, stiffness: 60 },
        });

        const angle = (i / 12) * Math.PI * 2;
        const radius = 400 + Math.sin(frame * 0.05 + i) * 100;
        const x = Math.cos(angle + frame * 0.02) * radius;
        const y = Math.sin(angle + frame * 0.02) * radius;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 4,
              height: 4,
              background: colors.primary,
              borderRadius: "50%",
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleProgress * 0.3,
              boxShadow: `0 0 10px ${colors.primary}60`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
