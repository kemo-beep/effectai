"use client";
import React from "react";
import { Scene, STYLE_CONFIGS } from "../types/constants";

interface SceneEditorProps {
  scenes: Scene[];
  onScenesChange: (scenes: Scene[]) => void;
  selectedSceneId: string | null;
  onSelectScene: (id: string | null) => void;
}

const SCENE_TYPES = [
  // Core animations
  { value: "text-reveal", label: "Text Reveal", icon: "📝" },
  { value: "logo-intro", label: "Logo Intro", icon: "🎯" },
  { value: "kinetic-typography", label: "Kinetic Type", icon: "💫" },
  { value: "bounce-in", label: "Bounce In", icon: "🎾" },
  { value: "fade-sequence", label: "Fade Sequence", icon: "🌅" },
  // Effects
  { value: "shape-morph", label: "Shape Morph", icon: "🔮" },
  { value: "parallax", label: "Parallax", icon: "🌌" },
  { value: "slide-transition", label: "Slide", icon: "📊" },
  { value: "transition-effect", label: "Transition", icon: "🌀" },
  { value: "gradient-wave", label: "Gradient Wave", icon: "🌊" },
  // Content creator
  { value: "lower-third", label: "Lower Third", icon: "📌" },
  { value: "social-callout", label: "Social Callout", icon: "📱" },
  { value: "infographic-chart", label: "Infographic", icon: "📈" },
  { value: "number-counter", label: "Number Counter", icon: "🔢" },
  { value: "animated-icon", label: "Animated Icon", icon: "✨" },
  { value: "checklist", label: "Checklist", icon: "✅" },
  { value: "timeline", label: "Timeline", icon: "📅" },
  // Product & Tech
  { value: "product-showcase", label: "Product", icon: "📦" },
  { value: "device-mockup", label: "Device Mockup", icon: "📱" },
  { value: "typewriter", label: "Typewriter", icon: "⌨️" },
  // Fun & Memes
  { value: "meme-effect", label: "Meme Effect", icon: "💥" },
  { value: "reaction-popup", label: "Reaction", icon: "😱" },
  { value: "speech-bubble", label: "Speech Bubble", icon: "💬" },
  { value: "glitch-text", label: "Glitch Text", icon: "📺" },
  { value: "vhs-overlay", label: "VHS Retro", icon: "📼" },
];

export const SceneEditor: React.FC<SceneEditorProps> = ({
  scenes,
  onScenesChange,
  selectedSceneId,
  onSelectScene,
}) => {
  const updateScene = (id: string, updates: Partial<Scene>) => {
    onScenesChange(
      scenes.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteScene = (id: string) => {
    onScenesChange(scenes.filter((s) => s.id !== id));
    if (selectedSceneId === id) onSelectScene(null);
  };

  const addScene = () => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      type: "text-reveal",
      text: "New Scene",
      duration: 60,
      style: "bold-modern",
      colors: STYLE_CONFIGS["bold-modern"].colors,
      animation: { easing: "spring", intensity: 0.7 },
    };
    onScenesChange([...scenes, newScene]);
    onSelectScene(newScene.id);
  };

  const moveScene = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= scenes.length) return;
    const newScenes = [...scenes];
    [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]];
    onScenesChange(newScenes);
  };

  const selectedScene = scenes.find((s) => s.id === selectedSceneId);

  return (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <span className="text-primary-400">🎬</span> Timeline
        </h3>
        <button
          onClick={addScene}
          className="px-3 py-1.5 text-xs font-medium border border-dashed border-white/20 text-white/60 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 rounded-lg transition-all duration-200 flex items-center gap-1"
        >
          <span>+</span> Add Scene
        </button>
      </div>

      {/* Timeline */}
      <div className="flex gap-2 overflow-x-auto pb-4 px-2 mb-2 scrollbar-hide">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            onClick={() => onSelectScene(scene.id)}
            className={`min-w-[120px] p-3 rounded-xl border cursor-pointer transition-all duration-200 relative group overflow-hidden ${selectedSceneId === scene.id
              ? 'border-primary-500 bg-primary-500/10 shadow-glow-sm ring-1 ring-primary-500/50'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            style={{ flex: Math.max(1, scene.duration / 30) }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                {SCENE_TYPES.find((t) => t.value === scene.type)?.icon || "📝"}
              </span>
              <span className="text-[10px] font-mono text-white/40 bg-black/20 px-1.5 py-0.5 rounded">
                #{index + 1}
              </span>
            </div>
            <div className="text-xs font-medium text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {scene.text?.slice(0, 15) || "Untitled"}
            </div>
            <div className="text-[10px] text-white/40 font-mono">
              {(scene.duration / 30).toFixed(1)}s
            </div>

            {/* Active Indicator */}
            {selectedSceneId === scene.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 shadow-[0_0_10px_rgba(112,0,255,0.8)]"></div>
            )}
          </div>
        ))}
      </div>

      {/* Scene Editor Panel */}
      {selectedScene && (
        <div className="bg-[#0a0a1e]/50 rounded-xl p-5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Editing Scene #{scenes.findIndex((s) => s.id === selectedScene.id) + 1}
            </span>
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => moveScene(scenes.findIndex((s) => s.id === selectedScene.id), -1)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                disabled={scenes.findIndex((s) => s.id === selectedScene.id) === 0}
                title="Move Left"
              >
                ←
              </button>
              <button
                onClick={() => moveScene(scenes.findIndex((s) => s.id === selectedScene.id), 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                disabled={scenes.findIndex((s) => s.id === selectedScene.id) === scenes.length - 1}
                title="Move Right"
              >
                →
              </button>
              <div className="w-px h-4 bg-white/10 my-auto mx-1"></div>
              <button
                onClick={() => deleteScene(selectedScene.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                title="Delete Scene"
              >
                🗑
              </button>
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">Text Content</label>
              <textarea
                value={selectedScene.text || ""}
                onChange={(e) => updateScene(selectedScene.id, { text: e.target.value })}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 placeholder:text-white/20"
                rows={2}
                placeholder="Enter text for this scene..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">Animation Type</label>
                <div className="relative">
                  <select
                    value={selectedScene.type}
                    onChange={(e) => updateScene(selectedScene.id, { type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white text-xs cursor-pointer focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 appearance-none hover:bg-white/5"
                  >
                    {SCENE_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#0a0a1e]">
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">
                  Duration: {(selectedScene.duration / 30).toFixed(1)}s
                </label>
                <div className="h-[38px] flex items-center px-1">
                  <input
                    type="range"
                    min={30}
                    max={180}
                    step={15}
                    value={selectedScene.duration}
                    onChange={(e) => updateScene(selectedScene.id, { duration: Number(e.target.value) })}
                    className="w-full accent-primary-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-primary-200 uppercase tracking-wider">Theme Colors</label>
              <div className="flex gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="flex flex-col gap-1.5 items-center flex-1">
                  <span className="text-[10px] text-white/60">Primary</span>
                  <div className="relative group">
                    <input
                      type="color"
                      value={selectedScene.colors.primary}
                      onChange={(e) =>
                        updateScene(selectedScene.id, {
                          colors: { ...selectedScene.colors, primary: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-white/20 hover:scale-110 transition-transform duration-200 p-0"
                    />
                  </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="flex flex-col gap-1.5 items-center flex-1">
                  <span className="text-[10px] text-white/60">Secondary</span>
                  <div className="relative group">
                    <input
                      type="color"
                      value={selectedScene.colors.secondary}
                      onChange={(e) =>
                        updateScene(selectedScene.id, {
                          colors: { ...selectedScene.colors, secondary: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-white/20 hover:scale-110 transition-transform duration-200 p-0"
                    />
                  </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="flex flex-col gap-1.5 items-center flex-1">
                  <span className="text-[10px] text-white/60">Background</span>
                  <div className="relative group">
                    <input
                      type="color"
                      value={selectedScene.colors.background}
                      onChange={(e) =>
                        updateScene(selectedScene.id, {
                          colors: { ...selectedScene.colors, background: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-white/20 hover:scale-110 transition-transform duration-200 p-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
