import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Sparkles, ArrowRight, Wand2,
  BookOpen, Zap, Library, Users, Layout,
  Plus, Info,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FRAMES, CATEGORIES, QUICK_SUGGESTIONS, type WorkflowFrame } from '../data/frames';

// --- Sidebar ---

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  special?: boolean;
};

function SidebarItem({ icon: Icon, label, to, active, special }: SidebarItemProps) {
  return (
    <Link
      to={to}
      title={label}
      className={`
        w-full flex flex-col items-center gap-1 py-3 px-1 rounded-xl transition-all group relative
        ${special
          ? 'bg-purple-600 hover:bg-purple-500 text-white'
          : active
            ? 'bg-white/15 text-white'
            : 'text-white/50 hover:text-white hover:bg-white/10'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium leading-tight text-center">{label}</span>
    </Link>
  );
}

// --- Frame Card ---

function FrameCard({ frame, onClick }: { frame: WorkflowFrame; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-900/30 transition-all overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className={`h-32 bg-gradient-to-br ${frame.gradient} flex items-center justify-center relative`}>
        <div className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
          {frame.icon}
        </div>
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded-full text-[10px] text-white font-semibold">
          {frame.difficulty}
        </div>
        <div className="absolute bottom-2.5 left-2.5 flex gap-1 flex-wrap">
          {frame.tools.slice(0, 3).map(t => (
            <span key={t} className="px-1.5 py-0.5 bg-black/30 backdrop-blur-sm rounded text-[10px] text-white font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
      {/* Body */}
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

// --- Main Component ---

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

  const handleGoToLab = () => navigate('/lab');

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">

      {/* ── Left Sidebar (Canva-style) ── */}
      <div className="w-[76px] bg-[#1e0a3c] flex flex-col items-center pt-3 pb-4 gap-1 border-r border-white/10 shrink-0 overflow-y-auto">
        {/* Create new */}
        <SidebarItem icon={Plus} label="Tạo mới" to="/lab" special />

        <div className="w-10 h-px bg-white/10 my-2" />

        <SidebarItem icon={Sparkles} label="Trang chủ" to="/" active />
        <SidebarItem icon={BookOpen} label="Khóa học" to="/courses" />
        <SidebarItem icon={Zap} label="Phòng Lab" to="/lab" />
        <SidebarItem icon={Library} label="Thư viện" to="/library" />
        <SidebarItem icon={Users} label="Cộng đồng" to="/community" />

        <div className="flex-1" />
        <div className="w-10 h-px bg-white/10 mb-2" />

        <SidebarItem icon={Layout} label="Dashboard" to="/dashboard" />
        <SidebarItem icon={Info} label="Về chúng tôi" to="/about" />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 bg-gradient-to-br from-[#1e0a3c] via-[#0f0f2e] to-[#071428] overflow-y-auto">

        {/* Hero search */}
        <div className="flex flex-col items-center pt-12 pb-6 px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" /> BAIEdu — Nền tảng giáo dục AI
          </motion.div>

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
            transition={{ delay: 0.1 }}
            className="text-white/40 text-base text-center mb-8"
          >
            Chọn một frame gợi ý hoặc xây workflow của riêng bạn cùng AI
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
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

            {/* Quick suggestions */}
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
          </motion.div>
        </div>

        {/* Category filter */}
        <div className="px-8 mb-5">
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

        {/* Frame gallery */}
        <div className="px-8 pb-10">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-4">
            {query
              ? `${filteredFrames.length} kết quả cho "${query}"`
              : 'Khám phá frame'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Build from scratch */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={handleGoToLab}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-purple-500/40 bg-purple-900/10 hover:border-purple-400/70 hover:bg-purple-900/20 transition-all flex flex-col items-center justify-center p-8 min-h-[220px] gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white flex items-center justify-center transition-colors">
                <Wand2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-300 group-hover:text-white transition-colors">Xây từ đầu</div>
                <div className="text-xs text-purple-400/70 mt-1">Trao đổi với AI để tạo frame riêng</div>
              </div>
            </motion.div>

            {/* Frame cards */}
            {filteredFrames.map((frame, i) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <FrameCard frame={frame} onClick={handleGoToLab} />
              </motion.div>
            ))}

            {/* Empty state */}
            {filteredFrames.length === 0 && (
              <div className="col-span-full py-16 text-center text-white/30">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <div className="text-sm mb-4">Không tìm thấy frame phù hợp.</div>
                <button
                  onClick={handleGoToLab}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-500 transition-colors inline-flex items-center gap-2"
                >
                  Xây frame này cùng AI <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick links row */}
          <div className="mt-10 pt-8 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Khóa học', desc: 'Lộ trình học tập bài bản', to: '/courses', color: 'from-blue-600 to-blue-800' },
              { label: 'Thư viện Prompt', desc: 'Hàng ngàn prompt AI', to: '/library', color: 'from-emerald-600 to-teal-800' },
              { label: 'Cộng đồng', desc: 'Peer review & thảo luận', to: '/community', color: 'from-orange-600 to-red-800' },
              { label: 'Dashboard', desc: 'Tiến độ & thành tích', to: '/dashboard', color: 'from-purple-600 to-indigo-800' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all group`}
              >
                <div className="font-bold text-white text-sm mb-1">{item.label}</div>
                <div className="text-white/50 text-xs">{item.desc}</div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/70 mt-3 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
