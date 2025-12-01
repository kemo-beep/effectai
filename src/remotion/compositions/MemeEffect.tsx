"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["900"] });

interface MemeEffectProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const MemeEffect: React.FC<MemeEffectProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const impact = spring({ fps, frame, config: { damping: 5, stiffness: 300 } });
  const scale = interpolate(impact, [0, 1], [0, 1]);

  // Shake effect
  const shake = Math.sin(frame * 2) * (1 - impact) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      {/* Comic-style burst */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const length = 200 * impact;
        const x = Math.cos(angle) * length;
        const y = Math.sin(angle) * length;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 80,
              height: 8,
              backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
              transform: `translate(${x}px, ${y}px) rotate(${(angle * 180) / Math.PI}deg)`,
              transformOrigin: "left center",
            }}
          />
        );
      })}

      {/* Main text with outline */}
      <div
        style={{
          transform: `scale(${scale}) translateX(${shake}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 100,
            fontWeight: 900,
            color: colors.text,
            textTransform: "uppercase",
            WebkitTextStroke: `6px ${colors.primary}`,
            textShadow: `8px 8px 0 ${colors.secondary}`,
            letterSpacing: 4,
          }}
        >
          {text}
        </span>
      </div>

      {/* Explosion particles */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const distance = 300 * impact;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size = 10 + Math.random() * 20;

        return (
          <div
            key={`particle-${i}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: i % 3 === 0 ? colors.primary : colors.secondary,
              borderRadius: "50%",
              transform: `translate(${x}px, ${y}px)`,
              opacity: 1 - impact,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
