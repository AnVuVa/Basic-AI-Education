// ── Block System ──────────────────────────────────────────────────

export type BlockCategory =
  | 'trigger' | 'source' | 'filter' | 'understand'
  | 'condition' | 'decide' | 'approval' | 'action'
  | 'notify' | 'state' | 'ai-model';

export type RuntimeNodeType =
  | 'watch' | 'source' | 'filter' | 'understand'
  | 'condition' | 'decide' | 'wait' | 'act' | 'notify' | 'state';

export type FieldType = 'text' | 'select' | 'number' | 'toggle' | 'multiselect' | 'textarea' | 'time';

export interface FieldOption { label: string; value: string }

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  default?: any;
  placeholder?: string;
  helper?: string;
  required?: boolean;
}

export interface PortDef { id: string; label: string; type: 'data' | 'control' }

export interface BlockDef {
  id: string;
  label: string;
  category: BlockCategory;
  description: string;
  icon: string;           // Lucide icon name
  color: string;          // Tailwind bg class for node header
  basicFields: FieldDef[];
  advancedFields: FieldDef[];
  inputPorts: PortDef[];
  outputPorts: PortDef[];
  runtimeMapping: RuntimeNodeType;
  defaultConfig: Record<string, any>;
}

// ── Decision Outcomes (6 canonical) ──────────────────────────────

export type DecisionOutcome =
  | 'IGNORE' | 'NOTIFY' | 'SUGGEST'
  | 'WAIT_APPROVAL' | 'AUTO_ACT' | 'REMIND_LATER';

export const DECISION_OUTCOME_META: Record<DecisionOutcome, { label: string; color: string; icon: string }> = {
  IGNORE:         { label: 'Bỏ qua',       color: 'text-slate-400',  icon: 'EyeOff'       },
  NOTIFY:         { label: 'Thông báo',     color: 'text-blue-400',   icon: 'Bell'         },
  SUGGEST:        { label: 'Gợi ý',         color: 'text-purple-400', icon: 'Lightbulb'    },
  WAIT_APPROVAL:  { label: 'Chờ duyệt',     color: 'text-amber-400',  icon: 'Clock'        },
  AUTO_ACT:       { label: 'Tự động làm',   color: 'text-green-400',  icon: 'Zap'          },
  REMIND_LATER:   { label: 'Nhắc lại sau',  color: 'text-orange-400', icon: 'AlarmClock'   },
};

// ── Pipeline ──────────────────────────────────────────────────────

export type PipelineStatus = 'draft' | 'active' | 'disabled' | 'error';

export interface PipelineNode {
  id: string;
  blockId: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  label?: string;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface PipelinePolicy {
  approvalMode: 'draft_only' | 'notify_only' | 'ask_before_act' | 'auto_act';
  autoActAllowed: string[];     // blockIds
  quietHoursStart: string;      // "22:00"
  quietHoursEnd: string;        // "07:00"
  retryCount: number;
  retryDelayMinutes: number;
  escalationAfterHours: number;
  reminderCadenceHours: number;
  dataScope: 'all' | 'mine' | 'team';
}

export const DEFAULT_POLICY: PipelinePolicy = {
  approvalMode: 'ask_before_act',
  autoActAllowed: [],
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  retryCount: 2,
  retryDelayMinutes: 5,
  escalationAfterHours: 24,
  reminderCadenceHours: 4,
  dataScope: 'mine',
};

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: PipelineStatus;
  templateId?: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  policy: PipelinePolicy;
  connectors: string[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
  lastRunAt?: number;
  lastRunStatus?: RunStatus;
  todayTriggerCount: number;
  pendingApprovalCount: number;
}

// ── Execution ─────────────────────────────────────────────────────

export type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'waiting';

export interface RunStep {
  nodeId: string;
  blockId: string;
  blockLabel: string;
  startedAt: number;
  finishedAt?: number;
  status: StepStatus;
  output?: Record<string, any>;
  logs: string[];
}

export type RunStatus = 'running' | 'success' | 'failed' | 'pending_approval' | 'cancelled';

export interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName: string;
  startedAt: number;
  finishedAt?: number;
  status: RunStatus;
  triggerSource: string;
  steps: RunStep[];
  outcome?: DecisionOutcome;
  error?: string;
  approvalId?: string;
  notificationCount: number;
}

// ── Approval ──────────────────────────────────────────────────────

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'snoozed' | 'expired';

export interface ApprovalRequest {
  id: string;
  pipelineId: string;
  pipelineName: string;
  runId: string;
  reason: string;
  context: Record<string, any>;
  proposedAction: string;
  proposedData?: Record<string, any>;
  status: ApprovalStatus;
  createdAt: number;
  expiresAt?: number;
  decidedAt?: number;
}

// ── Notification ──────────────────────────────────────────────────

export type NotificationType = 'info' | 'warning' | 'action' | 'digest' | 'reminder' | 'escalation';

export interface NotificationItem {
  id: string;
  pipelineId: string;
  pipelineName: string;
  runId?: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
}

// ── Template ──────────────────────────────────────────────────────

export interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  connectors: string[];
  useCase: string;
  canDemoRun: boolean;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  policy: Partial<PipelinePolicy>;
}

// ── Context Value ─────────────────────────────────────────────────

export interface PipelineContextValue {
  pipelines: Pipeline[];
  runs: PipelineRun[];
  approvals: ApprovalRequest[];
  notifications: NotificationItem[];
  isRunning: boolean;

  createPipeline: (template?: PipelineTemplate) => Pipeline;
  updatePipeline: (id: string, partial: Partial<Pipeline>) => void;
  deletePipeline: (id: string) => void;
  duplicatePipeline: (id: string) => Pipeline;
  publishPipeline: (id: string) => void;
  togglePipelineActive: (id: string) => void;
  runPipeline: (id: string, triggerSource?: string) => Promise<void>;
  approveAction: (approvalId: string) => void;
  rejectAction: (approvalId: string) => void;
  snoozeAction: (approvalId: string, hours?: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearRuns: (pipelineId: string) => void;
}
