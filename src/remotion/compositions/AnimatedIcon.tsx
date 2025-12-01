"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["600", "700"] });

interface AnimatedIconProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract emoji/icon from text
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]/g;
  const emojiMatch = text.match(emojiRegex);
  const icon = emojiMatch ? emojiMatch[0] : "✨";
  const label = text.replace(emojiRegex, "").trim();

  const popIn = spring({ fps, frame, config: { damping: 10, stiffness: 150 } });
  const scale = interpolate(popIn, [0, 1], [0, 1]);
  const rotation = interpolate(popIn, [0, 1], [180, 0]);

  // Floating animation
  const float = Math.sin(frame * 0.1) * 10;

  // Text slide in
  const textProgress = spring({ fps, frame: frame - 15, config: { damping: 12 } });
  const textX = interpolate(textProgress, [0, 1], [50, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* Animated icon */}
        <div
          style={{
            fontSize: 120,
            transform: `scale(${scale}) rotate(${rotation}deg) translateY(${float}px)`,
            filter: glowEffect ? `drop-shadow(0 0 30px ${colors.primary})` : "none",
          }}
        >
          {icon}
        </div>

        {/* Text label */}
        {label && (
          <div
            style={{
              transform: `translateX(${textX}px)`,
              opacity: textProgress,
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: 48,
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {label}
            </span>
          </div>
        )}
      </div>

      {/* Sparkle particles */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const distance = 200;
        const particleProgress = spring({ fps, frame: frame - 20, config: { damping: 15 } });
        const x = Math.cos(angle) * distance * particleProgress;
        const y = Math.sin(angle) * distance * particleProgress;
        const particleOpacity = interpolate(particleProgress, [0, 0.5, 1], [0, 1, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              fontSize: 24,
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleOpacity,
            }}
          >
            ✨
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
