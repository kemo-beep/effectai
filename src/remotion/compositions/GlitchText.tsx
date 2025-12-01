"use client";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["900"] });

interface GlitchTextProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Glitch intensity varies over time
  const glitchIntensity = Math.sin(frame * 0.5) * 0.5 + 0.5;
  const isGlitching = random(`glitch-${Math.floor(frame / 3)}`) > 0.7;

  const offsetX = isGlitching ? (random(`x-${frame}`) - 0.5) * 20 * glitchIntensity : 0;
  const offsetY = isGlitching ? (random(`y-${frame}`) - 0.5) * 10 * glitchIntensity : 0;

  // RGB split effect
  const rgbSplit = isGlitching ? 5 + random(`rgb-${frame}`) * 10 : 0;

  // Scanlines
  const scanlineOffset = (frame * 2) % 100;

  // Exit
  const exitStart = durationInFrames - 15;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.1) 2px,
            rgba(0,0,0,0.1) 4px
          )`,
          transform: `translateY(${scanlineOffset}px)`,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      {/* RGB split layers */}
      <div style={{ position: "relative", opacity: exitOpacity }}>
        {/* Red channel */}
        <span
          style={{
            position: "absolute",
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: "#ff0000",
            mixBlendMode: "screen",
            transform: `translate(${-rgbSplit + offsetX}px, ${offsetY}px)`,
            opacity: 0.8,
          }}
        >
          {text}
        </span>

        {/* Green channel */}
        <span
          style={{
            position: "absolute",
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: "#00ff00",
            mixBlendMode: "screen",
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            opacity: 0.8,
          }}
        >
          {text}
        </span>

        {/* Blue channel */}
        <span
          style={{
            position: "absolute",
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: "#0000ff",
            mixBlendMode: "screen",
            transform: `translate(${rgbSplit + offsetX}px, ${offsetY}px)`,
            opacity: 0.8,
          }}
        >
          {text}
        </span>

        {/* Main text */}
        <span
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: colors.text,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            textShadow: `0 0 20px ${colors.primary}`,
          }}
        >
          {text}
        </span>
      </div>

      {/* Random glitch bars */}
      {isGlitching &&
        [...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: `${random(`bar-y-${frame}-${i}`) * 100}%`,
              width: "100%",
              height: 4 + random(`bar-h-${frame}-${i}`) * 20,
              backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
              opacity: 0.3,
              transform: `translateX(${(random(`bar-x-${frame}-${i}`) - 0.5) * 100}px)`,
            }}
          />
        ))}
    </AbsoluteFill>
  );
};
