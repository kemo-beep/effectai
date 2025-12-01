"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["400", "800", "900"] });

interface NumberCounterProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Parse number and suffix from text (e.g., "1M+ Users" -> 1000000, "M+ Users")
  const match = text.match(/^([\d.]+)([KMB]?\+?)(.*)$/i);
  const baseNum = match ? parseFloat(match[1]) : 100;
  const suffix = match ? match[2] : "";
  const label = match ? match[3].trim() : text;

  const multiplier = suffix.toUpperCase().includes("K") ? 1000 :
    suffix.toUpperCase().includes("M") ? 1000000 :
      suffix.toUpperCase().includes("B") ? 1000000000 : 1;

  const targetValue = baseNum * multiplier;

  // Professional counting animation with easing
  const countProgress = spring({
    fps,
    frame: frame - 10,
    config: { damping: 25, stiffness: 120, mass: 0.8 }
  });

  const currentValue = Math.floor(interpolate(countProgress, [0, 1], [0, targetValue]));

  const formatNumber = (num: number) => {
    if (multiplier >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (multiplier >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (multiplier >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  // Background animation
  const bgProgress = spring({
    fps,
    frame: frame - 5,
    config: { damping: 20, stiffness: 80 }
  });

  // Exit animation with follow-through
  const exitStart = durationInFrames - 30;
  const exitProgress = spring({
    fps,
    frame: frame - exitStart,
    config: { damping: 12, stiffness: 100 }
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.9]);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 50%, ${colors.background} 0%, ${colors.secondary}08 100%)`,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden"
    }}>
      {/* Professional animated background elements */}
      {[...Array(5)].map((_, i) => {
        const depth = (i + 1) / 5;
        const elementProgress = spring({
          fps,
          frame: frame - i * 8,
          config: { damping: 18, stiffness: 90 }
        });

        const rotation = frame * (0.2 + depth * 0.3);
        const scale = 0.5 + Math.sin(frame * 0.03 + i * 0.7) * 0.2 * depth;
        const opacity = 0.15 + depth * 0.1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 300 + i * 120,
              height: 300 + i * 120,
              border: `2px solid ${colors.primary}${Math.floor(opacity * elementProgress * 255).toString(16).padStart(2, '0')}`,
              borderRadius: "50%",
              transform: `rotate(${rotation}deg) scale(${scale * elementProgress})`,
              opacity: bgProgress * opacity * (frame < exitStart ? 1 : exitOpacity),
            }}
          />
        );
      })}

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => {
        const particleProgress = spring({
          fps,
          frame: frame - i * 6,
          config: { damping: 30, stiffness: 70 }
        });

        const angle = (i / 15) * Math.PI * 2 + frame * 0.01;
        const radius = 250 + Math.sin(frame * 0.02 + i) * 80;
        const x = Math.cos(angle) * radius * particleProgress;
        const y = Math.sin(angle) * radius * particleProgress;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 3 + Math.sin(i) * 2,
              height: 3 + Math.sin(i) * 2,
              background: colors.primary,
              borderRadius: "50%",
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleProgress * 0.4 * (frame < exitStart ? 1 : exitOpacity),
              boxShadow: `0 0 8px ${colors.primary}60`,
            }}
          />
        );
      })}

      <div style={{
        textAlign: "center",
        transform: `scale(${frame < exitStart ? 1 : exitScale})`,
        opacity: frame < exitStart ? 1 : exitOpacity
      }}>
        {/* Main number with sophisticated animation */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily,
              fontSize: 160,
              fontWeight: 900,
              color: colors.primary,
              lineHeight: 1,
              textShadow: glowEffect
                ? `0 0 30px ${colors.primary}80, 0 0 60px ${colors.secondary}60, 0 0 120px ${colors.primary}40`
                : `4px 4px 0 ${colors.secondary}30, 8px 8px 0 ${colors.primary}20`,
              letterSpacing: "2px",
              transform: `scale(${1 + countProgress * 0.05})`,
            }}
          >
            {formatNumber(currentValue)}
            {suffix.includes("+") && "+"}
          </div>

          {/* Animated underline */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              height: 4,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: "2px",
              width: `${countProgress * 100}%`,
              boxShadow: `0 0 20px ${colors.primary}50`,
            }}
          />
        </div>

        {/* Label with fade-in animation */}
        {label && (
          <div
            style={{
              fontFamily,
              fontSize: 42,
              fontWeight: 500,
              color: colors.text,
              marginTop: 30,
              opacity: countProgress,
              transform: `translateY(${interpolate(countProgress, [0, 1], [20, 0])}px)`,
              textShadow: `1px 1px 0 ${colors.secondary}20`,
            }}
          >
            {label}
          </div>
        )}

        {/* Progress indicator */}
        <div
          style={{
            marginTop: 40,
            width: 300,
            height: 6,
            background: `${colors.secondary}20`,
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${countProgress * 100}%`,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: "3px",
              boxShadow: `0 0 15px ${colors.primary}60`,
              transition: "width 0.1s ease",
            }}
          />
        </div>
      </div>

      {/* Gradient overlays for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to bottom, ${colors.background}C0, transparent)`,
          opacity: bgProgress * 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to top, ${colors.background}C0, transparent)`,
          opacity: bgProgress * 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
