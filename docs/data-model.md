# Data Model & Types

## TypeScript Types (`src/types/`)

### `src/types/auth.ts`

```typescript
type Role = 'admin' | 'moderator' | 'business-org' | 'student' | 'regular';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  joinedAt: number;  // Unix timestamp
}
```

---

### `src/types/pipeline.ts` (key types)

```typescript
// ── Block definition ────────────────────────────────────────────────

type BlockCategory =
  | 'trigger' | 'source' | 'filter' | 'understand'
  | 'condition' | 'decide' | 'approval' | 'action'
  | 'notify' | 'state' | 'ai-model';

type RuntimeNodeType =
  | 'trigger' | 'source' | 'filter' | 'understand'
  | 'condition' | 'decide' | 'approval' | 'act' | 'notify' | 'state';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle' | 'textarea' | 'time';
  required?: boolean;
  default?: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helper?: string;   // Hint text shown below field
}

interface Port {
  id: string;
  label: string;
}

interface BlockDef {
  id: string;
  label: string;
  description: string;
  category: BlockCategory;
  icon: string;           // Lucide icon name (string)
  color: string;          // Tailwind class e.g. 'bg-blue-600'
  basicFields: FieldDef[];
  advancedFields: FieldDef[];
  inputPorts: Port[];
  outputPorts: Port[];
  defaultConfig: Record<string, any>;
  runtimeMapping: RuntimeNodeType;
}

// ── Pipeline ─────────────────────────────────────────────────────────

type RunStatus = 'success' | 'failed' | 'running' | 'pending_approval' | 'cancelled';

interface PipelineNode {
  id: string;
  blockId: string;         // Key into BLOCK_REGISTRY
  position: { x: number; y: number };
  config: Record<string, any>;
  label?: string;          // Override display label
}

interface PipelineEdge {
  id: string;
  source: string;          // Node ID
  target: string;          // Node ID
  sourceHandle?: string;   // Port ID
  targetHandle?: string;
  label?: string;
}

interface PipelinePolicy {
  approvalMode: 'notify_only' | 'ask_before_act' | 'auto_act' | 'draft_only';
  autoActAllowed: string[];    // Block IDs or ['*'] for all
  quietHoursStart: string;     // 'HH:MM'
  quietHoursEnd: string;
  maxActionsPerDay: number;
  retryCount: number;          // 0-5
  retryDelayMinutes: number;
  dataScope: 'mine' | 'team' | 'all';
}

const DEFAULT_POLICY: PipelinePolicy = {
  approvalMode: 'ask_before_act',
  autoActAllowed: [],
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  maxActionsPerDay: 50,
  retryCount: 2,
  retryDelayMinutes: 5,
  dataScope: 'mine',
};

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'disabled' | 'draft' | 'error';
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  policy: PipelinePolicy;
  tags: string[];
  lastRunAt?: number;
  lastRunStatus?: RunStatus;
  todayTriggerCount: number;
  pendingApprovalCount: number;
  createdAt: number;
  updatedAt: number;
}

// ── Execution ────────────────────────────────────────────────────────

type StepStatus = 'running' | 'success' | 'failed' | 'waiting' | 'skipped';

interface RunStep {
  nodeId: string;
  blockId: string;
  status: StepStatus;
  startedAt: number;
  finishedAt?: number;
  input?: any;
  output?: any;
  error?: string;
}

interface PipelineRun {
  id: string;
  pipelineId: string;
  triggeredBy: 'manual' | 'schedule' | 'event';
  status: RunStatus;
  steps: RunStep[];
  startedAt: number;
  finishedAt?: number;
}

// ── Approval & Notifications ─────────────────────────────────────────

interface ApprovalRequest {
  id: string;
  pipelineId: string;
  pipelineName: string;
  nodeId: string;
  status: 'pending' | 'approved' | 'rejected' | 'snoozed';
  proposedAction: string;  // Human-readable description
  context: string;         // Why this action is proposed
  createdAt: number;
  resolvedAt?: number;
}

interface NotificationItem {
  id: string;
  pipelineId: string;
  pipelineName: string;
  title: string;
  body: string;
  level: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: number;
  actionLabel?: string;
  actionUrl?: string;
}

// ── Template ─────────────────────────────────────────────────────────

interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  useCase: string;
  category: string;
  icon: string;            // Lucide icon name
  color: string;           // Tailwind gradient class
  connectors: string[];    // Service names shown on card
  nodes: PipelineNode[];   // Pre-defined node positions
  edges: PipelineEdge[];   // Pre-connected edges
  defaultPolicy?: Partial<PipelinePolicy>;
  tags: string[];
}
```

---

## Data Files

### `src/data/frames.ts`
```typescript
interface WorkflowFrame {
  id: string;
  title: string;
  description: string;
  category: string;        // 'Nghiên cứu' | 'Thuyết trình' | 'Viết lách' | ...
  tools: string[];         // Service names
  tags: string[];
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  gradient: string;
  icon: React.ReactNode;
  chatSeed: string;        // Pre-fill text for the AI chat / intent matching
  preview: {
    nodes: PNode[];
    edges: PEdge[];
  };
}
```

8 frames defined: Thuyết trình Lịch sử, Phân tích tài liệu, Brainstorm sáng tạo, Viết tiểu luận, Debug & giải thích code, Ôn thi Pomodoro, Nghiên cứu chuyên sâu, Nội dung đa phương tiện.

### `src/data/pipeline/aiProviders.ts`
Two exports:
- `AI_PROVIDER_META: Record<string, AIProviderMeta>` — metadata for AI blocks
- `AI_ACCOUNTS_MOCK: AIAccount[]` — mock account data for AIAccounts page

### `src/data/pipeline/promptLibrary.ts`
Two exports:
- `BAI_PROMPT_LIBRARY: BAIPrompt[]` — 9 prompts
- `getPromptsForBlock(blockId): BAIPrompt[]` — filtered by `compatibleBlocks`

---

## localStorage Schema

All keys prefixed with `baiedu_`:

```
baiedu_user           → User | null (JSON)
baiedu_pipelines      → Pipeline[] (JSON)
baiedu_runs           → PipelineRun[] (JSON)
baiedu_approvals      → ApprovalRequest[] (JSON)
baiedu_notifications  → NotificationItem[] (JSON)
```

Seeded on first visit by `pipelineStorage.ts` with demo pipeline data.
