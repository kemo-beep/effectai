"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["400", "600", "700"] });

interface LowerThirdProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const LowerThird: React.FC<LowerThirdProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [name, title] = text.split("|").map((s) => s.trim());

  const slideIn = spring({ fps, frame, config: { damping: 15 } });
  const opacity = interpolate(slideIn, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          transform: `translateX(${interpolate(slideIn, [0, 1], [-400, 0])}px)`,
          opacity,
        }}
      >
        <div
          style={{
            backgroundColor: colors.primary,
            padding: "16px 32px",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontFamily, fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
            {name || text}
          </div>
          {title && (
            <div style={{ fontFamily, fontSize: 18, fontWeight: 400, color: "#fff", opacity: 0.9 }}>
              {title}
            </div>
          )}
        </div>
        <div
          style={{
            width: 6,
            height: "100%",
            backgroundColor: colors.secondary,
            position: "absolute",
            left: 0,
            top: 0,
            borderRadius: "6px 0 0 6px",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
