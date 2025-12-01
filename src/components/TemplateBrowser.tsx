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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in" />

      {/* Dialog */}
      <div
        className="relative glass-panel rounded-3xl max-w-7xl w-full h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-glow">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Template Library</h2>
              <p className="text-xs text-white/50 mt-1 font-medium">
                {filteredTemplates.length} {filteredTemplates.length === 1 ? "template" : "templates"} available
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 space-y-6 border-b border-white/5 bg-background-secondary/50">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">
              🔍
            </div>
            <input
              type="text"
              placeholder="Search templates by name, style, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex gap-3 overflow-x-auto pb-2 justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl border whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${selectedCategory === null
                ? "bg-primary-600 border-primary-500 text-white shadow-glow-sm scale-105"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span>✨</span> All
            </button>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 text-sm font-medium rounded-xl border whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${selectedCategory === cat.id
                  ? "bg-primary-600 border-primary-500 text-white shadow-glow-sm scale-105"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-background/50">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-in">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <span className="text-4xl opacity-50">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
              <p className="text-sm text-white/50 max-w-md leading-relaxed">
                We couldn't find any templates matching "{searchQuery}". <br />
                Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                className="mt-6 btn-secondary text-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, index) => {
                const categoryInfo = TEMPLATE_CATEGORIES.find((c) => c.id === template.category);
                return (
                  <div
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="group relative bg-background-secondary border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary-500/50 hover:shadow-glow-sm hover:-translate-y-1 animate-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-900/20 via-background to-secondary/10 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-transparent to-transparent opacity-60" />

                      <span className="text-6xl relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 drop-shadow-2xl filter grayscale-[0.3] group-hover:grayscale-0">
                        {categoryInfo?.icon || "🎬"}
                      </span>

                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] text-white/90 font-bold uppercase tracking-wider shadow-lg">
                        {categoryInfo?.label || template.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 relative">
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary-400 transition-colors duration-200 line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-white/50 mb-5 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {template.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs font-medium text-white/40 mb-5 bg-white/5 rounded-lg p-2">
                        <span className="flex items-center gap-1.5">
                          <span>⏱️</span>
                          <span>{template.duration}s</span>
                        </span>
                        <div className="w-px h-3 bg-white/10" />
                        <span className="flex items-center gap-1.5">
                          <span>🎬</span>
                          <span>{template.scenes.length} Scenes</span>
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <div className="px-2 py-1 bg-primary-500/10 border border-primary-500/20 rounded-md text-[10px] text-primary-300 font-medium uppercase tracking-wide">
                          {template.style.replace("-", " ")}
                        </div>
                        {template.customizable.length > 0 && (
                          <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-white/40 uppercase tracking-wide">
                            Customizable
                          </div>
                        )}
                      </div>
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

