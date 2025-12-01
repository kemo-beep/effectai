"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["700", "900"] });

interface SocialCalloutProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const SocialCallout: React.FC<SocialCalloutProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popIn = spring({ fps, frame, config: { damping: 8, stiffness: 200 } });
  const scale = interpolate(popIn, [0, 1], [0, 1]);
  const rotation = interpolate(popIn, [0, 1], [15, 0]);

  // Pulse effect
  const pulse = 1 + Math.sin(frame * 0.15) * 0.05;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale * pulse}) rotate(${rotation}deg)`,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: "24px 48px",
          borderRadius: 20,
          border: `4px solid ${colors.text}`,
          boxShadow: glowEffect
            ? `0 0 40px ${colors.primary}, 0 10px 40px rgba(0,0,0,0.3)`
            : "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 56,
            fontWeight: 900,
            color: colors.text,
            textTransform: "uppercase",
            letterSpacing: 2,
            textShadow: "2px 2px 0 rgba(0,0,0,0.2)",
          }}
        >
          {text}
        </span>
      </div>

      {/* Animated arrows */}
      {[...Array(3)].map((_, i) => {
        const arrowDelay = 10 + i * 5;
        const arrowProgress = spring({ fps, frame: frame - arrowDelay, config: { damping: 12 } });
        const arrowY = interpolate(arrowProgress, [0, 1], [50, 0]);
        const arrowOpacity = interpolate(arrowProgress, [0, 0.5, 1], [0, 1, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 100 - i * 30,
              fontSize: 40,
              transform: `translateY(${arrowY}px)`,
              opacity: arrowOpacity,
            }}
          >
            ⬇️
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
