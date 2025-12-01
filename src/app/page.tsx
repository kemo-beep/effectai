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
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl">⚡</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-primary-200 transition-colors">MotionForge</span>
                <span className="text-[10px] uppercase tracking-wider text-primary-200 font-semibold opacity-80">AI Studio</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Gallery', 'Pricing', 'Docs'].map((item) => (
                <button key={item} className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button className="btn-secondary text-sm py-2 px-4 hidden sm:block">
                Log In
              </button>
              <button className="btn-primary text-sm py-2 px-4 shadow-glow">
                Get Started
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

      <main className="flex-1 relative z-10 pt-32 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {!hasGenerated ? (
            /* Initial State - Generation UI */
            <div className="max-w-4xl mx-auto animate-in-up">
              <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-500/20 blur-[100px] rounded-full pointer-events-none" />
                <h1 className="heading-1 mb-6 relative z-10">
                  Create Stunning <br />
                  <span className="text-gradient-primary">Motion Graphics with AI</span>
                </h1>
                <p className="text-body text-lg max-w-2xl mx-auto relative z-10">
                  Transform your ideas into professional animations in seconds.
                  Powered by advanced AI to bring your vision to life.
                </p>
              </div>

              <div className="glass-panel rounded-3xl p-1 relative overflow-hidden shadow-2xl ring-1 ring-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary/5" />
                <div className="bg-background-secondary/90 backdrop-blur-xl rounded-[22px] p-8 sm:p-10 relative">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="heading-3 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400">✨</span>
                      Generate Motion
                    </h3>
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="text-sm font-medium text-white/60 hover:text-white flex items-center gap-2 transition-colors group"
                    >
                      <span>Browse Templates</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                  </div>

                  <PromptInput onGenerate={handleGenerate} isLoading={isGenerating} />
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {[
                  { icon: "🎨", title: "Style Control", desc: "Choose from various artistic styles or define your own unique look." },
                  { icon: "⚡", title: "Real-time Preview", desc: "See your changes instantly with our high-performance player." },
                  { icon: "🚀", title: "One-click Export", desc: "Export to MP4, GIF, or WebM in up to 4K resolution." }
                ].map((feature, i) => (
                  <div key={i} className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
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
      <footer className="border-t border-white/5 bg-background-secondary/50 backdrop-blur-lg mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⚡</span>
                <span className="text-lg font-bold text-white">MotionForge</span>
              </div>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                The next generation of motion graphics creation.
                Powered by artificial intelligence to help you create stunning videos in minutes.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Showcase</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              © 2025 MotionForge AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-white/30 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

