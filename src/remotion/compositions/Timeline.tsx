"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["500", "700"] });

interface TimelineProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Parse timeline items from text (separated by |)
  const items = text.split("|").map((s) => s.trim());

  // Exit
  const exitStart = durationInFrames - 25;
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
        padding: 80,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0, opacity: exitOpacity }}>
        {items.map((item, i) => {
          const delay = i * 15;
          const itemProgress = spring({ fps, frame: frame - delay, config: { damping: 12 } });
          const scale = interpolate(itemProgress, [0, 1], [0, 1]);
          const opacity = interpolate(itemProgress, [0, 0.5, 1], [0, 1, 1]);

          return (
            <React.Fragment key={i}>
              {/* Timeline node */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: colors.primary,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: glowEffect ? `0 0 30px ${colors.primary}` : "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <span style={{ fontFamily, fontSize: 24, fontWeight: 700, color: "#fff" }}>
                    {i + 1}
                  </span>
                </div>

                {/* Label */}
                <div
                  style={{
                    marginTop: 20,
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 500,
                    color: colors.text,
                    textAlign: "center",
                    maxWidth: 150,
                  }}
                >
                  {item}
                </div>
              </div>

              {/* Connector line */}
              {i < items.length - 1 && (
                <div
                  style={{
                    width: interpolate(
                      spring({ fps, frame: frame - delay - 10, config: { damping: 15 } }),
                      [0, 1],
                      [0, 100]
                    ),
                    height: 4,
                    backgroundColor: colors.secondary,
                    marginBottom: 60,
                    borderRadius: 2,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
