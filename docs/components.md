# Component Reference

## Page Components

### `src/pages/Home.tsx`
Full-screen landing page. Contains:
- Animated hero section with call-to-action
- Embedded `LabLanding` component (frame gallery search)
- Quick links row (Courses, Library, Community, Dashboard)
- Navigation to `/lab` via `navigate('/lab', { state: { chatSeed, skipToBuilder } })`

**Key handlers:**
- `handleBuildFromScratch()` → `navigate('/lab', { state: { skipToBuilder: true } })`
- `handleFrameClick(frame)` → `navigate('/lab', { state: { chatSeed: frame.chatSeed } })`

---

### `src/pages/Lab.tsx`
Container for the entire Lab feature. Wraps everything in `<PipelineProvider>`.

**Views (internal state machine):**
- `'home'` → renders `<LabHome />`
- `'builder'` → renders `<PipelineBuilder pipelineId={id} />`
- `'logs'` → renders `<ExecutionLogs />`
- `'approvals'` → renders `<ApprovalCenter />`
- `'notifications'` → renders `<NotificationCenter />`

**Navigation state handling (on mount):**
- If `location.state.skipToBuilder` → creates empty pipeline, opens builder
- If `location.state.chatSeed` → scores templates against seed text, opens best match

---

### `src/pages/AIAccounts.tsx`
AI API management dashboard.
- Live-checks Gemini API key on mount
- Shows 6 AI provider cards (1 live, 5 mock)
- `checkGeminiStatus()` — `GET /v1beta/models?key=...` with 5s timeout
- "Kiểm tra lại" button re-runs the check

---

## Layout Components

### `src/components/Layout.tsx`
Minimal wrapper: `<Sidebar />` + `<Outlet />` (page content).

### `src/components/Sidebar.tsx`
Left 76px vertical navigation. Items:
- Logo (GraduationCap icon → `/`)
- "Tạo mới" button (purple) → `/lab` with `skipToBuilder: true`
- Trang chủ (`/`)
- Khóa học (`/courses`)
- Phòng Lab (`/lab`)
- AI Keys (`/ai-accounts`)
- Thư viện (`/library`)
- Cộng đồng (`/community`)
- Dashboard (`/dashboard`)
- Về chúng tôi (`/about`)
- Auth: shows user avatar + logout if logged in, else login button

### `src/components/AuthModal.tsx`
Login/register modal with `initialMode: 'login' | 'register'`.

---

## Lab Components

### `src/components/lab/LabHome.tsx`
Pipeline dashboard. Three sections:
1. **Stats row** — active pipelines, pending approvals, unread notifications, total
2. **Intent input** — search/describe pipeline, matches against templates
3. **Template grid** — 11 templates as cards + "Tạo từ đầu" card
4. **My pipelines** — list of user pipelines with actions (Run, Edit, Duplicate, Delete, Logs)
5. **Sidebar** — Recent activity (notifications + pending approvals)

**Template icon lookup:** `TEMPLATE_ICONS` record. If a template uses an icon not in this record, it falls back to `Sparkles`. Currently missing: `GraduationCap` (used by `tpl-lichsu-slide`) — falls back gracefully.

---

### `src/components/lab/PipelineBuilder.tsx`
The main canvas editor. **~850 lines.** See [pipeline-system.md](./pipeline-system.md) for full details.

**Props:**
```typescript
{ pipelineId: string; onBack: () => void }
```

**Three-panel layout:**
- Left (w-56): Block library (search + category filter + draggable block list)
- Center: ReactFlow canvas + top toolbar
- Right (w-72): Inspector + AI Chat (tabbed)

**Important implementation notes:**
- `NODE_TYPES` is defined at module scope (not inside component) to prevent ReactFlow re-registration
- `useReactFlow()` is only valid inside `<ReactFlowProvider>` — the outer export wraps with it
- `onSwapBlock` replaces a node's `blockId` and resets its config to the new block's defaults
- The 'model' tab in the inspector is only shown when `selectedBlock.category === 'ai-model'`

---

### `src/components/lab/PipelineBlockNode.tsx`
Custom ReactFlow node component.

**Props:** Standard `NodeProps<PBNode>` from `@xyflow/react`

**Features:**
- Colored header with block icon + label
- Status indicators (running/success/failed/waiting/skipped)
- Delete button: appears on hover or when selected (`group` + `group-hover:opacity-100` CSS pattern)
- Self-delete via `useReactFlow().setNodes` / `setEdges`
- Input handles (left side) + output handles (right side) from block definition
- Purple "AI Model" badge on `ai-model` category blocks

**Status border colors:**
- `running` → blue border + shadow
- `success` → green border
- `failed` → red border
- `waiting` → amber border
- `skipped` → slate border
- Selected → sky border + shadow

---

### `src/components/lab/ExecutionLogs.tsx`
View run history for a pipeline or all pipelines.
- Shows step-by-step execution results
- Timestamps, status, inputs/outputs per step

### `src/components/lab/ApprovalCenter.tsx`
List of pending approval requests. Allows approve/reject/snooze.

### `src/components/lab/NotificationCenter.tsx`
Inbox for pipeline notifications. Mark as read individually or all at once.

---

## Utility Components

### `src/components/LabLanding.tsx`
Embedded in the Home page. Two stages:
- `'landing'` — Hero with search input + quick suggestions + "Xây từ đầu" CTA
- `'gallery'` — Grid of frame cards with `WorkflowPreview` thumbnails + category filter

**Frame click** → calls `onEnterBuilder(frame.chatSeed)` → Home navigates to `/lab`.

### `src/components/WorkflowPreview.tsx`
Compact read-only SVG pipeline visualization. Used as thumbnail in LabLanding cards. Takes `nodes: PNode[]` and `edges: PEdge[]` with simple x/y/label/color data. Renders as a 380×160 SVG.

---

## Context Hooks

### `useAuth()` from `src/contexts/AuthContext.tsx`
```typescript
const { user, login, register, logout } = useAuth();
// user: User | null
// login(email, password): Promise<void> — throws on failure
// register(name, email, password): Promise<void>
// logout(): void
```
Pre-seeded test account: `admin@baiedu.vn` / `admin123`

### `usePipeline()` from `src/contexts/PipelineContext.tsx`
Only available inside `<PipelineProvider>` (which wraps `/lab`).
```typescript
const {
  pipelines,          // Pipeline[]
  runs,               // PipelineRun[]
  approvals,          // ApprovalRequest[]
  notifications,      // NotificationItem[]
  isRunning,          // boolean
  createPipeline,     // (template?: PipelineTemplate) => Pipeline
  updatePipeline,     // (id, Partial<Pipeline>) => void
  deletePipeline,     // (id) => void
  duplicatePipeline,  // (id) => void
  runPipeline,        // (id, trigger) => Promise<void>
  publishPipeline,    // (id) => void
  togglePipelineActive, // (id) => void
  approveAction,      // (id) => void
  rejectAction,       // (id) => void
  snoozeAction,       // (id) => void
  markNotificationRead,     // (id) => void
  markAllNotificationsRead, // () => void
  clearRuns,          // () => void
} = usePipeline();
```
