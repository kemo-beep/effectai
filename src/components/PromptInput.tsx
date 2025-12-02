"use client";
import React, { useState } from "react";
import { Button } from "./Button/Button";
import { cn } from "../lib/utils";
import { Sparkles, Zap, Monitor, Smartphone, Square, Camera, Palette, Clock } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string, style: string, duration: number, aspectRatio: string) => void;
  isLoading: boolean;
}

const STYLE_OPTIONS = [
  { value: "bold-modern", label: "Bold Modern", emoji: "🎯" },
  { value: "neon-futuristic", label: "Neon Futuristic", emoji: "🌟" },
  { value: "corporate-minimal", label: "Corporate Minimal", emoji: "💼" },
  { value: "kinetic-3d", label: "Kinetic 3D", emoji: "🎲" },
  { value: "gradient-flow", label: "Gradient Flow", emoji: "🌊" },
  { value: "lofi-anime", label: "Lo-Fi Anime", emoji: "🎨" },
  { value: "elegant-classic", label: "Elegant Classic", emoji: "✨" },
  { value: "hand-drawn", label: "Hand Drawn", emoji: "✏️" },
];

const DURATION_OPTIONS = [
  { value: 5, label: "5s" },
  { value: 10, label: "10s" },
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
];

const ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9", desc: "Landscape", icon: Monitor },
  { value: "9:16", label: "9:16", desc: "Vertical", icon: Smartphone },
  { value: "1:1", label: "1:1", desc: "Square", icon: Square },
  { value: "4:5", label: "4:5", desc: "Portrait", icon: Camera },
];

const EXAMPLE_PROMPTS = [
  "Welcome to our startup - innovating the future",
  "Summer sale 50% off everything",
  "Introducing AI-powered productivity",
  "Join us for the tech conference 2025",
];

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("bold-modern");
  const [duration, setDuration] = useState(10);
  const [aspectRatio, setAspectRatio] = useState("16:9");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, style, duration, aspectRatio);
    }
  };

  return (
    <div className="animate-in">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Input */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary rounded-2xl opacity-20 group-hover:opacity-50 transition duration-500 blur-sm"></div>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your motion graphic... e.g., 'Create a 15-second promo for a fitness app with energetic neon style'"
              className="w-full px-6 py-5 pr-14 bg-background-secondary border border-white/10 rounded-xl text-white placeholder:text-white/20 resize-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 min-h-[140px] text-lg leading-relaxed shadow-inner"
              rows={3}
              disabled={isLoading}
            />
            <div className="absolute right-5 top-5 text-primary-400 pointer-events-none animate-pulse-slow">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Style Selection */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="label flex items-center gap-2">
              <Palette className="w-3 h-3" /> Style
            </label>
            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="select-field"
                disabled={isLoading}
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-background-secondary text-white">
                    {opt.emoji} {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Aspect Ratio Selection */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="label flex items-center gap-2">
              <Monitor className="w-3 h-3" /> Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-1 bg-white/5 p-1 rounded-xl border border-white/5 h-[46px]">
              {ASPECT_RATIO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAspectRatio(opt.value)}
                  className={cn(
                    "relative flex items-center justify-center rounded-lg transition-all duration-200",
                    aspectRatio === opt.value
                      ? "bg-primary-600 text-white shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                  disabled={isLoading}
                  title={`${opt.label} - ${opt.desc}`}
                >
                  <opt.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="label flex items-center gap-2">
              <Clock className="w-3 h-3" /> Duration
            </label>
            <div className="grid grid-cols-4 gap-1 bg-white/5 p-1 rounded-xl border border-white/5 h-[46px]">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  className={cn(
                    "text-xs font-medium rounded-lg transition-all duration-200",
                    duration === opt.value
                      ? "bg-primary-600 text-white shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                  disabled={isLoading}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2 border-t border-white/5">
          {/* Example Prompts */}
          <div className="flex-1 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              <span className="label mr-2 whitespace-nowrap">Try:</span>
              {EXAMPLE_PROMPTS.slice(0, 2).map((example, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1.5 text-[11px] bg-white/5 hover:bg-primary-500/10 border border-white/5 hover:border-primary-500/30 rounded-full text-white/50 hover:text-primary-200 transition-all duration-200 whitespace-nowrap"
                  disabled={isLoading}
                >
                  {example.slice(0, 25)}...
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            loading={isLoading}
            size="lg"
            className="w-full sm:w-auto min-w-[160px] shadow-glow-lg"
            leftIcon={!isLoading && <Zap className="w-5 h-5" />}
          >
            {isLoading ? "Generating..." : "Generate Video"}
          </Button>
        </div>
      </form>
    </div>
  );
};

