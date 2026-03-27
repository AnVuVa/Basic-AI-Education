import React from 'react';
import { ArrowLeft, Bell, CheckCheck, Info, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { usePipeline } from '../../contexts/PipelineContext';
import type { NotificationItem } from '../../types/pipeline';

function relTime(ms: number): string {
  const d = Date.now() - ms;
  if (d < 60000)   return 'Vừa xong';
  if (d < 3600000) return `${Math.floor(d / 60000)} phút trước`;
  if (d < 86400000)return `${Math.floor(d / 3600000)} giờ trước`;
  return `${Math.floor(d / 86400000)} ngày trước`;
}

const TYPE_CONFIG = {
  info:    { Icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-900/20'   },
  action:  { Icon: Zap,           color: 'text-amber-400',  bg: 'bg-amber-900/20'  },
  warning: { Icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-900/20' },
  success: { Icon: CheckCircle2,  color: 'text-green-400',  bg: 'bg-green-900/20'  },
} as const;

function NotifItem({ notif }: { notif: NotificationItem }) {
  const { markNotificationRead } = usePipeline();
  const cfg = TYPE_CONFIG[notif.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.info;

  return (
    <div
      onClick={() => !notif.read && markNotificationRead(notif.id)}
      className={`flex gap-3 px-5 py-3.5 border-b border-slate-700/40 transition-colors cursor-pointer hover:bg-slate-800/50 ${notif.read ? '' : 'bg-slate-800/30'}`}
    >
      <div className={`rounded-full p-2 shrink-0 mt-0.5 ${cfg.bg}`}>
        <cfg.Icon size={14} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-slate-200 flex-1 truncate">{notif.title}</span>
          {!notif.read && <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />}
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{notif.body}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
          <span className="truncate">{notif.pipelineName}</span>
          <span>·</span>
          <span className="shrink-0">{relTime(notif.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

interface Props { onBack: () => void }

export default function NotificationCenter({ onBack }: Props) {
  const { notifications, markAllNotificationsRead } = usePipeline();
  const unread = notifications.filter(n => !n.read);
  const sorted = [...notifications].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/60 shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <Bell size={18} className="text-sky-400" />
        <h1 className="text-lg font-semibold">Thông báo</h1>
        {unread.length > 0 && (
          <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread.length}</span>
        )}
        {unread.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <CheckCheck size={14} /> Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
            <Bell size={40} className="text-slate-600" />
            <p className="text-sm">Không có thông báo</p>
          </div>
        ) : (
          sorted.map(n => <NotifItem key={n.id} notif={n} />)
        )}
      </div>
    </div>
  );
}
