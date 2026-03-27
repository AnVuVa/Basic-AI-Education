import React, { useState } from 'react';
import {
  ArrowLeft, Activity, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, Loader2, Clock,
} from 'lucide-react';
import { usePipeline } from '../../contexts/PipelineContext';
import type { PipelineRun, RunStep } from '../../types/pipeline';

function relTime(ms: number): string {
  const d = Date.now() - ms;
  if (d < 60000)   return 'Vừa xong';
  if (d < 3600000) return `${Math.floor(d / 60000)} phút trước`;
  if (d < 86400000)return `${Math.floor(d / 3600000)} giờ trước`;
  return `${Math.floor(d / 86400000)} ngày trước`;
}

function duration(start: number, end?: number): string {
  const ms = (end ?? Date.now()) - start;
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const STATUS_CFG = {
  success:          { Icon: CheckCircle2, color: 'text-green-400',  bg: 'bg-green-900/30',  label: 'Thành công' },
  failed:           { Icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-900/30',    label: 'Lỗi'        },
  running:          { Icon: Loader2,      color: 'text-blue-400',   bg: 'bg-blue-900/30',   label: 'Đang chạy'  },
  pending_approval: { Icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-900/30',  label: 'Chờ duyệt'  },
  cancelled:        { Icon: XCircle,      color: 'text-slate-400',  bg: 'bg-slate-700',     label: 'Đã hủy'     },
  waiting:          { Icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-900/30',  label: 'Chờ duyệt'  },
  skipped:          { Icon: ChevronRight, color: 'text-slate-500',  bg: 'bg-slate-800',     label: 'Bỏ qua'     },
  pending:          { Icon: Clock,        color: 'text-slate-400',  bg: 'bg-slate-800',     label: 'Chờ'         },
} as const;

function StepRow({ step }: { step: RunStep }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CFG[step.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.running;
  const isRunning = step.status === 'running';

  return (
    <div className="border-l-2 border-slate-700/60 ml-4 pl-3">
      <button
        onClick={() => step.logs.length > 0 && setExpanded(!expanded)}
        className={`w-full flex items-center gap-2 py-1.5 rounded-lg px-1 text-left ${step.logs.length > 0 ? 'hover:bg-slate-800/50 cursor-pointer' : 'cursor-default'}`}
      >
        <cfg.Icon size={12} className={`${cfg.color} shrink-0 ${isRunning ? 'animate-spin' : ''}`} />
        <span className="text-xs text-slate-300 flex-1 font-medium">{step.blockLabel}</span>
        <span className="text-[10px] text-slate-500 shrink-0">{duration(step.startedAt, step.finishedAt)}</span>
        {step.logs.length > 0 && (
          expanded
            ? <ChevronDown size={11} className="text-slate-500 shrink-0" />
            : <ChevronRight size={11} className="text-slate-500 shrink-0" />
        )}
      </button>

      {expanded && step.logs.length > 0 && (
        <div className="mb-2 mx-1 bg-slate-950 rounded-lg p-2.5 font-mono text-[10px] text-slate-400 space-y-0.5 max-h-36 overflow-y-auto">
          {step.logs.map((log, i) => (
            <div
              key={i}
              className={
                log.startsWith('[ERROR]') ? 'text-red-400'
                : log.startsWith('[WARN]')  ? 'text-yellow-400'
                : log.startsWith('✅')       ? 'text-green-400'
                : ''
              }
            >
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RunCard({ run }: { run: PipelineRun }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CFG[run.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.running;
  const isRunning = run.status === 'running';

  return (
    <div className="bg-slate-800/60 rounded-xl border border-slate-700/60 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/40 transition-colors text-left"
      >
        <div className={`rounded-full p-1.5 shrink-0 ${cfg.bg}`}>
          <cfg.Icon size={14} className={`${cfg.color} ${isRunning ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-200 truncate">{run.pipelineName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 flex-wrap">
            <span>{relTime(run.startedAt)}</span>
            <span>·</span>
            <span>{duration(run.startedAt, run.finishedAt)}</span>
            <span>·</span>
            <span>{run.steps.length} bước</span>
            {run.triggerSource && (
              <><span>·</span><span>{run.triggerSource === 'manual' ? 'Thủ công' : run.triggerSource}</span></>
            )}
          </div>
        </div>
        {expanded
          ? <ChevronDown size={14} className="text-slate-500 shrink-0" />
          : <ChevronRight size={14} className="text-slate-500 shrink-0" />
        }
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/40 pt-3">
          {run.outcome && (
            <div className="mb-3 text-xs bg-slate-900/60 rounded-lg px-3 py-2">
              <span className="text-slate-400">Kết quả: </span>
              <span className="text-slate-200 font-medium">{run.outcome}</span>
            </div>
          )}
          {run.error && (
            <div className="mb-3 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2 text-red-400">
              Lỗi: {run.error}
            </div>
          )}
          <div className="space-y-0.5">
            {run.steps.map(step => <StepRow key={step.nodeId} step={step} />)}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  onBack: () => void;
  pipelineId?: string;
}

export default function ExecutionLogs({ onBack, pipelineId }: Props) {
  const { runs, pipelines } = usePipeline();
  const [filterPipelineId, setFilterPipelineId] = useState(pipelineId ?? '');

  const filtered = [...runs]
    .filter(r => !filterPipelineId || r.pipelineId === filterPipelineId)
    .sort((a, b) => b.startedAt - a.startedAt);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/60 shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <Activity size={18} className="text-sky-400" />
        <h1 className="text-lg font-semibold">Nhật ký thực thi</h1>
        <div className="ml-auto">
          <select
            value={filterPipelineId}
            onChange={e => setFilterPipelineId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="">Tất cả pipeline</option>
            {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto w-full">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
              <Activity size={40} className="text-slate-600" />
              <p className="text-sm">Chưa có lần chạy nào</p>
              <p className="text-xs text-slate-600">Chạy thử một pipeline để xem nhật ký ở đây</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(run => <RunCard key={run.id} run={run} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
