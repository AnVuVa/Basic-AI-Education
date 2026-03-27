import React, { useState } from 'react';
import {
  Search, Sparkles, ArrowRight, Bot,
  ChevronLeft, Wand2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FRAMES, CATEGORIES, QUICK_SUGGESTIONS } from '../data/frames';
import WorkflowPreview from './WorkflowPreview';

// --- Props ---

type Props = {
  onEnterBuilder: (chatSeed?: string) => void;
};

// --- Component ---

export default function LabLanding({ onEnterBuilder }: Props) {
  const [stage, setStage] = useState<'landing' | 'gallery'>('landing');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');

  const handleSearch = (q: string) => {
    setQuery(q);
    setStage('gallery');
  };

  const filteredFrames = FRAMES.filter(f => {
    const q = query.toLowerCase();
    const matchesQuery = !q
      || f.title.toLowerCase().includes(q)
      || f.description.toLowerCase().includes(q)
      || f.tags.some(t => t.toLowerCase().includes(q))
      || f.category.toLowerCase().includes(q);
    const matchesCategory = category === 'Tất cả' || f.category === category;
    return matchesQuery && matchesCategory;
  });

  // ---- Landing Screen ----
  if (stage === 'landing') {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col overflow-auto">
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 min-h-[500px]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" /> AI Lab — Phòng thí nghiệm AI
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-3"
          >
            Bạn muốn làm gì
            <br />
            <span className="text-blue-400">hôm nay?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg text-center mb-10"
          >
            Chọn một frame gợi ý hoặc xây từ đầu cùng AI
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && query.trim()) handleSearch(query); }}
                placeholder="Nhập yêu cầu... vd: làm thuyết trình, phân tích tài liệu"
                className="w-full pl-14 pr-36 py-4 bg-white/10 border border-white/20 text-white placeholder:text-slate-500 rounded-2xl text-base focus:outline-none focus:bg-white/15 focus:border-blue-400/60 transition-all"
              />
              <button
                onClick={() => query.trim() && handleSearch(query)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                Tìm kiếm <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {QUICK_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white rounded-full text-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mt-10 mb-5"
          >
            <div className="h-px w-24 bg-white/10" />
            <span className="text-slate-500 text-sm">hoặc</span>
            <div className="h-px w-24 bg-white/10" />
          </motion.div>

          {/* Build from scratch CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => onEnterBuilder()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-900/30"
          >
            <Bot className="w-4 h-4" />
            Xây từ đầu cùng AI
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Browse all */}
        <div className="pb-10 flex justify-center">
          <button
            onClick={() => setStage('gallery')}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors flex items-center gap-1"
          >
            Xem tất cả frame <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ---- Gallery Screen ----
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full bg-slate-50 flex flex-col overflow-hidden"
      >
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setStage('landing')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm frame..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <span className="text-slate-400 text-sm shrink-0">{filteredFrames.length} frame</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Build from scratch card */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => onEnterBuilder()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 transition-all flex flex-col items-center justify-center p-8 min-h-[230px] gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
                <Wand2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700">Xây từ đầu</div>
                <div className="text-xs text-blue-500 mt-1">Trò chuyện với AI để tạo frame riêng</div>
              </div>
            </motion.div>

            {/* Frame cards */}
            {filteredFrames.map((frame, i) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => onEnterBuilder(frame.chatSeed)}
                className="cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all overflow-hidden group"
              >
                {/* Workflow preview thumbnail */}
                <div className="h-36 relative overflow-hidden bg-[#080818]">
                  <WorkflowPreview uid={frame.id} nodes={frame.preview.nodes} edges={frame.preview.edges} />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] text-white font-semibold">
                    {frame.difficulty}
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                    {frame.tools.slice(0, 3).map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-3.5">
                  <div className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{frame.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{frame.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {frame.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg text-center opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0">
                    Dùng frame này →
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredFrames.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <div className="text-sm">Không tìm thấy frame phù hợp.</div>
                <button
                  onClick={() => onEnterBuilder(query)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Xây frame cho "{query}" cùng AI →
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
