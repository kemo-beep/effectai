"use client";
import React, { useState, useMemo } from "react";
import { TEMPLATES, TEMPLATE_CATEGORIES, Template } from "../types/constants";

interface TemplateBrowserProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    let filtered = TEMPLATES;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          TEMPLATE_CATEGORIES.find((c) => c.id === t.category)?.label.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative glass-panel rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-glow">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Template Library</h2>
              <p className="text-xs text-white/60 mt-0.5">
                {filteredTemplates.length} {filteredTemplates.length === 1 ? "template" : "templates"} available
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            ✕
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 space-y-4 border-b border-white/10">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm rounded-lg border whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${selectedCategory === null
                ? "bg-primary-500 border-primary-500 text-white shadow-glow-sm"
                : "border-white/10 bg-white/5 text-white/70 hover:border-primary-500/50 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span>✨</span> All Templates
            </button>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-sm rounded-lg border whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${selectedCategory === cat.id
                  ? "bg-primary-500 border-primary-500 text-white shadow-glow-sm"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-primary-500/50 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
              <p className="text-sm text-white/60 max-w-md">
                Try adjusting your search or category filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTemplates.map((template) => {
                const categoryInfo = TEMPLATE_CATEGORIES.find((c) => c.id === template.category);
                return (
                  <div
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="group relative bg-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/10 hover:border-primary-500/50 hover:shadow-glow-sm hover:scale-[1.02]"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-500/20 via-secondary/20 to-primary-500/20 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary/30 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                      <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                        {categoryInfo?.icon || "🎬"}
                      </span>
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                        {categoryInfo?.label || template.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary-400 transition-colors duration-200 line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-white/60 mb-4 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {template.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                        <span className="flex items-center gap-1.5">
                          <span>⏱️</span>
                          <span>{template.duration}s</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span>🎬</span>
                          <span>{template.scenes.length} {template.scenes.length === 1 ? "scene" : "scenes"}</span>
                        </span>
                      </div>

                      {/* Style badge */}
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 bg-primary-500/20 border border-primary-500/30 rounded-lg text-xs text-primary-300 font-medium">
                          {template.style.replace("-", " ")}
                        </div>
                        {template.customizable.length > 0 && (
                          <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60">
                            Customizable
                          </div>
                        )}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

