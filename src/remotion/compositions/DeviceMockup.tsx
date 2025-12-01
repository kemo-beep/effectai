"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["600", "700"] });

interface DeviceMockupProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slideIn = spring({ fps, frame, config: { damping: 15 } });
  const scale = interpolate(slideIn, [0, 1], [0.8, 1]);
  const rotation = interpolate(slideIn, [0, 1], [15, 5]);

  const exitStart = durationInFrames - 25;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${scale}) perspective(1000px) rotateY(${rotation}deg)`,
        opacity: slideIn * exitOpacity }}>
        {/* Phone frame */}
        <div style={{ width: 320, height: 650, backgroundColor: "#1a1a1a", borderRadius: 50, padding: 12,
          boxShadow: glowEffect ? `0 0 60px ${colors.primary}40, 0 30px 60px rgba(0,0,0,0.4)`
            : "0 30px 60px rgba(0,0,0,0.4)" }}>
          {/* Screen */}
          <div style={{ width: "100%", height: "100%", borderRadius: 40, overflow: "hidden",
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {/* Notch */}
            <div style={{ position: "absolute", top: 20, width: 120, height: 30,
              backgroundColor: "#1a1a1a", borderRadius: 20 }} />
            {/* Content */}
            <span style={{ fontFamily, fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center",
              padding: 30 }}>{text}</span>
          </div>
        </div>
      </div>
      {/* Label */}
      <div style={{ position: "absolute", bottom: 100, opacity: slideIn * exitOpacity }}>
        <span style={{ fontFamily, fontSize: 32, fontWeight: 600, color: colors.text }}>
          Available on Mobile
        </span>
      </div>
    </AbsoluteFill>
  );
};
