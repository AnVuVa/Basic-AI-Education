import React from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import { BLOCK_REGISTRY } from '../../data/pipeline/blockRegistry';

export interface PipelineBlockNodeData extends Record<string, unknown> {
  blockId: string;
  config: Record<string, any>;
  label?: string;
  stepStatus?: 'running' | 'success' | 'failed' | 'waiting' | 'skipped';
}

export type PBNode = Node<PipelineBlockNodeData, 'pipelineBlock'>;

const STATUS_BORDER: Record<string, string> = {
  running: 'border-blue-400 shadow-blue-500/30 shadow-md',
  success: 'border-green-400',
  failed:  'border-red-400',
  waiting: 'border-amber-400',
  skipped: 'border-slate-600',
};

export default function PipelineBlockNode({ data, selected }: NodeProps<PBNode>) {
  const block = BLOCK_REGISTRY[data.blockId];
  if (!block) {
    return (
      <div className="bg-slate-800 border border-red-500 rounded-lg px-3 py-2 text-xs text-red-400 w-40">
        Block not found: {data.blockId}
      </div>
    );
  }

  const Icon = ((LucideIcons as Record<string, any>)[block.icon] ?? LucideIcons.Box) as React.ElementType;

  const borderClass = selected
    ? 'border-sky-400 shadow-sky-400/30 shadow-md'
    : data.stepStatus
    ? (STATUS_BORDER[data.stepStatus] ?? 'border-slate-700')
    : 'border-slate-700';

  return (
    <div className={`bg-slate-800 border rounded-xl overflow-hidden w-44 transition-all ${borderClass}`}>
      {/* Input handles */}
      {block.inputPorts.map((port, i) => (
        <Handle
          key={port.id}
          type="target"
          position={Position.Left}
          id={port.id}
          style={{
            top: `${((i + 1) / (block.inputPorts.length + 1)) * 100}%`,
            background: '#64748b', border: '1.5px solid #94a3b8',
            width: 10, height: 10,
          }}
        />
      ))}

      {/* Header */}
      <div className={`${block.color} px-3 py-2 flex items-center gap-2`}>
        <Icon size={13} className="text-white shrink-0" />
        <span className="text-xs font-semibold text-white truncate leading-tight">
          {(data.label as string | undefined) || block.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 min-h-[36px]">
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{block.description}</p>
        {data.stepStatus === 'running' && (
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-blue-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            Đang chạy...
          </div>
        )}
        {data.stepStatus === 'success' && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-green-400">
            <LucideIcons.CheckCircle2 size={10} /> Hoàn thành
          </div>
        )}
        {data.stepStatus === 'failed' && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-red-400">
            <LucideIcons.XCircle size={10} /> Lỗi
          </div>
        )}
        {data.stepStatus === 'waiting' && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-400">
            <LucideIcons.Clock size={10} /> Chờ duyệt
          </div>
        )}
      </div>

      {/* Output handles */}
      {block.outputPorts.map((port, i) => (
        <Handle
          key={port.id}
          type="source"
          position={Position.Right}
          id={port.id}
          style={{
            top: `${((i + 1) / (block.outputPorts.length + 1)) * 100}%`,
            background: '#64748b', border: '1.5px solid #94a3b8',
            width: 10, height: 10,
          }}
        />
      ))}
    </div>
  );
}
