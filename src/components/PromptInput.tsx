"use client";
import React, { useState } from "react";

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
  { value: "16:9", label: "16:9", desc: "Landscape", icon: "📺" },
  { value: "9:16", label: "9:16", desc: "Vertical", icon: "📱" },
  { value: "1:1", label: "1:1", desc: "Square", icon: "⬜" },
  { value: "4:5", label: "4:5", desc: "Portrait", icon: "📸" },
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary rounded-xl opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your motion graphic... e.g., 'Create a 15-second promo for a fitness app with energetic neon style'"
              className="w-full px-4 py-4 pr-12 bg-[#0a0a1e] border border-white/10 rounded-xl text-white placeholder:text-white/30 resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 min-h-[120px]"
              rows={3}
              disabled={isLoading}
            />
            <div className="absolute right-4 top-4 text-2xl opacity-50 pointer-events-none animate-pulse-slow">
              ✨
            </div>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* Style Selection */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-1">
            <label className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">
              Style
            </label>
            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm cursor-pointer focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 appearance-none hover:bg-white/10"
                disabled={isLoading}
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0a0a1e] text-white">
                    {opt.emoji} {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Aspect Ratio Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">
              Aspect Ratio
            </label>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
              {ASPECT_RATIO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAspectRatio(opt.value)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1 ${aspectRatio === opt.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  disabled={isLoading}
                  title={`${opt.label} - ${opt.desc}`}
                >
                  <span>{opt.icon}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">
              Duration
            </label>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${duration === opt.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  disabled={isLoading}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`btn-primary ml-auto flex items-center gap-2 ${!prompt.trim() || isLoading ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⚡</span>
                Generating...
              </>
            ) : (
              <>
                <span>🚀</span>
                Generate
              </>
            )}
          </button>
        </div>
      </form>

      {/* Example Prompts */}
      <div className="flex flex-wrap gap-2 items-center pt-6 border-t border-white/5 mt-6">
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider mr-2">Try:</span>
        {EXAMPLE_PROMPTS.map((example, i) => (
          <button
            key={i}
            onClick={() => setPrompt(example)}
            className="px-3 py-1.5 text-[10px] bg-white/5 hover:bg-primary-500/20 border border-white/5 hover:border-primary-500/30 rounded-full text-white/60 hover:text-primary-200 transition-all duration-200"
            disabled={isLoading}
          >
            {example.slice(0, 30)}...
          </button>
        ))}
      </div>
    </div>
  );
};

