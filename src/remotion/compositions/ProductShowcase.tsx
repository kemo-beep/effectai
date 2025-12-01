"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["700", "900"] });

interface ProductShowcaseProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomIn = spring({ fps, frame, config: { damping: 15 } });
  const scale = interpolate(zoomIn, [0, 1], [0.5, 1]);
  const rotation = frame * 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      {/* Rotating rings */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 300 + i * 100,
            height: 300 + i * 100,
            border: `2px solid ${colors.primary}${Math.floor((1 - i * 0.3) * 255).toString(16)}`,
            borderRadius: "50%",
            transform: `rotate(${rotation * (1 - i * 0.3)}deg)`,
          }}
        />
      ))}

      {/* Product placeholder */}
      <div
        style={{
          width: 300,
          height: 300,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: 30,
          transform: `scale(${scale})`,
          boxShadow: glowEffect
            ? `0 0 80px ${colors.primary}, 0 20px 60px rgba(0,0,0,0.4)`
            : "0 20px 60px rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily, fontSize: 72, fontWeight: 900, color: "#fff" }}>
          {text.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Product name */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          opacity: zoomIn,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 900,
            color: colors.text,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
