"use client";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["700"] });

interface VHSOverlayProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const VHSOverlay: React.FC<VHSOverlayProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // VHS tracking effect
  const trackingOffset = Math.sin(frame * 0.1) * 3;
  const noiseIntensity = random(`noise-${Math.floor(frame / 2)}`) * 0.1;

  // Timestamp
  const date = new Date();
  const timestamp = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${String(Math.floor(frame / 30)).padStart(2, "0")}:${String(frame % 30).padStart(2, "0")}`;

  // Exit
  const exitStart = durationInFrames - 20;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a2e" }}>
      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: noiseIntensity,
          mixBlendMode: "overlay",
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.3) 2px,
            rgba(0,0,0,0.3) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* Main content with tracking offset */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${trackingOffset}px)`,
          opacity: exitOpacity,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 80,
            fontWeight: 700,
            color: colors.text,
            textShadow: `
              2px 0 ${colors.primary},
              -2px 0 ${colors.secondary},
              0 0 20px ${colors.primary}
            `,
          }}
        >
          {text}
        </span>
      </AbsoluteFill>

      {/* VHS UI elements */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          fontFamily: "monospace",
          fontSize: 24,
          color: "#fff",
          opacity: 0.8 * exitOpacity,
        }}
      >
        ● REC
      </div>

      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          fontFamily: "monospace",
          fontSize: 20,
          color: "#fff",
          opacity: 0.8 * exitOpacity,
        }}
      >
        {timestamp}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          fontFamily: "monospace",
          fontSize: 18,
          color: "#fff",
          opacity: 0.6 * exitOpacity,
        }}
      >
        PLAY ▶
      </div>

      {/* Color aberration bars */}
      {random(`bar-${Math.floor(frame / 5)}`) > 0.9 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${random(`bar-y-${frame}`) * 100}%`,
            width: "100%",
            height: 4,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
            opacity: 0.5,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
