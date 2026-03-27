import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, useReactFlow, ReactFlowProvider,
  MarkerType,
  type Node as RFNode, type Edge as RFEdge, type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft, Search, Save, Play, Upload, Loader2, Trash2, Bot, User,
  Send, Settings2,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PipelineBlockNode from './PipelineBlockNode';
import { BLOCK_REGISTRY, BLOCK_CATEGORIES } from '../../data/pipeline/blockRegistry';
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
  const [inspectorTab, setInspectorTab]        = useState<'basic' | 'advanced' | 'policy'>('basic');
  const [pipelineName, setPipelineName]        = useState(pipeline.name);
  const [policy, setPolicy]                   = useState<PipelinePolicy>(pipeline.policy ?? DEFAULT_POLICY);

  // Block library state
  const [search, setSearch]                   = useState('');
  const [activeCategory, setActiveCategory]   = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(BLOCK_CATEGORIES.map(c => c.id)));

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
        // addBlockToCanvas('new-email');
        setChatMessages(prev => [...prev, { role: 'bot', text: 'Tất nhiên rồi, đây là 1 pipeline mẫu để đặt lịch từ email! Kéo để di chuyển và click để cấu hình.' }]);
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
    setInspectorTab('basic');
    setRightTab('inspector');
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

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

  const filteredBlocksByCategory = useMemo(() => {
    const q = search.toLowerCase();
    const grouped: Record<string, typeof BLOCK_REGISTRY[string][]> = {};
    
    BLOCK_CATEGORIES.forEach(cat => {
      grouped[cat.id] = [];
    });

    Object.values(BLOCK_REGISTRY).forEach(block => {
      const matchText = !q || block.label.toLowerCase().includes(q) || block.description.toLowerCase().includes(q);
      if (matchText) {
        if (!grouped[block.category]) {
          grouped[block.category] = [];
        }
        grouped[block.category].push(block);
      }
    });

    return grouped;
  }, [search]);

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

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          {BLOCK_CATEGORIES.map(cat => {
            const blocks = filteredBlocksByCategory[cat.id] || [];
            const isExpanded = expandedCategories.has(cat.id);
            const CatIcon = ((LucideIcons as Record<string,any>)[cat.icon] ?? LucideIcons.Box) as React.ElementType;
            
            if (blocks.length === 0) return null;

            return (
              <div key={cat.id} className="border border-slate-700/60 rounded-lg overflow-hidden bg-slate-800/50">
                <button
                  onClick={() => {
                    const newExpanded = new Set(expandedCategories);
                    if (isExpanded) {
                      newExpanded.delete(cat.id);
                    } else {
                      newExpanded.add(cat.id);
                    }
                    setExpandedCategories(newExpanded);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 transition-colors ${cat.bgColor} hover:opacity-90`}
                  title={cat.label}
                >
                  <CatIcon size={12} className="text-white shrink-0" />
                  <span className="text-[11px] font-semibold text-white flex-1 text-left">{cat.label}</span>
                  <span className="text-[9px] text-white/60">{blocks.length}</span>
                  <span className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {isExpanded && (
                  <div className="p-1.5 space-y-1 bg-slate-900/50">
                    {blocks.map(block => {
                      const Icon = ((LucideIcons as Record<string,any>)[block.icon] ?? LucideIcons.Box) as React.ElementType;
                      return (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={e => { e.dataTransfer.setData('application/blockId', block.id); e.dataTransfer.effectAllowed = 'copy'; }}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-600 transition-all select-none"
                        >
                          <div className={`${block.color} rounded p-0.5 shrink-0`}>
                            <Icon size={10} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-200 truncate leading-tight">{block.label}</div>
                            <div className="text-[8px] text-slate-500 truncate leading-tight">{block.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
                {(['basic', 'advanced', 'policy'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setInspectorTab(tab)}
                    className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${inspectorTab === tab ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab === 'basic' ? 'Cơ bản' : tab === 'advanced' ? 'Nâng cao' : 'Policy'}
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
