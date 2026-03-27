import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, useReactFlow, ReactFlowProvider,
  MarkerType,
  type Node as RFNode, type Edge as RFEdge, type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import * as LucideIcons from 'lucide-react';
import PipelineBlockNode from './PipelineBlockNode';
import { BLOCK_REGISTRY, BLOCK_CATEGORIES } from '../../data/pipeline/blockRegistry';
import { usePipeline } from '../../contexts/PipelineContext';
import type { Pipeline, PipelineNode, PipelineEdge, FieldDef, PipelinePolicy } from '../../types/pipeline';
import { DEFAULT_POLICY } from '../../types/pipeline';

// Stable node type map — defined outside component to prevent ReactFlow re-mounts
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
          <div
            onClick={() => onChange(!value)}
            className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-sky-600' : 'bg-slate-600'}`}
          >
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
        <label className="block text-[11px] text-slate-400 mb-1">Cho phép tự động hành động</label>
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => set('autoActAllowed', autoActOn ? [] : ['*'])}
            className={`w-8 h-4 rounded-full transition-colors relative ${autoActOn ? 'bg-sky-600' : 'bg-slate-600'}`}
          >
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
          <label className="block text-[11px] text-slate-400 mb-1">Delay retry (phút)</label>
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
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">Leo thang sau (giờ)</label>
        <input type="number" value={policy.escalationAfterHours} min={1} onChange={e => set('escalationAfterHours', Number(e.target.value))} className={cls} />
      </div>
    </div>
  );
}

// ── Builder inner (needs ReactFlowProvider context) ────────────────

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

  const initialRFNodes = useMemo<RFNode[]>(() =>
    pipeline.nodes.map(n => ({
      id: n.id, type: 'pipelineBlock',
      position: n.position,
      data: { blockId: n.blockId, config: n.config ?? {}, label: n.label ?? '' },
    })), [pipeline.id]  // only re-init when pipeline id changes
  );

  const initialRFEdges = useMemo<RFEdge[]>(() =>
    pipeline.edges.map(e => ({
      id: e.id, source: e.source, target: e.target,
      sourceHandle: e.sourceHandle, targetHandle: e.targetHandle,
      label: e.label,
      ...DEFAULT_EDGE_OPTIONS,
    })), [pipeline.id]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialRFNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialRFEdges);
  const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null);
  const [inspectorTab, setInspectorTab]        = useState<'basic' | 'advanced' | 'policy'>('basic');
  const [search, setSearch]                   = useState('');
  const [activeCategory, setActiveCategory]   = useState<string | null>(null);
  const [pipelineName, setPipelineName]       = useState(pipeline.name);
  const [policy, setPolicy]                   = useState<PipelinePolicy>(pipeline.policy ?? DEFAULT_POLICY);

  const selectedNode  = nodes.find(n => n.id === selectedNodeId);
  const selectedBlock = selectedNode ? BLOCK_REGISTRY[selectedNode.data.blockId as string] : null;

  // ── Drag & drop from library ────────────────────────────────────

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('application/blockId');
    if (!blockId) return;
    const block = BLOCK_REGISTRY[blockId];
    if (!block) return;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes(prev => [...prev, {
      id: `n-${Date.now()}`,
      type: 'pipelineBlock',
      position,
      data: { blockId, config: { ...block.defaultConfig }, label: block.label },
    }]);
  }, [screenToFlowPosition, setNodes]);

  // ── Connections ─────────────────────────────────────────────────

  const onConnect = useCallback((params: Connection) => {
    setEdges(prev => addEdge({ ...params, ...DEFAULT_EDGE_OPTIONS }, prev));
  }, [setEdges]);

  // ── Selection ───────────────────────────────────────────────────

  const onNodeClick = useCallback((_: React.MouseEvent, node: RFNode) => {
    setSelectedNodeId(node.id);
    setInspectorTab('basic');
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  // ── Config updates ──────────────────────────────────────────────

  const updateNodeConfig = useCallback((key: string, value: any) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n =>
      n.id === selectedNodeId
        ? { ...n, data: { ...n.data, config: { ...(n.data.config as Record<string, any>), [key]: value } } }
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

  // ── Save ────────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    const pNodes: PipelineNode[] = nodes.map(n => ({
      id: n.id,
      blockId: n.data.blockId as string,
      position: n.position,
      config: (n.data.config as Record<string, any>) ?? {},
      label: (n.data.label as string) || undefined,
    }));
    const pEdges: PipelineEdge[] = edges.map(e => ({
      id: e.id, source: e.source, target: e.target,
      sourceHandle: e.sourceHandle ?? undefined,
      targetHandle: e.targetHandle ?? undefined,
      label: typeof e.label === 'string' ? e.label : undefined,
    }));
    onSave(pNodes, pEdges, pipelineName, policy);
  }, [nodes, edges, pipelineName, policy, onSave]);

  // ── Filtered block library ──────────────────────────────────────

  const filteredBlocks = useMemo(() => {
    const q = search.toLowerCase();
    return Object.values(BLOCK_REGISTRY).filter(b => {
      const matchCat  = !activeCategory || b.category === activeCategory;
      const matchText = !q || b.label.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [search, activeCategory]);

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 overflow-hidden">

      {/* ── Left: Block Library ──────────────────────────────────── */}
      <div className="w-60 flex flex-col border-r border-slate-700/60 bg-slate-900 shrink-0">
        {/* Back + pipeline name */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-700/60">
          <button onClick={onBack} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
            <LucideIcons.ArrowLeft size={16} />
          </button>
          <span className="text-sm font-semibold truncate text-slate-200">{pipelineName}</span>
        </div>

        {/* Search */}
        <div className="px-3 pt-3">
          <div className="relative">
            <LucideIcons.Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm block..."
              className="w-full bg-slate-800 border border-slate-700 rounded-md pl-7 pr-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="px-3 pt-2 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${!activeCategory ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            Tất cả
          </button>
          {BLOCK_CATEGORIES.map(cat => {
            const CatIcon = ((LucideIcons as Record<string, any>)[cat.icon] ?? LucideIcons.Box) as React.ElementType;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                title={cat.label}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${activeCategory === cat.id ? `${cat.bgColor} text-white` : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
              >
                <CatIcon size={10} />
              </button>
            );
          })}
        </div>

        {/* Block list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {filteredBlocks.map(block => {
            const Icon = ((LucideIcons as Record<string, any>)[block.icon] ?? LucideIcons.Box) as React.ElementType;
            return (
              <div
                key={block.id}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('application/blockId', block.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-600 transition-all select-none"
              >
                <div className={`${block.color} rounded p-1 shrink-0`}>
                  <Icon size={11} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate">{block.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{block.description}</div>
                </div>
              </div>
            );
          })}
          {filteredBlocks.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6">Không tìm thấy block</p>
          )}
        </div>
      </div>

      {/* ── Center: Canvas ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/60 bg-slate-900 shrink-0">
          <input
            value={pipelineName}
            onChange={e => setPipelineName(e.target.value)}
            onBlur={handleSave}
            className="bg-transparent text-sm font-semibold text-slate-200 focus:outline-none border-b border-transparent focus:border-slate-500 px-1 min-w-0 w-48"
          />
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${pipeline.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
            {pipeline.status === 'active' ? 'Đang hoạt động' : pipeline.status === 'draft' ? 'Nháp' : pipeline.status}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-200 transition-colors"
            >
              <LucideIcons.Save size={13} /> Lưu
            </button>
            {pipeline.status === 'draft' && (
              <button
                onClick={() => { handleSave(); onPublish(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs text-white transition-colors"
              >
                <LucideIcons.Upload size={13} /> Xuất bản
              </button>
            )}
            <button
              onClick={() => { handleSave(); onRun(); }}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-xs text-white transition-colors"
            >
              {isRunning
                ? <><LucideIcons.Loader2 size={13} className="animate-spin" /> Đang chạy...</>
                : <><LucideIcons.Play size={13} /> Chạy thử</>
              }
            </button>
          </div>
        </div>

        {/* ReactFlow canvas */}
        <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES}
            defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            className="bg-slate-950"
          >
            <Background color="#1e293b" gap={20} />
            <Controls />
            <MiniMap nodeColor="#334155" maskColor="rgba(15,23,42,0.7)" className="!bg-slate-800 !border-slate-700" />
          </ReactFlow>
        </div>

        {/* Hint bar */}
        <div className="px-4 py-1.5 border-t border-slate-700/60 bg-slate-900 flex items-center gap-3 text-[10px] text-slate-500 shrink-0">
          <span>Kéo block từ thư viện vào canvas</span>
          <span>•</span><span>Kéo từ handle để kết nối</span>
          <span>•</span><span>Click node để chỉnh config</span>
          <span className="ml-auto">{nodes.length} nodes · {edges.length} kết nối</span>
        </div>
      </div>

      {/* ── Right: Inspector ────────────────────────────────────── */}
      <div className="w-72 flex flex-col border-l border-slate-700/60 bg-slate-900 shrink-0">
        {selectedNode && selectedBlock ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-700/60">
              <div className={`${selectedBlock.color} rounded p-1 shrink-0`}>
                {React.createElement(
                  ((LucideIcons as Record<string, any>)[selectedBlock.icon] ?? LucideIcons.Box) as React.ElementType,
                  { size: 13, className: 'text-white' }
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">{selectedBlock.label}</div>
                <div className="text-[10px] text-slate-500 capitalize">{selectedBlock.category}</div>
              </div>
              <button
                onClick={deleteSelectedNode}
                className="p-1 rounded hover:bg-red-900/40 text-slate-500 hover:text-red-400 transition-colors"
                title="Xóa node"
              >
                <LucideIcons.Trash2 size={13} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700/60 shrink-0">
              {(['basic', 'advanced', 'policy'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setInspectorTab(tab)}
                  className={`flex-1 py-2 text-[11px] font-medium transition-colors ${inspectorTab === tab ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab === 'basic' ? 'Cơ bản' : tab === 'advanced' ? 'Nâng cao' : 'Policy'}
                </button>
              ))}
            </div>

            {/* Tab content */}
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
                      <FieldInput
                        field={field}
                        value={(selectedNode.data.config as Record<string, any>)[field.key]}
                        onChange={v => updateNodeConfig(field.key, v)}
                      />
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
                      <FieldInput
                        field={field}
                        value={(selectedNode.data.config as Record<string, any>)[field.key]}
                        onChange={v => updateNodeConfig(field.key, v)}
                      />
                      {field.helper && <p className="text-[10px] text-slate-500 mt-1">{field.helper}</p>}
                    </div>
                  ))}
                  {selectedBlock.advancedFields.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">Không có cài đặt nâng cao</p>
                  )}
                </>
              )}

              {inspectorTab === 'policy' && (
                <PolicyEditor policy={policy} onChange={setPolicy} />
              )}
            </div>
          </>
        ) : (
          /* No node selected: show pipeline policy */
          <div className="flex flex-col h-full">
            <div className="px-3 py-3 border-b border-slate-700/60 shrink-0">
              <h3 className="text-xs font-semibold text-slate-200">Cài đặt Pipeline</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Click node để chỉnh cấu hình</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <PolicyEditor policy={policy} onChange={setPolicy} />
              <button
                onClick={handleSave}
                className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-200 transition-colors"
              >
                <LucideIcons.Save size={12} /> Lưu policy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Public component (wraps with ReactFlowProvider) ────────────────

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
        onSave={(nodes, edges, name, policy) =>
          updatePipeline(pipelineId, { nodes, edges, name, policy })
        }
        onPublish={() => publishPipeline(pipelineId)}
        onRun={() => runPipeline(pipelineId)}
        onBack={onBack}
        isRunning={isRunning}
      />
    </ReactFlowProvider>
  );
}
