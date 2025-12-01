"use client";

import { Player } from "@remotion/player";
import { useMemo, useState, useCallback } from "react";
import { MotionForge } from "../remotion/MotionForge";
import {
  CompositionPropsType,
  defaultMyCompProps,
  VIDEO_FPS,
  Scene,
  COMP_NAME,
  Template,
  ASPECT_RATIOS,
  AspectRatio,
} from "../types/constants";
import { PromptInput } from "../components/PromptInput";
import { SceneEditor } from "../components/SceneEditor";
import { ExportDialog } from "../components/ExportDialog";
import { TemplateBrowser } from "../components/TemplateBrowser";
import { useRendering } from "../helpers/use-rendering";

export default function Home() {
  const [compositionProps, setCompositionProps] = useState<CompositionPropsType>({
    ...defaultMyCompProps,
    scenes: [], // Start with empty scenes
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Calculate total duration from scenes
  const totalDuration = useMemo(() => {
    return compositionProps.scenes.reduce((acc, scene) => acc + scene.duration, 0) || 150;
  }, [compositionProps.scenes]);

  // Get video dimensions based on aspect ratio
  const videoDimensions = useMemo(() => {
    const aspectRatio = compositionProps.aspectRatio || "16:9";
    const ratio = ASPECT_RATIOS[aspectRatio as AspectRatio] || ASPECT_RATIOS["16:9"];
    return { width: ratio.width, height: ratio.height };
  }, [compositionProps.aspectRatio]);

  // Rendering hook
  const { renderMedia, state: renderState, undo } = useRendering(COMP_NAME, compositionProps);

  // Generate motion graphics from prompt
  const handleGenerate = useCallback(async (prompt: string, style: string, duration: number, aspectRatio: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, duration, aspectRatio }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setCompositionProps({
        title: data.title,
        scenes: data.scenes,
        style: data.style,
        colors: data.colors,
        aspectRatio: data.aspectRatio || aspectRatio,
      });
      setSelectedSceneId(data.scenes[0]?.id || null);
      setHasGenerated(true);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Update scenes
  const handleScenesChange = useCallback((scenes: Scene[]) => {
    setCompositionProps((prev) => ({ ...prev, scenes }));
  }, []);

  // Load template
  const handleSelectTemplate = useCallback((template: Template) => {
    setCompositionProps({
      title: template.name,
      scenes: template.scenes,
      style: template.style,
      colors: template.colors,
      aspectRatio: "16:9", // Default for templates, can be updated later
    });
    setSelectedSceneId(template.scenes[0]?.id || null);
    setHasGenerated(true);
    setShowTemplates(false);
  }, []);

  // Reset to create new video
  const handleCreateNew = useCallback(() => {
    setCompositionProps({
      ...defaultMyCompProps,
      scenes: [],
    });
    setSelectedSceneId(null);
    setHasGenerated(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Ambient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-primary-500/10 blur-[150px] animate-pulse-slow delay-500" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-heavy rounded-2xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-glow">
                <span className="text-xl">⚡</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight">MotionForge</span>
                <span className="text-[10px] uppercase tracking-wider text-primary-200 font-semibold">AI Studio</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button className="text-sm text-white/70 hover:text-white transition-colors">Gallery</button>
              <button className="text-sm text-white/70 hover:text-white transition-colors">Pricing</button>
              <button className="text-sm text-white/70 hover:text-white transition-colors">Docs</button>
            </nav>

            <div className="flex items-center gap-3">
              <button className="btn-primary text-sm py-2 px-4 shadow-glow">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Template Browser Modal */}
      {showTemplates && (
        <TemplateBrowser
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onRender={renderMedia}
        renderState={renderState}
        onUndo={undo}
        totalDuration={totalDuration}
      />

      <main className="flex-1 relative z-10 pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {!hasGenerated ? (
            /* Initial State - Generation UI */
            <div className="max-w-3xl mx-auto animate-in">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-primary-400 via-secondary to-primary-400 bg-clip-text text-transparent">
                  Create Stunning Motion Graphics
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Powered by AI. Describe your vision and watch it come to life.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary opacity-50"></div>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3 justify-center">
                  <span className="text-primary-400">✨</span> Generate Motion
                </h3>
                <PromptInput onGenerate={handleGenerate} isLoading={isGenerating} />
              </div>

              {/* Templates Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="btn-secondary text-sm py-3 px-6 flex items-center gap-2"
                >
                  <span>📚</span> Browse Templates
                </button>
              </div>

              {/* Quick Tips */}
              <div className="mt-8 glass rounded-2xl p-6 border-l-4 border-primary-500">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white">
                  💡 Pro Tips
                </h4>
                <ul className="text-xs text-white/60 space-y-3 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                    <span>Describe the <strong>mood</strong> and <strong>style</strong> in your prompt for better results.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                    <span>Browse templates to get started quickly or create something unique from scratch.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                    <span>Exporting requires AWS Lambda configuration. Check docs for setup.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* Generated State - Preview & Editor */
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left Column - Preview */}
              <div className="flex flex-col gap-6 animate-in">
                {/* Create New Button */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Your Video</h2>
                  <button
                    onClick={handleCreateNew}
                    className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    <span>➕</span> Create New
                  </button>
                </div>

                {/* Player Container */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#000] ring-1 ring-white/10">
                    {/* Window Controls */}
                    <div className="h-8 bg-[#1a1b26] flex items-center px-4 gap-2 border-b border-white/5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                      <div className="ml-auto text-xs text-white/30 font-mono">preview.mp4</div>
                    </div>

                    <Player
                      component={MotionForge}
                      inputProps={compositionProps}
                      durationInFrames={totalDuration}
                      fps={VIDEO_FPS}
                      compositionHeight={videoDimensions.height}
                      compositionWidth={videoDimensions.width}
                      style={{
                        width: "100%",
                        aspectRatio: `${videoDimensions.width}/${videoDimensions.height}`
                      }}
                      controls
                      autoPlay
                      loop
                      acknowledgeRemotionLicense
                    />
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={() => setShowExportDialog(true)}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-glow"
                >
                  <span>🚀</span> Export Video
                </button>
              </div>

              {/* Right Column - Scene Editor */}
              <div className="flex flex-col gap-6 animate-in delay-100">
                <div className="glass-panel rounded-2xl p-1">
                  <SceneEditor
                    scenes={compositionProps.scenes}
                    onScenesChange={handleScenesChange}
                    selectedSceneId={selectedSceneId}
                    onSelectScene={setSelectedSceneId}
                  />
                </div>

                {/* Quick Tips */}
                <div className="glass rounded-2xl p-6 border-l-4 border-primary-500">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-white">
                    💡 Pro Tips
                  </h4>
                  <ul className="text-xs text-white/60 space-y-3 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                      <span>Click any scene in the timeline to fine-tune it.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                      <span>Adjust timing, colors, and animations in the editor.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0"></span>
                      <span>Export your video when you're ready to download.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-lg mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="text-sm font-semibold text-white/80">MotionForge</span>
          </div>
          <p className="text-xs text-white/40">
            Powered by <span className="text-white/60">Remotion</span> + <span className="text-white/60">Next.js</span> + <span className="text-white/60">Gemini AI</span>
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-white/40 hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/40 hover:text-primary-400 transition-colors">Terms</a>
            <a href="#" className="text-xs text-white/40 hover:text-primary-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

