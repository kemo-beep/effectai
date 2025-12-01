"use client";
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { CompositionProps, STYLE_CONFIGS } from "../types/constants";
import {
  LogoIntro,
  KineticTypography,
  TextReveal,
  SlideTransition,
  ShapeMorph,
  BounceIn,
  ParallaxScene,
  FadeSequence,
  LowerThird,
  SocialCallout,
  InfographicChart,
  AnimatedIcon,
  TransitionEffect,
  ProductShowcase,
  MemeEffect,
  ReactionPopup,
  NumberCounter,
  SpeechBubble,
  TypewriterText,
  Timeline,
  GlitchText,
  VHSOverlay,
  GradientWave,
  ChecklistItem,
  DeviceMockup,
} from "./compositions";

const SCENE_COMPONENTS: Record<string, React.FC<{
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}>> = {
  "logo-intro": LogoIntro,
  "kinetic-typography": KineticTypography,
  "text-reveal": TextReveal,
  "slide-transition": SlideTransition,
  "shape-morph": ShapeMorph,
  "bounce-in": BounceIn,
  "parallax": ParallaxScene,
  "fade-sequence": FadeSequence,
  "lower-third": LowerThird,
  "social-callout": SocialCallout,
  "infographic-chart": InfographicChart,
  "animated-icon": AnimatedIcon,
  "transition-effect": TransitionEffect,
  "product-showcase": ProductShowcase,
  "meme-effect": MemeEffect,
  "reaction-popup": ReactionPopup,
  "number-counter": NumberCounter,
  "speech-bubble": SpeechBubble,
  "typewriter": TypewriterText,
  "timeline": Timeline,
  "glitch-text": GlitchText,
  "vhs-overlay": VHSOverlay,
  "gradient-wave": GradientWave,
  "checklist": ChecklistItem,
  "device-mockup": DeviceMockup,
};

export const MotionForge: React.FC<z.infer<typeof CompositionProps>> = ({
  title,
  scenes,
  style,
  colors,
}) => {
  const styleConfig = STYLE_CONFIGS[style] || STYLE_CONFIGS["bold-modern"];

  // If no scenes, show a default intro
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: colors.background }}>
        <TextReveal
          text={title}
          colors={colors}
          glowEffect={styleConfig.glowEffect}
        />
      </AbsoluteFill>
    );
  }

  // Calculate frame offsets for each scene
  let currentFrame = 0;
  const sceneFrames = scenes.map((scene) => {
    const start = currentFrame;
    currentFrame += scene.duration;
    return { ...scene, startFrame: start };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {sceneFrames.map((scene, index) => {
        const SceneComponent = SCENE_COMPONENTS[scene.type] || TextReveal;
        const sceneColors = scene.colors || colors;
        const sceneStyleConfig = STYLE_CONFIGS[scene.style] || styleConfig;

        return (
          <Sequence
            key={scene.id || index}
            from={scene.startFrame}
            durationInFrames={scene.duration}
          >
            <SceneComponent
              text={scene.text || title}
              colors={sceneColors}
              glowEffect={sceneStyleConfig.glowEffect}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
