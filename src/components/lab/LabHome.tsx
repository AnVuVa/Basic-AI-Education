import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Zap, Clock, CheckCircle2, AlertCircle, PlayCircle, Square,
  MoreVertical, Copy, Trash2, Edit2, Play, FileText, Bell, Mail,
  CalendarClock, TrendingUp, Layers, FileSearch, BriefcaseBusiness,
  Bot, ShieldCheck, AlarmClock, ChevronRight, Search, Sparkles,
} from 'lucide-react';
import { usePipeline } from '../../contexts/PipelineContext';
import { PIPELINE_TEMPLATES } from '../../data/pipeline/pipelineTemplates';
import type { Pipeline, PipelineTemplate } from '../../types/pipeline';

// ── Status badge ──────────────────────────────────────────────────

const STATUS_META = {
  active:   { label: 'Đang chạy',   color: 'bg-green-500/15 text-green-400 border-green-500/30',  dot: 'bg-green-400' },
  disabled: { label: 'Đã tắt',      color: 'bg-slate-500/15 text-slate-400 border-slate-500/30',  dot: 'bg-slate-400' },
  draft:    { label: 'Nháp',         color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',     dot: 'bg-blue-400'  },
  error:    { label: 'Lỗi',          color: 'bg-red-500/15 text-red-400 border-red-500/30',        dot: 'bg-red-400'   },
};
const RUN_STATUS_META = {
  success:          { icon: CheckCircle2, color: 'text-green-400' },
  failed:           { icon: AlertCircle,  color: 'text-red-400'   },
  pending_approval: { icon: Clock,        color: 'text-amber-400' },
  running:          { icon: Zap,          color: 'text-blue-400'  },
};
const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  Mail, CalendarClock, AlarmClock, ShieldCheck, TrendingUp,
  Layers, FileSearch, BriefcaseBusiness, Bot, CheckSquare: CheckCircle2,
};

function StatusBadge({ status }: { status: Pipeline['status'] }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function RelativeTime({ ts }: { ts?: number }) {
  if (!ts) return <span className="text-slate-500">Chưa chạy</span>;
  const diffMs = Date.now() - ts;
  const mins   = Math.floor(diffMs / 60000);
  const hours  = Math.floor(diffMs / 3600000);
  const days   = Math.floor(diffMs / 86400000);
  const label  = mins < 1 ? 'vừa xong' : mins < 60 ? `${mins} phút trước` : hours < 24 ? `${hours} giờ trước` : `${days} ngày trước`;
  return <span className="text-slate-400">{label}</span>;
}

// ── Pipeline row card ─────────────────────────────────────────────

function PipelineCard({
  pipeline, onEdit, onRun, onToggle, onDuplicate, onDelete, onLogs,
}: {
  pipeline: Pipeline;
  onEdit: () => void; onRun: () => void; onToggle: () => void;
  onDuplicate: () => void; onDelete: () => void; onLogs: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isRunning } = usePipeline();
  const runMeta = pipeline.lastRunStatus ? RUN_STATUS_META[pipeline.lastRunStatus] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group"
    >
      <div className="flex items-start gap-4">
        {/* Toggle */}
        <button
          onClick={onToggle}
          title={pipeline.status === 'active' ? 'Tắt pipeline' : 'Bật pipeline'}
          className={`mt-0.5 shrink-0 w-10 h-6 rounded-full transition-all ${
            pipeline.status === 'active' ? 'bg-green-500' : 'bg-slate-600'
          } relative`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
            pipeline.status === 'active' ? 'left-4.5' : 'left-0.5'
          }`} style={{ left: pipeline.status === 'active' ? '18px' : '2px' }} />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{pipeline.name}</span>
            <StatusBadge status={pipeline.status} />
            {pipeline.pendingApprovalCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-medium">
                {pipeline.pendingApprovalCount} chờ duyệt
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{pipeline.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs flex-wrap">
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" /> Chạy lần cuối: <RelativeTime ts={pipeline.lastRunAt} />
            </span>
            {runMeta && (
              <span className={`flex items-center gap-1 ${runMeta.color}`}>
                <runMeta.icon className="w-3.5 h-3.5" />
                {pipeline.lastRunStatus === 'success' ? 'Thành công' :
                  pipeline.lastRunStatus === 'failed' ? 'Thất bại' :
                  pipeline.lastRunStatus === 'pending_approval' ? 'Chờ duyệt' : 'Đang chạy'}
              </span>
            )}
            {pipeline.todayTriggerCount > 0 && (
              <span className="text-slate-500">
                <Zap className="w-3 h-3 inline mr-0.5 text-yellow-400" />
                {pipeline.todayTriggerCount} lần hôm nay
              </span>
            )}
            {pipeline.tags.map(t => (
              <span key={t} className="px-2 py-0.5 bg-white/5 text-slate-500 rounded text-[10px]">{t}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRun}
            disabled={isRunning || pipeline.nodes.length === 0}
            title="Chạy ngay"
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> Chạy
          </button>
          <button onClick={onEdit} title="Chỉnh sửa"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} title="Thêm"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-8 z-50 w-44 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  {[
                    { icon: FileText, label: 'Xem logs', action: () => { onLogs(); setMenuOpen(false); } },
                    { icon: Copy,     label: 'Nhân bản',  action: () => { onDuplicate(); setMenuOpen(false); } },
                    { icon: Trash2,   label: 'Xóa',       action: () => { onDelete(); setMenuOpen(false); }, red: true },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${item.red ? 'text-red-400 hover:text-red-300' : 'text-slate-300'}`}>
                      <item.icon className="w-4 h-4" /> {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Template picker card ──────────────────────────────────────────

function TemplateCard({ tpl, onClick }: { tpl: PipelineTemplate; onClick: () => void }) {
  const Icon = TEMPLATE_ICONS[tpl.icon] ?? Sparkles;
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${tpl.color} p-4 rounded-2xl text-left transition-all border border-white/10 hover:border-white/30 group w-full`}
    >
      <Icon className="w-6 h-6 text-white/80 mb-2 group-hover:text-white transition-colors" />
      <div className="text-white font-semibold text-sm leading-snug">{tpl.name}</div>
      <div className="text-white/60 text-xs mt-1 line-clamp-2">{tpl.description}</div>
      <div className="flex gap-1 mt-2 flex-wrap">
        {tpl.connectors.map(c => (
          <span key={c} className="px-1.5 py-0.5 bg-black/20 text-white/60 rounded text-[10px]">{c}</span>
        ))}
      </div>
    </motion.button>
  );
}

// ── Recent activity ───────────────────────────────────────────────

function RecentActivity() {
  const { notifications, approvals, markNotificationRead } = usePipeline();
  const pending = approvals.filter(a => a.status === 'pending');
  const recent  = [...notifications].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
  const unread  = recent.filter(n => !n.read);

  if (recent.length === 0 && pending.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
        Chưa có hoạt động nào
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pending.map(a => (
        <div key={a.id} className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-amber-300 text-xs font-semibold">Chờ duyệt · {a.pipelineName}</div>
            <div className="text-slate-300 text-xs mt-0.5 truncate">{a.proposedAction.split('\n')[0]}</div>
          </div>
        </div>
      ))}
      {recent.map(n => (
        <button
          key={n.id} onClick={() => markNotificationRead(n.id)}
          className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${n.read ? 'bg-white/3' : 'bg-white/8 border border-white/10'}`}
        >
          <Bell className={`w-4 h-4 mt-0.5 shrink-0 ${n.read ? 'text-slate-500' : 'text-blue-400'}`} />
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-medium truncate ${n.read ? 'text-slate-400' : 'text-white'}`}>{n.title}</div>
            <div className="text-slate-500 text-xs mt-0.5 truncate">{n.body.substring(0, 60)}</div>
          </div>
          {!n.read && <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />}
        </button>
      ))}
    </div>
  );
}

// ── Main LabHome ──────────────────────────────────────────────────

interface Props {
  onCreateNew: () => void;
  onEditPipeline: (id: string) => void;
  onViewLogs: (id: string) => void;
  onOpenApprovals: () => void;
  onOpenNotifications: () => void;
}

export default function LabHome({
  onCreateNew, onEditPipeline, onViewLogs, onOpenApprovals, onOpenNotifications,
}: Props) {
  const { pipelines, approvals, notifications, runPipeline, togglePipelineActive, deletePipeline, duplicatePipeline, createPipeline } = usePipeline();
  const [intentInput, setIntentInput] = useState('');
  const [showAllTemplates, setShowAllTemplates] = useState(false);

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const unreadNotifs    = notifications.filter(n => !n.read);
  const activePipelines = pipelines.filter(p => p.status === 'active');
  const templatesShown  = showAllTemplates ? PIPELINE_TEMPLATES : PIPELINE_TEMPLATES.slice(0, 5);

  const handleIntentSubmit = () => {
    if (!intentInput.trim()) return;
    // Find best matching template by keyword
    const q = intentInput.toLowerCase();
    const matched = PIPELINE_TEMPLATES.find(t =>
      t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) ||
      t.useCase.toLowerCase().includes(q)
    );
    if (matched) {
      const p = createPipeline(matched);
      onEditPipeline(p.id);
    } else {
      onCreateNew();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0e0a20] via-[#0f0f2e] to-[#071428]">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" /> Phòng Lab
              </h1>
              <p className="text-slate-400 text-sm mt-1">Tạo và vận hành các pipeline trợ lý tự động</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onOpenNotifications}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full" />
                )}
              </button>
              <button onClick={onOpenApprovals}
                className={`relative p-2 rounded-xl transition-colors ${
                  pendingApprovals.length > 0 ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}>
                <ShieldCheck className="w-5 h-5" />
                {pendingApprovals.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black rounded-full text-[9px] font-bold flex items-center justify-center">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
              <button onClick={onCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Tạo pipeline mới
              </button>
            </div>
          </div>

          {/* ── Quick stats ── */}
          {pipelines.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Pipeline đang chạy', value: activePipelines.length, icon: Zap, color: 'text-green-400' },
                { label: 'Chờ duyệt', value: pendingApprovals.length, icon: ShieldCheck, color: 'text-amber-400', onClick: onOpenApprovals },
                { label: 'Thông báo mới', value: unreadNotifs.length, icon: Bell, color: 'text-blue-400', onClick: onOpenNotifications },
                { label: 'Tổng pipeline', value: pipelines.length, icon: FileText, color: 'text-purple-400' },
              ].map(stat => (
                <button
                  key={stat.label}
                  onClick={stat.onClick}
                  className={`bg-white/5 border border-white/10 rounded-2xl p-4 text-left transition-colors ${stat.onClick ? 'hover:border-white/20 cursor-pointer' : 'cursor-default'}`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* ── Hero intent input ── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-1">Hôm nay bạn muốn làm gì?</h2>
            <p className="text-slate-400 text-sm mb-4">Mô tả ý định, AI sẽ gợi ý pipeline phù hợp nhất</p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  value={intentInput}
                  onChange={e => setIntentInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleIntentSubmit()}
                  placeholder="Ví dụ: Theo dõi Gmail và nhắc tôi khi có mail quan trọng..."
                  className="w-full pl-11 pr-4 py-3 bg-white/8 border border-white/15 text-white placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:border-purple-400/50 transition-all"
                />
              </div>
              <button onClick={handleIntentSubmit}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                <Sparkles className="w-4 h-4" /> Gợi ý pipeline
              </button>
            </div>
          </div>

          {/* ── Pipeline templates ── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Pipeline mẫu có sẵn ({PIPELINE_TEMPLATES.length})</h2>
              <button onClick={() => setShowAllTemplates(!showAllTemplates)}
                className="text-purple-400 text-sm hover:text-purple-300 transition-colors flex items-center gap-1">
                {showAllTemplates ? 'Thu gọn' : 'Xem tất cả'} <ChevronRight className={`w-4 h-4 transition-transform ${showAllTemplates ? 'rotate-90' : ''}`} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {templatesShown.map(tpl => (
                <TemplateCard
                  key={tpl.id} tpl={tpl}
                  onClick={() => {
                    const p = createPipeline(tpl);
                    onEditPipeline(p.id);
                  }}
                />
              ))}
              <motion.button
                whileHover={{ y: -2 }}
                onClick={onCreateNew}
                className="border-2 border-dashed border-white/20 hover:border-purple-400/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-purple-400 transition-all min-h-[120px]"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-medium">Tạo từ đầu</span>
              </motion.button>
            </div>
          </div>

          {/* ── My pipelines ── */}
          {pipelines.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white font-semibold mb-4">Pipeline của tôi ({pipelines.length})</h2>
              <div className="space-y-3">
                {pipelines.map(p => (
                  <PipelineCard
                    key={p.id} pipeline={p}
                    onEdit={() => onEditPipeline(p.id)}
                    onRun={() => runPipeline(p.id, 'manual')}
                    onToggle={() => togglePipelineActive(p.id)}
                    onDuplicate={() => duplicatePipeline(p.id)}
                    onDelete={() => { if (confirm(`Xóa "${p.name}"?`)) deletePipeline(p.id); }}
                    onLogs={() => onViewLogs(p.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {pipelines.length === 0 && (
            <div className="py-16 text-center">
              <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Chưa có pipeline nào</h3>
              <p className="text-slate-400 text-sm mb-6">Chọn một template bên trên hoặc tạo pipeline từ đầu</p>
              <button onClick={onCreateNew}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors">
                Tạo pipeline đầu tiên
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Sidebar: Recent activity ── */}
      <div className="w-72 border-l border-white/10 bg-white/3 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-semibold text-sm">Hoạt động gần đây</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
