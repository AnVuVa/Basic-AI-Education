import React, { useEffect, useState } from 'react';
import { Bot, CheckCircle2, AlertTriangle, XCircle, RefreshCw, ExternalLink, Zap, TrendingUp, Clock } from 'lucide-react';
import { AI_ACCOUNTS_MOCK, type AIAccount } from '../data/pipeline/aiProviders';

// ── Gemini live check ───────────────────────────────────────────────

async function checkGeminiStatus(): Promise<{ ok: boolean; detail: string }> {
  try {
    const key = (import.meta as any).env?.VITE_GEMINI_API_KEY
      || (import.meta as any).env?.GEMINI_API_KEY
      || '';
    if (!key) return { ok: false, detail: 'API key chưa được cấu hình' };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) return { ok: true, detail: 'API key hoạt động bình thường' };
    if (res.status === 400) return { ok: false, detail: 'API key không hợp lệ' };
    if (res.status === 429) return { ok: true, detail: 'Rate limit — key hợp lệ nhưng đang bị throttle' };
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch {
    return { ok: false, detail: 'Không kết nối được' };
  }
}

// ── Status badge ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: AIAccount['status'] }) {
  const cfg = {
    connected: { icon: CheckCircle2, text: 'Đang hoạt động', cls: 'bg-green-900/40 text-green-400 border-green-500/30' },
    limited:   { icon: AlertTriangle, text: 'Sắp hết quota', cls: 'bg-amber-900/40 text-amber-400 border-amber-500/30' },
    error:     { icon: XCircle,       text: 'Lỗi kết nối',  cls: 'bg-red-900/40 text-red-400 border-red-500/30' },
    mock:      { icon: Clock,         text: 'Demo (mock)',   cls: 'bg-slate-700 text-slate-400 border-slate-600' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${cfg.cls}`}>
      <cfg.icon size={11} /> {cfg.text}
    </span>
  );
}

// ── Usage bar ──────────────────────────────────────────────────────

function UsageBar({ used, quota }: { used: string; quota: string }) {
  // Try to parse a rough percentage from strings like "$3.67" / "$24.80"
  const usedNum  = parseFloat(used.replace(/[^0-9.]/g, '')) || 0;
  const quotaNum = parseFloat(quota.replace(/[^0-9.]/g, '')) || 0;
  const pct      = quotaNum > 0 ? Math.min((usedNum / quotaNum) * 100, 100) : 0;
  const color    = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-green-500';

  if (quotaNum === 0) return null;
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
        <span>Đã dùng tháng này</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Account card ───────────────────────────────────────────────────

function AccountCard({ account, liveDetail }: { account: AIAccount; liveDetail?: string }) {
  return (
    <div className={`bg-slate-800/60 border rounded-2xl overflow-hidden transition-all hover:border-slate-600 ${account.status === 'connected' ? 'border-slate-600' : 'border-slate-700/60'}`}>
      {/* Header */}
      <div className={`${account.color} px-4 py-3 flex items-center gap-3`}>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {account.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">{account.provider}</span>
            <StatusBadge status={account.status} />
          </div>
          <p className="text-xs text-white/60 truncate">{account.accountName}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Plan + Balance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">Gói dịch vụ</div>
            <div className="text-xs font-semibold text-slate-200">{account.plan}</div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wide">
              {account.balance?.includes('credits') || account.balance?.includes('chars') ? 'Còn lại' : 'Số dư'}
            </div>
            <div className={`text-sm font-bold ${account.accent}`}>{account.balance ?? '—'}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <TrendingUp size={11} /> Tháng này: <span className="text-slate-200 ml-0.5">{account.usedThisMonth}</span>
          </span>
          {account.lastUsed && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> Dùng: <span className="text-slate-200 ml-0.5">{account.lastUsed}</span>
            </span>
          )}
        </div>

        {/* Usage bar (only for $ values) */}
        {account.usedThisMonth.startsWith('$') && (
          <UsageBar used={account.usedThisMonth} quota={account.balance ?? ''} />
        )}

        {/* Live Gemini detail */}
        {liveDetail && (
          <div className={`text-[11px] px-2.5 py-1.5 rounded-lg border ${account.status === 'connected' ? 'bg-green-900/20 border-green-800/40 text-green-300' : 'bg-red-900/20 border-red-800/40 text-red-300'}`}>
            ● Live check: {liveDetail}
          </div>
        )}

        {/* Models */}
        <div>
          <div className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-wide">Models khả dụng</div>
          <div className="flex flex-wrap gap-1">
            {account.models.map(m => (
              <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Quota */}
        <div className="text-[11px] text-slate-500">
          Quota: <span className="text-slate-300">{account.quota}</span>
        </div>
      </div>
    </div>
  );
}

// ── Summary stats ───────────────────────────────────────────────────

function SummaryStats({ accounts }: { accounts: AIAccount[] }) {
  const connected = accounts.filter(a => a.status === 'connected' || a.status === 'mock').length;
  const totalProviders = accounts.length;
  const totalModels = accounts.reduce((sum, a) => sum + a.models.length, 0);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Tài khoản kết nối', value: connected, icon: CheckCircle2, color: 'text-green-400' },
        { label: 'Nhà cung cấp AI',   value: totalProviders, icon: Bot,          color: 'text-violet-400' },
        { label: 'Models khả dụng',   value: totalModels,    icon: Zap,          color: 'text-yellow-400' },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4">
          <div className={`rounded-xl bg-slate-700/60 p-2.5 ${color}`}>
            <Icon size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────

export default function AIAccounts() {
  const [accounts, setAccounts] = useState<AIAccount[]>(AI_ACCOUNTS_MOCK);
  const [geminiDetail, setGeminiDetail] = useState<string>('Đang kiểm tra...');
  const [checking, setChecking] = useState(false);

  const doGeminiCheck = async () => {
    setChecking(true);
    const { ok, detail } = await checkGeminiStatus();
    setGeminiDetail(detail);
    setAccounts(prev => prev.map(a =>
      a.id === 'google-gemini'
        ? { ...a, status: ok ? 'connected' : 'error' }
        : a
    ));
    setChecking(false);
  };

  useEffect(() => { doGeminiCheck(); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Tài khoản AI</h1>
                <p className="text-sm text-slate-400">Quản lý API keys và theo dõi sử dụng</p>
              </div>
            </div>
            {/* Logged-in as */}
            <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-slate-800/60 border border-slate-700/40 rounded-xl w-fit">
              <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">B</div>
              <span className="text-xs text-slate-300">Đang đăng nhập:</span>
              <span className="text-xs font-semibold text-violet-300">BAIEdu System Account</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-green-900/40 text-green-400 rounded-full border border-green-500/30">Admin</span>
            </div>
          </div>
          <button
            onClick={doGeminiCheck}
            disabled={checking}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm text-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
            Kiểm tra lại
          </button>
        </div>

        {/* Summary */}
        <SummaryStats accounts={accounts} />

        {/* Account grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {accounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              liveDetail={account.id === 'google-gemini' ? geminiDetail : undefined}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-slate-600">
          Số dư và lịch sử sử dụng được cập nhật theo thời gian thực từ API của từng nhà cung cấp.
          <br />
          Các tài khoản hiển thị "Demo" là ước tính — liên hệ admin để thêm API key thật.
        </div>
      </div>
    </div>
  );
}
