# Architecture

## Directory Structure

```
Basic-AI-Education/
├── src/
│   ├── main.tsx                  # React entry point (StrictMode)
│   ├── App.tsx                   # Router setup + AuthProvider
│   ├── index.css                 # Global styles, Tailwind v4 imports, @theme vars
│   │
│   ├── pages/                    # Route-level components (1 per URL)
│   │   ├── Home.tsx              # Landing page — workflow frames gallery
│   │   ├── About.tsx             # About page
│   │   ├── Courses.tsx           # Course listing
│   │   ├── CourseDetail.tsx      # Individual course
│   │   ├── LMS.tsx               # Full-screen learning viewer
│   │   ├── Dashboard.tsx         # User dashboard
│   │   ├── Library.tsx           # Prompt/resource library
│   │   ├── Community.tsx         # Community / social
│   │   ├── Lab.tsx               # Pipeline Lab (wraps PipelineProvider)
│   │   └── AIAccounts.tsx        # AI API key management
│   │
│   ├── components/               # Shared / layout components
│   │   ├── Layout.tsx            # Sidebar + <Outlet> wrapper
│   │   ├── Sidebar.tsx           # Left vertical nav (76px wide)
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── AuthModal.tsx         # Login / register dialog
│   │   ├── LabLanding.tsx        # Landing screen embedded in Home
│   │   ├── WorkflowPreview.tsx   # Tiny read-only pipeline canvas (SVG)
│   │   └── lab/                  # Lab-specific components
│   │       ├── LabHome.tsx           # Lab dashboard (pipeline list + templates)
│   │       ├── PipelineBuilder.tsx   # Main visual editor (XYFlow canvas)
│   │       ├── PipelineBlockNode.tsx # Custom XYFlow node component
│   │       ├── ApprovalCenter.tsx    # Approval request management
│   │       ├── NotificationCenter.tsx# Notification inbox
│   │       └── ExecutionLogs.tsx     # Pipeline run logs viewer
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx       # useAuth hook — user, login, logout
│   │   └── PipelineContext.tsx   # usePipeline hook — all pipeline state + actions
│   │
│   ├── types/
│   │   ├── auth.ts               # User, Role types
│   │   └── pipeline.ts           # All pipeline-related TypeScript types
│   │
│   ├── data/
│   │   ├── frames.ts             # 8 workflow frame definitions for Home gallery
│   │   ├── prompts.ts            # Prompt library data
│   │   └── pipeline/
│   │       ├── blockRegistry.ts      # All 40+ block definitions (BLOCK_REGISTRY)
│   │       ├── pipelineTemplates.ts  # 11 pre-built template pipelines
│   │       ├── demoAdapters.ts       # Mock execution functions per block
│   │       ├── aiProviders.ts        # AI model metadata + API account mocks
│   │       └── promptLibrary.ts      # BAIEdu prompt library for AI blocks
│   │
│   └── lib/
│       ├── pipelineRuntime.ts    # Pipeline execution engine (topological sort)
│       ├── pipelineStorage.ts    # localStorage read/write abstraction
│       └── utils.ts              # cn() utility (clsx + tailwind-merge)
│
├── docs/                         # THIS FOLDER — project documentation
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite + Tailwind + env config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies + scripts
├── .env.local                    # Local secrets (GEMINI_API_KEY) — not committed
└── metadata.json                 # AI Studio metadata
```

---

## Routing

Defined in `src/App.tsx`:

```
/                     Home           (no Layout — full-screen)
/about                About          (inside Layout)
/courses              Courses        (inside Layout)
/courses/:id          CourseDetail   (inside Layout)
/dashboard            Dashboard      (inside Layout)
/library              Library        (inside Layout)
/community            Community      (inside Layout)
/lab                  Lab            (inside Layout — has its own PipelineProvider)
/ai-accounts          AIAccounts     (inside Layout)
/learn/:id            LMS            (no Layout — full-screen)
```

`Layout` renders `Sidebar` on the left + `<Outlet>` for the page content.

---

## State Management

### AuthContext (`src/contexts/AuthContext.tsx`)
- Stores current user in `localStorage` key `baiedu_user`
- Exposes: `user`, `login(email, password)`, `register(...)`, `logout()`
- Pre-seeded admin: `admin@baiedu.vn` / `admin123`
- Roles: `admin | moderator | business-org | student | regular`

### PipelineContext (`src/contexts/PipelineContext.tsx`)
- Wraps only the `/lab` route (not global)
- localStorage keys: `baiedu_pipelines`, `baiedu_runs`, `baiedu_approvals`, `baiedu_notifications`
- Exposes:
  - `pipelines` — array of all user pipelines
  - `runs` — execution history
  - `approvals` — pending approval requests
  - `notifications` — notification inbox
  - `createPipeline(template?)` — create new or from template
  - `updatePipeline(id, data)` — save changes
  - `deletePipeline(id)` / `duplicatePipeline(id)`
  - `runPipeline(id, trigger)` — execute via runtime engine
  - `approveAction(id)` / `rejectAction(id)` / `snoozeAction(id)`
  - `isRunning` — boolean for loading state

---

## Navigation State Pattern

The Home page and Sidebar pass navigation intent via React Router `state`:

```tsx
// From Sidebar "Tạo mới" button:
navigate('/lab', { state: { skipToBuilder: true } })

// From Home page frame click:
navigate('/lab', { state: { chatSeed: frame.chatSeed } })
```

`Lab.tsx` reads this in a `useEffect` on mount, finds the best-matching template via word overlap scoring, creates a pipeline from it, and opens the builder directly.

---

## Data Flow: Pipeline Execution

```
User clicks "Chạy thử"
    ↓
PipelineContext.runPipeline(id, 'manual')
    ↓
pipelineRuntime.ts: executePipeline(pipeline, nodes, edges, adapters)
    ↓
Topological sort of nodes
    ↓
Execute each node with demoAdapters (mock AI responses)
    ↓
Return RunResult { steps, notifications, approvalRequests }
    ↓
PipelineContext updates: runs, approvals, notifications in state + localStorage
```

---

## Key Architectural Patterns

### 1. NODE_TYPES outside component
ReactFlow requires `nodeTypes` to be a stable reference. It is defined at module level:
```tsx
const NODE_TYPES = { pipelineBlock: PipelineBlockNode };
```

### 2. Block Registry Pattern
All blocks are defined in `BLOCK_REGISTRY` (a flat `Record<string, BlockDef>`). Components look up blocks by `blockId` string. This decouples the visual node from block behavior.

### 3. Adapter Pattern for Demo Execution
`demoAdapters.ts` maps `runtimeNodeType → async function(config, input)`. Real API calls would replace these adapters without touching the execution engine.

### 4. Prompt Selection via Custom DOM Event
`AIModelPanel` (inside `PipelineBuilder`) fires a custom window event when a prompt is selected from the library:
```tsx
window.dispatchEvent(new CustomEvent('baiprompt:select', { detail: prompt }))
```
`BuilderInner` listens and applies the prompt to the selected node's config.

### 5. `cn()` utility
```tsx
import { cn } from '../lib/utils';
cn('base-class', condition && 'conditional-class', 'other-class')
```
Combines `clsx` (conditional classes) + `tailwind-merge` (deduplication).
