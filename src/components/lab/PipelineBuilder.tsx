import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, useReactFlow, ReactFlowProvider,
  MarkerType,
  type Node as RFNode, type Edge as RFEdge, type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft, Search, Save, Play, Upload, Loader2, Bot, User,
  Send, Settings2, Star, ArrowLeftRight, BookOpen, X, ChevronDown, ChevronUp, Trash2,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PipelineBlockNode from './PipelineBlockNode';
import { BLOCK_REGISTRY, BLOCK_CATEGORIES } from '../../data/pipeline/blockRegistry';
import { AI_PROVIDER_META } from '../../data/pipeline/aiProviders';
import { BAI_PROMPT_LIBRARY, getPromptsForBlock, type BAIPrompt } from '../../data/pipeline/promptLibrary';
import { usePipeline } from '../../contexts/PipelineContext';
import type { Pipeline, PipelineNode, PipelineEdge, FieldDef, PipelinePolicy } from '../../types/pipeline';
import { DEFAULT_POLICY } from '../../types/pipeline';

const NODE_TYPES = { pipelineBlock: PipelineBlockNode };

const DEFAULT_EDGE_OPTIONS = {
  type: 'smoothstep' as const,
  style: { stroke: '#64748b', strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
};

// ── Field renderer ─────────────────────────────────────────────────

function FieldInput({ field, value, onChange }: {
  field: FieldDef; value: any; onChange: (v: any) => void;
}) {
  const cls = 'w-full bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';
  switch (field.type) {
    case 'select':
      return (
        <select value={value ?? field.default ?? ''} onChange={e => onChange(e.target.value)} className={cls}>
          {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case 'toggle':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <div onClick={() => onChange(!value)} className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-sky-600' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-4' : 'left-0.5'}`} />
          </div>
          <span className="text-xs text-slate-400">{value ? 'Bật' : 'Tắt'}</span>
        </label>
      );
    case 'number':
      return <input type="number" value={value ?? field.default ?? ''} onChange={e => onChange(Number(e.target.value))} className={cls} />;
    case 'textarea':
      return <textarea value={value ?? field.default ?? ''} onChange={e => onChange(e.target.value)} rows={3} placeholder={field.placeholder} className={`${cls} resize-none`} />;
    case 'time':
      return <input type="time" value={value ?? field.default ?? ''} onChange={e => onChange(e.target.value)} className={cls} />;
    default:
      return <input type="text" value={value ?? field.default ?? ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className={cls} />;
  }
}

// ── Policy editor ──────────────────────────────────────────────────

function PolicyEditor({ policy, onChange }: { policy: PipelinePolicy; onChange: (p: PipelinePolicy) => void }) {
  const set = (key: keyof PipelinePolicy, value: any) => onChange({ ...policy, [key]: value });
  const cls = 'w-full bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500';
  const autoActOn = policy.autoActAllowed.length > 0;
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">Chế độ phê duyệt</label>
        <select value={policy.approvalMode} onChange={e => set('approvalMode', e.target.value as PipelinePolicy['approvalMode'])} className={cls}>
          <option value="notify_only">Chỉ thông báo</option>
          <option value="ask_before_act">Hỏi trước khi làm</option>
          <option value="auto_act">Tự động thực hiện</option>
          <option value="draft_only">Chỉ nháp</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">Tự động hành động</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <div onClick={() => set('autoActAllowed', autoActOn ? [] : ['*'])} className={`w-8 h-4 rounded-full transition-colors relative ${autoActOn ? 'bg-sky-600' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoActOn ? 'left-4' : 'left-0.5'}`} />
          </div>
          <span className="text-xs text-slate-400">{autoActOn ? 'Bật' : 'Tắt'}</span>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Giờ yên lặng từ</label>
          <input type="time" value={policy.quietHoursStart} onChange={e => set('quietHoursStart', e.target.value)} className={cls} />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">đến</label>
          <input type="time" value={policy.quietHoursEnd} onChange={e => set('quietHoursEnd', e.target.value)} className={cls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Retry (lần)</label>
          <input type="number" value={policy.retryCount} min={0} max={5} onChange={e => set('retryCount', Number(e.target.value))} className={cls} />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Delay (phút)</label>
          <input type="number" value={policy.retryDelayMinutes} min={1} onChange={e => set('retryDelayMinutes', Number(e.target.value))} className={cls} />
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">Phạm vi dữ liệu</label>
        <select value={policy.dataScope} onChange={e => set('dataScope', e.target.value as PipelinePolicy['dataScope'])} className={cls}>
          <option value="mine">Chỉ của tôi</option>
          <option value="team">Nhóm</option>
          <option value="all">Tất cả</option>
        </select>
      </div>
    </div>
  );
}

// ── Prompt Library modal ───────────────────────────────────────────

function PromptModal({ blockId, onSelect, onClose }: {
  blockId: string;
  onSelect: (prompt: BAIPrompt) => void;
  onClose: () => void;
}) {
  const prompts = getPromptsForBlock(blockId);
  const allPrompts = prompts.length > 0 ? prompts : BAI_PROMPT_LIBRARY.slice(0, 5);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/60">
          <BookOpen size={16} className="text-sky-400" />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-200">Thư viện Prompt BAIEdu</h2>
            <p className="text-[11px] text-slate-500">Chọn prompt và so sánh trước khi áp dụng</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200">
            <X size={16} />
          </button>
        </div>

        {/* Comparison table header */}
        <div className="grid grid-cols-[1fr_80px_70px_70px_60px] gap-2 px-5 py-2 bg-slate-800/60 border-b border-slate-700/40 text-[10px] text-slate-500 uppercase tracking-wide font-medium">
          <span>Prompt</span>
          <span className="text-center">Cấu trúc</span>
          <span className="text-center">Tokens</span>
          <span className="text-center">Thời gian</span>
          <span className="text-center">Điểm</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {allPrompts.map(p => (
            <div key={p.id} className="border-b border-slate-700/40 last:border-0">
              <div
                className="grid grid-cols-[1fr_80px_70px_70px_60px] gap-2 px-5 py-3 hover:bg-slate-800/40 cursor-pointer items-start"
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">{p.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.description}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.tags.map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-400">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="text-center text-[10px] text-slate-400 leading-tight">{p.structure.split('(')[0].trim()}</div>
                <div className="text-center text-[10px] text-amber-400 font-mono">{p.estimatedTokens}</div>
                <div className="text-center text-[10px] text-green-400">{p.estimatedTime}</div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] text-yellow-400 font-semibold">{p.rating}</span>
                  </div>
                  <div className="text-[9px] text-slate-600">{p.usageCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Expanded: full prompt + apply */}
              {expanded === p.id && (
                <div className="px-5 pb-4 bg-slate-800/40">
                  <div className="bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed mb-3 max-h-40 overflow-y-auto border border-slate-700/40">
                    {p.prompt}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500">Cấu trúc: {p.structure}</div>
                    <button
                      onClick={() => { onSelect(p); onClose(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs text-white transition-colors"
                    >
                      Áp dụng prompt này
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI Model inspector tab ─────────────────────────────────────────

function AIModelPanel({ blockId, onSwapBlock }: { blockId: string; onSwapBlock: (newBlockId: string) => void }) {
  const meta = AI_PROVIDER_META[blockId];
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showAlts, setShowAlts] = useState(false);

  if (!meta) return <p className="text-xs text-slate-500 text-center py-4">Không có metadata</p>;

  const altBlocks = meta.alternatives.map(id => ({
    id,
    block: BLOCK_REGISTRY[id],
    altMeta: AI_PROVIDER_META[id],
  })).filter(a => a.block);

  return (
    <div className="space-y-3 p-3">
      {/* Provider header */}
      <div className="bg-slate-700/40 rounded-xl p-3 flex items-center gap-3">
        <div className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center ${meta.color}`}>
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-200">{meta.name}</div>
          <div className="text-[10px] text-slate-500">{meta.provider} · {meta.modelVersion}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{meta.contextWindow} context</div>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Vai trò trong pipeline</div>
        <p className="text-xs text-slate-300 bg-slate-800/60 rounded-lg p-2 leading-relaxed">{meta.purpose}</p>
      </div>

      {/* Pricing */}
      <div className="flex gap-2">
        <div className="flex-1 bg-slate-800/60 rounded-lg p-2.5 text-center">
          <div className="text-[9px] text-slate-500 uppercase">Giá</div>
          <div className={`text-[11px] font-semibold ${meta.accent}`}>{meta.pricing}</div>
        </div>
        <div className="flex-1 bg-slate-800/60 rounded-lg p-2.5 text-center">
          <div className="text-[9px] text-slate-500 uppercase">Context</div>
          <div className="text-[11px] font-semibold text-slate-300">{meta.contextWindow}</div>
        </div>
      </div>

      {/* Strengths */}
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wide mb-1.5">Ưu điểm</div>
        {meta.strengths.map(s => (
          <div key={s} className="flex items-start gap-1.5 mb-1">
            <span className="text-green-400 mt-0.5 shrink-0">✓</span>
            <span className="text-[11px] text-slate-300">{s}</span>
          </div>
        ))}
      </div>

      {/* Prompt library button */}
      <button
        onClick={() => setShowPromptModal(true)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-sky-900/40 hover:bg-sky-900/70 border border-sky-800/40 rounded-lg text-xs text-sky-300 transition-colors"
      >
        <BookOpen size={12} /> Chọn prompt từ thư viện BAIEdu
      </button>

      {/* Alternatives */}
      {altBlocks.length > 0 && (
        <div>
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5"><ArrowLeftRight size={11} /> Thay thế bằng AI khác ({altBlocks.length})</span>
            {showAlts ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
          {showAlts && (
            <div className="space-y-2 mt-1">
              {altBlocks.map(({ id, block, altMeta }) => (
                <div key={id} className="bg-slate-800/60 rounded-lg p-2.5 flex items-center gap-2">
                  <div className={`text-sm w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${altMeta?.color ?? 'bg-slate-700'}`}>
                    {altMeta?.icon ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-slate-200 truncate">{block!.label}</div>
                    <div className="text-[9px] text-slate-500 truncate">{altMeta?.pricing}</div>
                  </div>
                  <button
                    onClick={() => onSwapBlock(id)}
                    className="shrink-0 text-[10px] px-2 py-1 bg-slate-700 hover:bg-sky-700 rounded-md text-slate-300 hover:text-white transition-colors"
                  >
                    Dùng
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showPromptModal && (
        <PromptModal
          blockId={blockId}
          onSelect={p => {
            // The prompt will be applied by the parent via onSelect callback
            // We emit via custom event for simplicity
            window.dispatchEvent(new CustomEvent('baiprompt:select', { detail: p }));
          }}
          onClose={() => setShowPromptModal(false)}
        />
      )}
    </div>
  );
}

// ── Chat messages ──────────────────────────────────────────────────

interface ChatMsg { role: 'user' | 'bot'; text: string }

const INITIAL_MSGS: ChatMsg[] = [
  { role: 'bot', text: 'Xin chào! Mô tả pipeline bạn muốn tạo, hoặc thử: "thêm gmail trigger", "thêm lọc email", "thêm thông báo".' },
];

// ── Builder inner ──────────────────────────────────────────────────

interface BuilderInnerProps {
  pipeline: Pipeline;
  onSave: (nodes: PipelineNode[], edges: PipelineEdge[], name: string, policy: PipelinePolicy) => void;
  onPublish: () => void;
  onRun: () => void;
  onBack: () => void;
  isRunning: boolean;
}

function BuilderInner({ pipeline, onSave, onPublish, onRun, onBack, isRunning }: BuilderInnerProps) {
  const { screenToFlowPosition } = useReactFlow();

  const initNodes = useMemo<RFNode[]>(() =>
    pipeline.nodes.map(n => ({
      id: n.id, type: 'pipelineBlock',
      position: n.position,
      data: { blockId: n.blockId, config: n.config ?? {}, label: n.label ?? '' },
    })), [pipeline.id]
  );
  const initEdges = useMemo<RFEdge[]>(() =>
    pipeline.edges.map(e => ({
      id: e.id, source: e.source, target: e.target,
      sourceHandle: e.sourceHandle, targetHandle: e.targetHandle, label: e.label,
      ...DEFAULT_EDGE_OPTIONS,
    })), [pipeline.id]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  // Inspector state
  const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null);
  const [inspectorTab, setInspectorTab]        = useState<'basic' | 'advanced' | 'policy' | 'model'>('basic');
  const [pipelineName, setPipelineName]        = useState(pipeline.name);
  const [policy, setPolicy]                   = useState<PipelinePolicy>(pipeline.policy ?? DEFAULT_POLICY);

  // Block library state
  const [search, setSearch]                   = useState('');
  const [activeCategory, setActiveCategory]   = useState<string | null>(null);

  // Right panel tab
  const [rightTab, setRightTab]               = useState<'inspector' | 'chat'>('inspector');

  // Chat state
  const [chatMessages, setChatMessages]       = useState<ChatMsg[]>(INITIAL_MSGS);
  const [chatInput, setChatInput]             = useState('');
  const [isTyping, setIsTyping]               = useState(false);
  const chatEndRef                            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const selectedNode  = nodes.find(n => n.id === selectedNodeId);
  const selectedBlock = selectedNode ? BLOCK_REGISTRY[selectedNode.data.blockId as string] : null;

  // ── Helpers ─────────────────────────────────────────────────────

  const addBlockToCanvas = useCallback((blockId: string, labelOverride?: string, xBase = 160) => {
    const block = BLOCK_REGISTRY[blockId];
    if (!block) return;
    const y = 80 + (nodes.length % 5) * 110;
    const x = xBase + Math.floor(nodes.length / 5) * 220;
    setNodes(prev => [...prev, {
      id: `n-${Date.now()}`,
      type: 'pipelineBlock',
      position: { x, y },
      data: { blockId, config: { ...block.defaultConfig }, label: labelOverride || block.label },
    }]);
  }, [nodes.length, setNodes]);

  // ── Chat ────────────────────────────────────────────────────────

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const msg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const q = msg.toLowerCase();

      if (q.includes('gmail') || q.includes('email') || q.includes('mail')) {
        addBlockToCanvas('new-email');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã thêm block "Có mail mới" lên canvas! Kéo để di chuyển và click để cấu hình.' }]);
      } else if (q.includes('lọc') || q.includes('filter')) {
        addBlockToCanvas('email-filter');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã thêm block "Lọc nội dung email" vào canvas!' }]);
      } else if (q.includes('tóm tắt') || q.includes('phân tích') || q.includes('ai') || q.includes('understand')) {
        addBlockToCanvas('email-summarize');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã thêm block AI "Tóm tắt nội dung"! Block này dùng AI để phân tích email.' }]);
      } else if (q.includes('thông báo') || q.includes('notify') || q.includes('push')) {
        addBlockToCanvas('in-app-notify');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã thêm block thông báo vào canvas!' }]);
      } else if (q.includes('task') || q.includes('tạo task') || q.includes('công việc')) {
        addBlockToCanvas('create-task');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã thêm block "Tạo task" vào canvas!' }]);
      } else if (q.includes('quyết định') || q.includes('decide')) {
        addBlockToCanvas('priority-decision');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã thêm block "Phân loại ưu tiên" — block này đưa ra 1 trong 6 kết quả (IGNORE, NOTIFY, SUGGEST...)' }]);
      } else if (q.includes('calendar') || q.includes('lịch') || q.includes('meeting')) {
        addBlockToCanvas('new-event');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã thêm block theo dõi calendar!' }]);
      } else if (q.includes('xóa') || q.includes('clear') || q.includes('xoa hết')) {
        setNodes([]);
        setEdges([]);
        setSelectedNodeId(null);
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã xóa toàn bộ canvas. Bắt đầu lại từ đầu nhé!' }]);
      } else if (q.includes('đếm') || q.includes('bao nhiêu') || q.includes('mấy block')) {
        setChatMessages(prev => [...prev, { role: 'bot', text: `Canvas hiện có ${nodes.length} node và ${edges.length} kết nối.` }]);
      } else if (q.includes('lưu') || q.includes('save')) {
        const pNodes: PipelineNode[] = nodes.map(n => ({
          id: n.id, blockId: n.data.blockId as string, position: n.position,
          config: (n.data.config as Record<string,any>) ?? {}, label: (n.data.label as string) || undefined,
        }));
        const pEdges: PipelineEdge[] = edges.map(e => ({
          id: e.id, source: e.source, target: e.target,
          sourceHandle: e.sourceHandle ?? undefined, targetHandle: e.targetHandle ?? undefined,
          label: typeof e.label === 'string' ? e.label : undefined,
        }));
        onSave(pNodes, pEdges, pipelineName, policy);
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Đã lưu pipeline! Bạn có thể tiếp tục chỉnh sửa.' }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'bot',
          text: `Tôi chưa hiểu rõ yêu cầu này. Thử các lệnh: "thêm gmail trigger", "thêm lọc email", "thêm tóm tắt AI", "thêm thông báo", "thêm tạo task", "đếm block", "xóa canvas", "lưu".`,
        }]);
      }
    }, 800);
  }, [chatInput, isTyping, addBlockToCanvas, nodes, edges, onSave, pipelineName, policy]);

  // ── Drag & drop ──────────────────────────────────────────────────

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('application/blockId');
    if (!blockId) return;
    const block = BLOCK_REGISTRY[blockId];
    if (!block) return;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes(prev => [...prev, {
      id: `n-${Date.now()}`, type: 'pipelineBlock', position,
      data: { blockId, config: { ...block.defaultConfig }, label: block.label },
    }]);
  }, [screenToFlowPosition, setNodes]);

  const onConnect = useCallback((params: Connection) => {
    setEdges(prev => addEdge({ ...params, ...DEFAULT_EDGE_OPTIONS }, prev));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: RFNode) => {
    setSelectedNodeId(node.id);
    const block = BLOCK_REGISTRY[node.data.blockId as string];
    setInspectorTab(block?.category === 'ai-model' ? 'model' : 'basic');
    setRightTab('inspector');
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  // ── Swap block ────────────────────────────────────────────────────

  const onSwapBlock = useCallback((newBlockId: string) => {
    if (!selectedNodeId) return;
    const newBlock = BLOCK_REGISTRY[newBlockId];
    if (!newBlock) return;
    setNodes(prev => prev.map(n =>
      n.id === selectedNodeId
        ? { ...n, data: { ...n.data, blockId: newBlockId, config: { ...newBlock.defaultConfig }, label: newBlock.label } }
        : n
    ));
  }, [selectedNodeId, setNodes]);

  // ── Prompt selection event ────────────────────────────────────────

  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent).detail;
      if (!prompt || !selectedNodeId) return;
      setNodes(prev => prev.map(n =>
        n.id === selectedNodeId
          ? { ...n, data: { ...n.data, config: { ...(n.data.config as Record<string,any>), prompt: prompt.prompt } } }
          : n
      ));
    };
    window.addEventListener('baiprompt:select', handler);
    return () => window.removeEventListener('baiprompt:select', handler);
  }, [selectedNodeId, setNodes]);

  // ── Node config ──────────────────────────────────────────────────

  const updateNodeConfig = useCallback((key: string, value: any) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n =>
      n.id === selectedNodeId
        ? { ...n, data: { ...n.data, config: { ...(n.data.config as Record<string,any>), [key]: value } } }
        : n
    ));
  }, [selectedNodeId, setNodes]);

  const updateNodeLabel = useCallback((label: string) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n =>
      n.id === selectedNodeId ? { ...n, data: { ...n.data, label } } : n
    ));
  }, [selectedNodeId, setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
    setEdges(prev => prev.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  // ── Save ─────────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    const pNodes: PipelineNode[] = nodes.map(n => ({
      id: n.id, blockId: n.data.blockId as string, position: n.position,
      config: (n.data.config as Record<string,any>) ?? {}, label: (n.data.label as string) || undefined,
    }));
    const pEdges: PipelineEdge[] = edges.map(e => ({
      id: e.id, source: e.source, target: e.target,
      sourceHandle: e.sourceHandle ?? undefined, targetHandle: e.targetHandle ?? undefined,
      label: typeof e.label === 'string' ? e.label : undefined,
    }));
    onSave(pNodes, pEdges, pipelineName, policy);
  }, [nodes, edges, pipelineName, policy, onSave]);

  // ── Block library filter ─────────────────────────────────────────

  const filteredBlocks = useMemo(() => {
    const q = search.toLowerCase();
    return Object.values(BLOCK_REGISTRY).filter(b => {
      const matchCat  = !activeCategory || b.category === activeCategory;
      const matchText = !q || b.label.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [search, activeCategory]);

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden">

      {/* ── Left: Block Library ────────────────────────────────── */}
      <div className="w-56 flex flex-col border-r border-slate-700/60 bg-slate-900 shrink-0">
        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm block..."
              className="w-full bg-slate-800 border border-slate-700 rounded-md pl-6 pr-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="px-2 pb-2 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${!activeCategory ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            Tất cả
          </button>
          {BLOCK_CATEGORIES.map(cat => {
            const CatIcon = ((LucideIcons as Record<string,any>)[cat.icon] ?? LucideIcons.Box) as React.ElementType;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                title={cat.label}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${activeCategory === cat.id ? `${cat.bgColor} text-white` : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
              >
                <CatIcon size={10} />
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {filteredBlocks.map(block => {
            const Icon = ((LucideIcons as Record<string,any>)[block.icon] ?? LucideIcons.Box) as React.ElementType;
            return (
              <div
                key={block.id}
                draggable
                onDragStart={e => { e.dataTransfer.setData('application/blockId', block.id); e.dataTransfer.effectAllowed = 'copy'; }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-600 transition-all select-none"
              >
                <div className={`${block.color} rounded p-0.5 shrink-0`}>
                  <Icon size={11} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate leading-tight">{block.label}</div>
                  <div className="text-[9px] text-slate-500 truncate leading-tight">{block.description}</div>
                </div>
              </div>
            );
          })}
          {filteredBlocks.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6">Không tìm thấy</p>
          )}
        </div>
      </div>

      {/* ── Center: Canvas ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/60 bg-slate-900 shrink-0">
          <button onClick={onBack} title="Về trang chủ" className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors shrink-0">
            <ArrowLeft size={15} />
          </button>
          <input
            value={pipelineName}
            onChange={e => setPipelineName(e.target.value)}
            onBlur={handleSave}
            className="bg-transparent text-sm font-semibold text-slate-200 focus:outline-none border-b border-transparent focus:border-slate-500 px-0.5 min-w-0 w-44 truncate"
          />
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${pipeline.status === 'active' ? 'bg-green-900/50 text-green-400' : pipeline.status === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
            {pipeline.status === 'active' ? '● Hoạt động' : pipeline.status === 'draft' ? '○ Nháp' : pipeline.status}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={handleSave} title="Lưu (Ctrl+S)" className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-200 transition-colors">
              <Save size={12} /> Lưu
            </button>
            {pipeline.status === 'draft' && (
              <button onClick={() => { handleSave(); onPublish(); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-700 hover:bg-sky-600 rounded-lg text-xs text-white transition-colors">
                <Upload size={12} /> Xuất bản
              </button>
            )}
            <button
              onClick={() => { handleSave(); onRun(); }}
              disabled={isRunning}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 rounded-lg text-xs text-white transition-colors"
            >
              {isRunning
                ? <><Loader2 size={12} className="animate-spin" /> Chạy...</>
                : <><Play size={12} /> Chạy thử</>}
            </button>
          </div>
        </div>

        {/* ReactFlow canvas */}
        <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={onNodeClick} onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES}
            defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
            fitView fitViewOptions={{ padding: 0.25 }}
            className="bg-slate-950"
          >
            <Background color="#1e293b" gap={20} />
            <Controls />
            <MiniMap nodeColor="#334155" maskColor="rgba(15,23,42,0.7)" className="!bg-slate-800 !border-slate-700" />
          </ReactFlow>
        </div>

        <div className="px-3 py-1 border-t border-slate-700/60 bg-slate-900 flex items-center gap-3 text-[10px] text-slate-600 shrink-0">
          <span>Kéo block từ thư viện</span>
          <span>·</span><span>Kéo handle để kết nối</span>
          <span>·</span><span>Click node để cấu hình</span>
          <span className="ml-auto">{nodes.length} nodes · {edges.length} edges</span>
        </div>
      </div>

      {/* ── Right: Inspector + Chat ─────────────────────────────── */}
      <div className="w-72 flex flex-col border-l border-slate-700/60 bg-slate-900 shrink-0">

        {/* Tab bar */}
        <div className="flex border-b border-slate-700/60 shrink-0">
          <button
            onClick={() => setRightTab('inspector')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${rightTab === 'inspector' ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-800/40' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Settings2 size={13} /> Cấu hình
          </button>
          <button
            onClick={() => setRightTab('chat')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${rightTab === 'chat' ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-800/40' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Bot size={13} /> Trợ lý AI
          </button>
        </div>

        {/* ── Inspector tab ── */}
        {rightTab === 'inspector' && (
          selectedNode && selectedBlock ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-700/60 shrink-0">
                <div className={`${selectedBlock.color} rounded p-1 shrink-0`}>
                  {React.createElement(
                    ((LucideIcons as Record<string,any>)[selectedBlock.icon] ?? LucideIcons.Box) as React.ElementType,
                    { size: 12, className: 'text-white' }
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{selectedBlock.label}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{selectedBlock.category}</div>
                </div>
                <button onClick={deleteSelectedNode} className="p-1 rounded hover:bg-red-900/40 text-slate-500 hover:text-red-400 transition-colors" title="Xóa node">
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="flex border-b border-slate-700/60 shrink-0">
                {(selectedBlock?.category === 'ai-model'
                  ? ['model', 'basic', 'advanced', 'policy'] as const
                  : ['basic', 'advanced', 'policy'] as const
                ).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setInspectorTab(tab)}
                    className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${inspectorTab === tab ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab === 'basic' ? 'Cơ bản' : tab === 'advanced' ? 'Nâng cao' : tab === 'policy' ? 'Policy' : 'AI'}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {inspectorTab === 'basic' && (
                  <>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tên hiển thị</label>
                      <input
                        value={(selectedNode.data.label as string) || ''}
                        onChange={e => updateNodeLabel(e.target.value)}
                        placeholder={selectedBlock.label}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    {selectedBlock.basicFields.map(field => (
                      <div key={field.key}>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        <FieldInput field={field} value={(selectedNode.data.config as Record<string,any>)[field.key]} onChange={v => updateNodeConfig(field.key, v)} />
                        {field.helper && <p className="text-[10px] text-slate-500 mt-1">{field.helper}</p>}
                      </div>
                    ))}
                    {selectedBlock.basicFields.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">Không có cấu hình cơ bản</p>
                    )}
                  </>
                )}
                {inspectorTab === 'advanced' && (
                  <>
                    {selectedBlock.advancedFields.map(field => (
                      <div key={field.key}>
                        <label className="block text-[11px] text-slate-400 mb-1">{field.label}</label>
                        <FieldInput field={field} value={(selectedNode.data.config as Record<string,any>)[field.key]} onChange={v => updateNodeConfig(field.key, v)} />
                        {field.helper && <p className="text-[10px] text-slate-500 mt-1">{field.helper}</p>}
                      </div>
                    ))}
                    {selectedBlock.advancedFields.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">Không có cài đặt nâng cao</p>
                    )}
                  </>
                )}
                {inspectorTab === 'policy' && <PolicyEditor policy={policy} onChange={setPolicy} />}
                {inspectorTab === 'model' && (
                  <AIModelPanel
                    blockId={selectedNode.data.blockId as string}
                    onSwapBlock={onSwapBlock}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-3 py-2.5 border-b border-slate-700/60 shrink-0">
                <p className="text-xs font-semibold text-slate-200">Cài đặt Pipeline</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Click node để cấu hình từng bước</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <PolicyEditor policy={policy} onChange={setPolicy} />
                <button onClick={handleSave} className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-200 transition-colors">
                  <Save size={12} /> Lưu policy
                </button>
              </div>
            </div>
          )
        )}

        {/* ── Chat tab ── */}
        {rightTab === 'chat' && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-sky-900/60 text-sky-400'}`}>
                    {msg.role === 'user' ? <User size={11} /> : <Bot size={11} />}
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[82%] ${
                    msg.role === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-700/80 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-900/60 text-sky-400 flex items-center justify-center shrink-0">
                    <Bot size={11} />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-700/80 rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-slate-700/60 shrink-0">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Mô tả pipeline hoặc nhập lệnh..."
                  className="w-full pl-3 pr-9 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-sky-600 text-white rounded disabled:opacity-40 hover:bg-sky-500 transition-colors"
                >
                  <Send size={11} />
                </button>
              </form>
              <p className="text-[10px] text-slate-600 mt-1 text-center">
                "thêm gmail trigger" · "thêm thông báo" · "xóa canvas"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Public wrapper ─────────────────────────────────────────────────

interface PipelineBuilderProps {
  pipelineId: string;
  onBack: () => void;
}

export default function PipelineBuilder({ pipelineId, onBack }: PipelineBuilderProps) {
  const { pipelines, updatePipeline, publishPipeline, runPipeline, isRunning } = usePipeline();
  const pipeline = pipelines.find(p => p.id === pipelineId);
  if (!pipeline) return null;

  return (
    <ReactFlowProvider>
      <BuilderInner
        pipeline={pipeline}
        onSave={(nodes, edges, name, policy) => updatePipeline(pipelineId, { nodes, edges, name, policy })}
        onPublish={() => publishPipeline(pipelineId)}
        onRun={() => runPipeline(pipelineId)}
        onBack={onBack}
        isRunning={isRunning}
      />
    </ReactFlowProvider>
  );
}
