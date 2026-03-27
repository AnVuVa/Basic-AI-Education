import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import Sidebar from '../components/Sidebar';
import WorkflowPreview from '../components/WorkflowPreview';
import { FRAMES, CATEGORIES, QUICK_SUGGESTIONS, type WorkflowFrame } from '../data/frames';

// --- Frame card ---

function FrameCard({ frame, onClick }: { frame: WorkflowFrame; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-900/30 transition-all overflow-hidden group"
    >
      {/* Workflow preview thumbnail */}
      <div className="h-32 relative overflow-hidden bg-[#080818]">
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
      <div className="p-3.5">
        <div className="font-semibold text-white text-sm mb-1 leading-snug">{frame.title}</div>
        <div className="text-xs text-white/50 line-clamp-2 leading-relaxed">{frame.description}</div>
        <div className="flex flex-wrap gap-1 mt-2.5">
          {frame.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-white/10 text-white/60 rounded-md text-[10px] font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg text-center opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0">
          Dùng frame này →
        </div>
      </div>
    </motion.div>
  );
}

// --- Main ---

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');

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

  // Go directly to empty canvas
  const handleBuildFromScratch = () => navigate('/lab', { state: { skipToBuilder: true } });

  // Go to canvas with frame pre-loaded
  const handleFrameClick = (frame: WorkflowFrame) =>
    navigate('/lab', { state: { chatSeed: frame.chatSeed } });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gradient-to-br from-[#1e0a3c] via-[#0f0f2e] to-[#071428] overflow-y-auto">

        {/* ── Hero + Search ── */}
        <div className="flex flex-col items-center pt-12 pb-4 px-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
          >
            <Sparkles className="w-4 h-4" /> BAIEdu — Nền tảng giáo dục AI
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-3"
          >
            Bạn muốn làm gì
            <span className="text-purple-400"> hôm nay?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="text-white/40 text-base text-center mb-7"
          >
            Chọn một frame gợi ý hoặc xây workflow của riêng bạn cùng AI
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="w-full max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tìm frame... vd: thuyết trình, phân tích tài liệu, ôn thi"
                className="w-full pl-14 pr-5 py-4 bg-white/8 border border-white/15 text-white placeholder:text-white/25 rounded-2xl text-base focus:outline-none focus:bg-white/12 focus:border-purple-400/50 transition-all"
              />
            </div>

            {/* Quick suggestion pills */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {QUICK_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1.5 bg-white/8 hover:bg-white/15 border border-white/12 hover:border-white/25 text-white/60 hover:text-white rounded-full text-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ── "Xây từ đầu" CTA (below search, above gallery) ── */}
            <div className="flex items-center gap-4 mt-6 mb-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/30 text-sm">hoặc</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="flex justify-center">
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                onClick={handleBuildFromScratch}
                className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/40"
              >
                <Bot className="w-4 h-4" />
                Xây từ đầu cùng AI
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Category filter ── */}
        <div className="px-8 mt-6 mb-4">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/50'
                    : 'bg-white/8 border border-white/12 text-white/50 hover:border-purple-400/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Frame gallery ── */}
        <div className="px-8 pb-10">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-4">
            {query ? `${filteredFrames.length} kết quả cho "${query}"` : 'Khám phá frame'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFrames.map((frame, i) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <FrameCard frame={frame} onClick={() => handleFrameClick(frame)} />
              </motion.div>
            ))}

            {filteredFrames.length === 0 && (
              <div className="col-span-full py-16 text-center text-white/30">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <div className="text-sm mb-4">Không tìm thấy frame phù hợp.</div>
                <button
                  onClick={handleBuildFromScratch}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-500 transition-colors inline-flex items-center gap-2"
                >
                  Xây frame này cùng AI <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ── Quick links row ── */}
          <div className="mt-10 pt-8 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Khóa học',       desc: 'Lộ trình học tập bài bản',    to: '/courses',   color: 'from-blue-600 to-blue-800' },
              { label: 'Thư viện Prompt', desc: 'Hàng ngàn prompt AI chuẩn',  to: '/library',   color: 'from-emerald-600 to-teal-800' },
              { label: 'Cộng đồng',      desc: 'Peer review & thảo luận',     to: '/community', color: 'from-orange-600 to-red-800' },
              { label: 'Dashboard',      desc: 'Tiến độ & thành tích của bạn', to: '/dashboard', color: 'from-purple-600 to-indigo-800' },
            ].map(item => (
              <a
                key={item.to}
                href={item.to}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all group`}
              >
                <div className="font-bold text-white text-sm mb-1">{item.label}</div>
                <div className="text-white/50 text-xs">{item.desc}</div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/70 mt-3 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
