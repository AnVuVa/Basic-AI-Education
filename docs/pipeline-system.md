# Pipeline System

The Pipeline Lab is the core feature of BAIEdu. It is a visual workflow builder where users drag blocks onto a canvas, connect them, and run the pipeline.

---

## Block Registry (`src/data/pipeline/blockRegistry.ts`)

Every block type is defined in `BLOCK_REGISTRY: Record<string, BlockDef>`.

### BlockDef shape (from `src/types/pipeline.ts`):
```typescript
interface BlockDef {
  id: string;
  label: string;           // Display name (Vietnamese)
  description: string;     // Short description
  category: BlockCategory; // See categories below
  icon: string;            // Lucide icon name (string, looked up dynamically)
  color: string;           // Tailwind bg class for header
  basicFields: FieldDef[];
  advancedFields: FieldDef[];
  inputPorts: Port[];
  outputPorts: Port[];
  defaultConfig: Record<string, any>;
  runtimeMapping: RuntimeNodeType; // Maps to execution adapter
}
```

### Block Categories (in display order):
| Category ID | Label | Color | Description |
|-------------|-------|-------|-------------|
| `ai-model` | Mô hình AI | violet | AI model blocks (Gemini, GPT-4o, etc.) |
| `trigger` | Kích hoạt | blue | Event triggers (email, schedule, etc.) |
| `source` | Nguồn dữ liệu | cyan | Data sources |
| `filter` | Lọc | green | Filtering and routing |
| `understand` | Hiểu nội dung | purple | AI comprehension |
| `condition` | Điều kiện | amber | Conditional branching |
| `decide` | Quyết định | orange | Decision nodes |
| `approval` | Phê duyệt | yellow | Human-in-the-loop |
| `action` | Hành động | red | Execute actions |
| `notify` | Thông báo | pink | Send notifications |
| `state` | Lưu trạng thái | slate | State persistence |

### All Blocks (40+ total):

**Triggers:**
- `manual-run` — Chạy thủ công
- `new-email` — Có mail mới (Gmail)
- `new-message` — Tin nhắn Slack mới
- `new-meeting-invite` — Lời mời họp mới
- `scheduled` — Lịch hẹn (cron)

**Sources:**
- `read-email` — Đọc nội dung Gmail
- `list-tasks` — Danh sách tác vụ
- `read-calendar` — Lịch làm việc
- `search-web` — Tìm kiếm web

**Filters:**
- `email-filter` — Lọc email theo từ khóa
- `priority-filter` — Phân loại ưu tiên

**Understand (AI):**
- `email-summarize` — Tóm tắt email (AI)
- `extract-action-items` — Trích xuất action items
- `meeting-analyzer` — Phân tích cuộc họp

**Condition:**
- `if-condition` — Điều kiện If/Else
- `deadline-check` — Kiểm tra deadline

**Decide:**
- `priority-decision` — Phân loại ưu tiên (6 outcomes)
- `smart-scheduler` — Gợi ý lịch họp

**Approval:**
- `ask-user` — Hỏi người dùng
- `send-for-review` — Gửi để review

**Actions:**
- `create-task` — Tạo tác vụ
- `create-event` — Tạo lịch họp
- `send-email` — Gửi email
- `update-status` — Cập nhật trạng thái

**Notify:**
- `in-app-notify` — Thông báo in-app
- `send-notification` — Gửi thông báo

**State:**
- `save-result` — Lưu kết quả
- `update-memory` — Cập nhật memory

**AI Model blocks (11 total):**
- `gemini-flash` — Gemini 2.0 Flash (Google) — fast, multimodal
- `gemini-pro` — Gemini 1.5 Pro (Google) — 2M context
- `gpt-4o` — GPT-4o (OpenAI) — vision + code
- `gpt-4o-mini` — GPT-4o Mini (OpenAI) — cheap
- `claude-sonnet` — Claude 3.5 Sonnet (Anthropic)
- `perplexity-sonar` — Sonar Pro (Perplexity) — real-time web search
- `gamma-ai` — Gamma AI — slide generation
- `midjourney` — Midjourney v6 — image generation
- `canva-magic` — Canva Magic Studio — design
- `elevenlabs` — ElevenLabs — text-to-speech
- `whisper` — Whisper (OpenAI) — speech-to-text

---

## Pipeline Templates (`src/data/pipeline/pipelineTemplates.ts`)

11 pre-built templates, each with pre-positioned nodes and edges:

| ID | Name | Description |
|----|------|-------------|
| `tpl-gmail-monitor` | Gmail Thông Minh | Monitor emails → summarize → notify |
| `tpl-mail-to-task` | Email → Task | Extract action items from emails |
| `tpl-meeting-scheduler` | Lịch họp tự động | Handle meeting requests |
| `tpl-deadline-reminder` | Nhắc deadline | Monitor task deadlines |
| `tpl-project-sync` | Tổng hợp dự án | Aggregate project updates |
| `tpl-finance-report` | Báo cáo tài chính | Financial data pipeline |
| `tpl-marketing-content` | Marketing content | Content generation |
| `tpl-sales-crm` | CRM tự động | Sales data processing |
| `tpl-hr-onboarding` | Onboarding HR | HR workflow automation |
| `tpl-ops-monitor` | Giám sát hệ thống | Operations monitoring |
| `tpl-lichsu-slide` | Tạo slide bài giảng Lịch Sử VN | AI pipeline: Perplexity → Gemini → GPT-4o → Gamma + Midjourney |

---

## Pipeline Execution Engine (`src/lib/pipelineRuntime.ts`)

```
Input: Pipeline (nodes, edges, config)
Process:
  1. Build adjacency list from edges
  2. Topological sort (Kahn's algorithm)
  3. For each node in order:
     a. Collect outputs from predecessor nodes
     b. Look up demoAdapters[block.runtimeMapping]
     c. Await adapter(config, input)
     d. Store step result
  4. Collect all notifications and approval requests
Output: RunResult { steps[], notifications[], approvalRequests[] }
```

### RuntimeNodeType → Adapter mapping:
- `trigger` → mock event trigger
- `source` → mock data fetch
- `filter` → mock filtering
- `understand` → mock AI summary
- `condition` → mock if/else
- `decide` → mock decision (returns one of 6 DecisionOutcome values)
- `approval` → creates approval request, pauses
- `act` → mock action execution
- `notify` → creates notification
- `state` → mock state save

### DecisionOutcome (6 values):
```typescript
enum DecisionOutcome {
  IGNORE = 'IGNORE',
  NOTIFY = 'NOTIFY',
  SUGGEST = 'SUGGEST',
  WAIT_APPROVAL = 'WAIT_APPROVAL',
  AUTO_ACT = 'AUTO_ACT',
  REMIND_LATER = 'REMIND_LATER',
}
```

---

## Pipeline Data Model (`src/types/pipeline.ts`)

```typescript
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

interface PipelineNode {
  id: string;
  blockId: string;        // Key into BLOCK_REGISTRY
  position: { x, y };
  config: Record<string, any>;
  label?: string;
}

interface PipelinePolicy {
  approvalMode: 'notify_only' | 'ask_before_act' | 'auto_act' | 'draft_only';
  autoActAllowed: string[];  // Block IDs allowed to auto-act
  quietHoursStart: string;   // HH:MM
  quietHoursEnd: string;
  maxActionsPerDay: number;
  retryCount: number;
  retryDelayMinutes: number;
  dataScope: 'mine' | 'team' | 'all';
}
```

---

## PipelineBuilder Component Architecture

`PipelineBuilder.tsx` is the largest file (~850 lines). It uses `ReactFlowProvider` to enable `useReactFlow()`.

### Component structure inside PipelineBuilder:
```
<ReactFlowProvider>           (top-level export)
  <BuilderInner>              (main logic component)
    ┌─ Left panel (w-56)      Block library with search + category filter
    ├─ Center                 ReactFlow canvas + toolbar
    └─ Right panel (w-72)
        ├─ "Cấu hình" tab     Inspector: node config / pipeline policy
        │   ├─ basic tab      Basic fields
        │   ├─ advanced tab   Advanced fields
        │   ├─ policy tab     Pipeline policy editor
        │   └─ AI tab         AIModelPanel (only for ai-model blocks)
        └─ "Trợ lý AI" tab    Chat assistant
```

### Sub-components defined inside PipelineBuilder.tsx:
- `FieldInput` — renders any FieldDef (text/number/select/toggle/textarea/time)
- `PolicyEditor` — full pipeline policy configuration form
- `PromptModal` — modal for BAIEdu prompt library with comparison table
- `AIModelPanel` — AI block inspector: provider info, strengths, alternatives, swap

### Key callbacks:
- `onNodeClick` — selects node, switches to 'model' tab for AI blocks
- `onSwapBlock(newBlockId)` — replaces selected node's block type
- `onDrop` — drag block from library to canvas
- `handleSendMessage` — chat bot command processing
- `baiprompt:select` event listener — applies selected prompt to node config

---

## Storage (`src/lib/pipelineStorage.ts`)

All data persisted to `localStorage`:

| Key | Contents |
|-----|----------|
| `baiedu_pipelines` | Array of Pipeline objects |
| `baiedu_runs` | Array of PipelineRun objects |
| `baiedu_approvals` | Array of ApprovalRequest objects |
| `baiedu_notifications` | Array of NotificationItem objects |

On first visit (no stored data), demo data is seeded from `pipelineTemplates.ts`.
