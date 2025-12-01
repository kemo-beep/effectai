"use client";
import React, { useState } from "react";
import { State } from "../helpers/use-rendering";

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRender: () => void;
    renderState: State;
    onUndo: () => void;
    totalDuration: number;
}

const EXPORT_FORMATS = [
    { id: "mp4", label: "MP4 (H.264)", desc: "Best for sharing", icon: "🎬" },
    { id: "webm", label: "WebM", desc: "Transparent support", icon: "🌐" },
    { id: "gif", label: "GIF", desc: "Social media", icon: "🎞️" },
];

const QUALITY_OPTIONS = [
    { id: "1080p", label: "1080p Full HD", resolution: "1920×1080" },
    { id: "720p", label: "720p HD", resolution: "1280×720" },
    { id: "4k", label: "4K Ultra HD", resolution: "3840×2160" },
];

export const ExportDialog: React.FC<ExportDialogProps> = ({
    isOpen,
    onClose,
    onRender,
    renderState,
    onUndo,
    totalDuration,
}) => {
    const [selectedFormat, setSelectedFormat] = useState("mp4");
    const [selectedQuality, setSelectedQuality] = useState("1080p");

    if (!isOpen) return null;

    const isRendering = renderState.status === "rendering";
    const isDone = renderState.status === "done";
    const isError = renderState.status === "error";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative glass-panel rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <span className="text-secondary">🚀</span> Export Video
                    </h3>
                    {!isRendering && !isDone && (
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Duration info */}
                <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg mb-6">
                    <span className="text-xs font-medium text-white/60">Total Duration</span>
                    <span className="text-sm font-bold text-white">{(totalDuration / 30).toFixed(1)}s</span>
                </div>

                {/* Format selection */}
                {!isRendering && !isDone && (
                    <>
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-primary-200 uppercase tracking-wider mb-3">
                                Format
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {EXPORT_FORMATS.map((format) => (
                                    <div
                                        key={format.id}
                                        onClick={() => setSelectedFormat(format.id)}
                                        className={`p-3 rounded-xl border cursor-pointer text-center transition-all duration-200 group ${selectedFormat === format.id
                                                ? 'border-primary-500 bg-primary-500/10 shadow-glow-sm'
                                                : 'border-white/5 bg-white/5 hover:border-primary-500/30 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="block text-xl mb-2 group-hover:scale-110 transition-transform duration-200">{format.icon}</span>
                                        <span className="block text-xs font-semibold text-white mb-0.5">{format.label}</span>
                                        <span className="block text-[10px] text-white/40">{format.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quality selection */}
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-primary-200 uppercase tracking-wider mb-3">
                                Quality
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedQuality}
                                    onChange={(e) => setSelectedQuality(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm cursor-pointer focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200 appearance-none hover:bg-white/10"
                                >
                                    {QUALITY_OPTIONS.map((q) => (
                                        <option key={q.id} value={q.id} className="bg-[#0a0a1e] text-white">
                                            {q.label} ({q.resolution})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Render progress */}
                {isRendering && renderState.status === "rendering" && (
                    <div className="mb-6">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-white/60">Rendering...</span>
                            <span className="text-primary-400 font-mono">{Math.round(renderState.progress * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-secondary rounded-full transition-all duration-300 shadow-glow-sm"
                                style={{ width: `${renderState.progress * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm mb-6 flex items-center justify-between">
                        <span className="flex items-center gap-2">❌ {renderState.error.message}</span>
                        <button
                            onClick={onUndo}
                            className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-colors duration-200 border border-red-500/20"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Done state */}
                {isDone && renderState.status === "done" && (
                    <div className="text-center p-6 bg-gradient-to-b from-primary-500/10 to-transparent border border-primary-500/20 rounded-2xl mb-6">
                        <div className="text-5xl mb-3 animate-bounce">✅</div>
                        <span className="block text-lg font-bold text-white mb-1">Video Ready!</span>
                        <span className="block text-xs text-white/40 mb-4 font-mono">
                            {(renderState.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <a
                            href={renderState.url}
                            download="motionforge-video.mp4"
                            className="btn-primary inline-flex items-center gap-2 mb-3 w-full justify-center shadow-glow"
                        >
                            <span>⬇️</span> Download Video
                        </a>
                        <button
                            onClick={() => {
                                onUndo();
                                onClose();
                            }}
                            className="w-full py-2 text-sm text-white/60 hover:text-white transition-colors"
                        >
                            Create Another
                        </button>
                    </div>
                )}

                {/* Render button */}
                {!isRendering && !isDone && (
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 btn-secondary py-3 text-center"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onRender}
                            disabled={renderState.status === "invoking"}
                            className={`flex-1 btn-primary flex items-center justify-center gap-2 py-3 ${renderState.status === "invoking" ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
                        >
                            {renderState.status === "invoking" ? (
                                <>
                                    <span className="animate-spin">⚡</span>
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    Render Video
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Info note */}
                {!isRendering && !isDone && (
                    <p className="text-[10px] text-white/30 text-center mt-4 leading-relaxed">
                        Powered by Remotion Lambda. Rendering typically takes 30-60 seconds.
                    </p>
                )}
            </div>
        </div>
    );
};

