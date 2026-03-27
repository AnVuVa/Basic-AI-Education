import React from 'react';
import {
  ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle,
} from 'lucide-react';
import { usePipeline } from '../../contexts/PipelineContext';
import type { ApprovalRequest } from '../../types/pipeline';

function relTime(ms: number): string {
  const d = Date.now() - ms;
  if (d < 60000)   return 'Vừa xong';
  if (d < 3600000) return `${Math.floor(d / 60000)} phút trước`;
  if (d < 86400000)return `${Math.floor(d / 3600000)} giờ trước`;
  return `${Math.floor(d / 86400000)} ngày trước`;
}

function ApprovalCard({ appr }: { appr: ApprovalRequest }) {
  const { approveAction, rejectAction, snoozeAction } = usePipeline();
  const isExpired = appr.expiresAt ? Date.now() > appr.expiresAt : false;
  const isPending = appr.status === 'pending' && !isExpired;

  const statusBadge = isPending
    ? 'bg-amber-900/50 text-amber-400 border-amber-500/30'
    : appr.status === 'approved'
    ? 'bg-green-900/50 text-green-400 border-green-500/30'
    : appr.status === 'rejected'
    ? 'bg-red-900/50 text-red-400 border-red-500/30'
    : 'bg-slate-700 text-slate-400 border-slate-600';

  const statusLabel = isPending ? 'Chờ duyệt'
    : appr.status === 'approved' ? 'Đã duyệt'
    : appr.status === 'rejected' ? 'Từ chối'
    : isExpired ? 'Hết hạn' : 'Hoãn';

  return (
    <div className={`bg-slate-800/60 rounded-xl border ${isPending ? 'border-amber-500/30' : 'border-slate-700/60'} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-full p-1.5 shrink-0 ${isPending ? 'bg-amber-900/40 text-amber-400' : appr.status === 'approved' ? 'bg-green-900/40 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
          <ShieldCheck size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-slate-200 truncate">{appr.pipelineName}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusBadge}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">{appr.reason}</p>

          {/* Proposed action */}
          <div className="bg-slate-900/60 rounded-lg p-3 mb-3 border border-slate-700/40">
            <div className="text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wide">Hành động đề xuất</div>
            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{appr.proposedAction}</p>
          </div>

          {/* Context snapshot */}
          {appr.context && Object.keys(appr.context).length > 0 && (
            <div className="bg-slate-900/40 rounded-lg p-2.5 mb-3 grid grid-cols-2 gap-x-3 gap-y-1">
              {Object.entries(appr.context).slice(0, 6).map(([k, v]) => (
                <div key={k} className="text-[10px] truncate">
                  <span className="text-slate-500">{k}: </span>
                  <span className="text-slate-300">{String(v).substring(0, 30)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] text-slate-500">{relTime(appr.createdAt)}</span>
            {isPending && (
              <div className="flex gap-2">
                <button
                  onClick={() => snoozeAction(appr.id)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 transition-colors"
                >
                  <Clock size={11} /> Hoãn 4h
                </button>
                <button
                  onClick={() => rejectAction(appr.id)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-red-900/40 hover:bg-red-900/70 rounded-lg text-xs text-red-400 transition-colors"
                >
                  <XCircle size={11} /> Từ chối
                </button>
                <button
                  onClick={() => approveAction(appr.id)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-green-900/40 hover:bg-green-900/70 rounded-lg text-xs text-green-400 transition-colors"
                >
                  <CheckCircle2 size={11} /> Duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props { onBack: () => void }

export default function ApprovalCenter({ onBack }: Props) {
  const { approvals } = usePipeline();
  const pending = approvals.filter(a => a.status === 'pending');
  const others  = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/60 shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <ShieldCheck size={18} className="text-amber-400" />
        <h1 className="text-lg font-semibold">Trung tâm phê duyệt</h1>
        {pending.length > 0 && (
          <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-2xl mx-auto w-full">
          {approvals.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
              <ShieldCheck size={40} className="text-slate-600" />
              <p className="text-sm">Không có yêu cầu phê duyệt nào</p>
            </div>
          )}

          {pending.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={14} /> Chờ phê duyệt ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map(a => <ApprovalCard key={a.id} appr={a} />)}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-400 mb-3">Lịch sử ({others.length})</h2>
              <div className="space-y-3">
                {others.map(a => <ApprovalCard key={a.id} appr={a} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
