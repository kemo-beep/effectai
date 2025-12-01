"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["500", "700"] });

interface ChecklistItemProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Parse items from text (separated by |)
  const items = text.split("|").map((s) => s.trim());

  const exitStart = durationInFrames - 20;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", padding: 100 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, opacity: exitOpacity }}>
        {items.map((item, i) => {
          const delay = i * 20;
          const itemProgress = spring({ fps, frame: frame - delay, config: { damping: 12 } });
          const checkProgress = spring({ fps, frame: frame - delay - 15, config: { damping: 8 } });

          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24,
              opacity: itemProgress, transform: `translateX(${interpolate(itemProgress, [0, 1], [-50, 0])}px)` }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: colors.primary,
                display: "flex", justifyContent: "center", alignItems: "center",
                boxShadow: glowEffect ? `0 0 20px ${colors.primary}` : "0 4px 15px rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: 28, color: "#fff", transform: `scale(${checkProgress})` }}>✓</span>
              </div>
              <span style={{ fontFamily, fontSize: 36, fontWeight: 500, color: colors.text }}>{item}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
