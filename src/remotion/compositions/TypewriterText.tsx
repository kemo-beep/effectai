"use client";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["400", "600"] });

interface TypewriterTextProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Characters per frame
  const charsPerFrame = text.length / (durationInFrames * 0.6);
  const visibleChars = Math.floor(frame * charsPerFrame);
  const displayText = text.slice(0, Math.min(visibleChars, text.length));

  // Cursor blink
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;
  const showCursor = visibleChars < text.length || cursorVisible;

  // Exit animation
  const exitStart = durationInFrames - 20;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Terminal-style container */}
      <div
        style={{
          backgroundColor: `${colors.background}ee`,
          border: `2px solid ${colors.primary}40`,
          borderRadius: 16,
          padding: "40px 60px",
          maxWidth: "80%",
          opacity: exitOpacity,
          boxShadow: glowEffect ? `0 0 40px ${colors.primary}30` : "none",
        }}
      >
        {/* Terminal header */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27ca40" }} />
        </div>

        {/* Text with cursor */}
        <div style={{ fontFamily: "monospace", fontSize: 36, color: colors.text, lineHeight: 1.6 }}>
          <span style={{ color: colors.primary }}>{">"}</span>{" "}
          {displayText}
          {showCursor && (
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 36,
                backgroundColor: colors.primary,
                marginLeft: 4,
                verticalAlign: "middle",
              }}
            />
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
