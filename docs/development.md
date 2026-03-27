# Development Guide

## Prerequisites

- **Node.js** v18 or higher (v20 LTS recommended)
- **npm** v9+ (comes with Node.js)
- A **Google Gemini API key** (free tier available at https://aistudio.google.com/app/apikey)
- **Git** (for version control)
- A code editor — VS Code recommended

---

## Step-by-Step Setup

### 1. Clone or open the project

If you already have the folder, skip to step 2.

```bash
git clone <repo-url>
cd Basic-AI-Education
```

The working directory is: `d:\NgJaBach\Project\Web\Basic-AI-Education`

---

### 2. Install dependencies

```bash
npm install
```

This installs all packages from `package.json`. Key packages:
- `react`, `react-dom` v19
- `@xyflow/react` — pipeline canvas
- `@google/genai` — Gemini AI
- `tailwindcss`, `@tailwindcss/vite` v4
- `motion` — animations
- `react-router-dom` v7
- `lucide-react` — icons

> **Note:** If you get TypeScript errors, the `@types/react` and `@types/react-dom` devDependencies should already be installed. If not: `npm install @types/react @types/react-dom --save-dev`

---

### 3. Set up your Gemini API key

Create a `.env.local` file in the project root:

```bash
# Create the file
touch .env.local
```

Or manually create `d:\NgJaBach\Project\Web\Basic-AI-Education\.env.local` with:

```
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Gemini API key from https://aistudio.google.com/app/apikey.

> The `.env.local` file is NOT committed to git (it's in `.gitignore`). Keep your key private.

> If you don't have a key, the app still works — only the AI Keys page live-check and future real AI calls require it.

---

### 4. Start the development server

```bash
npm run dev
```

Output:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Open your browser and navigate to: **http://localhost:3000**

The server runs on port `3000` (configured in `package.json`: `vite --port=3000 --host=0.0.0.0`).

Hot Module Replacement (HMR) is enabled by default. Changes to `.tsx`/`.ts`/`.css` files auto-reload the browser.

---

## Available Scripts

```bash
npm run dev        # Start dev server on localhost:3000 (hot reload)
npm run build      # Build for production → output to /dist
npm run preview    # Preview the production build locally
npm run lint       # Type-check TypeScript (no emit)
npm run clean      # Remove the /dist folder
```

---

## Building for Production

```bash
npm run build
```

This runs `vite build`, which:
1. Compiles TypeScript
2. Bundles all assets
3. Outputs to `/dist` folder

Expected output:
```
dist/index.html             ~0.42 kB
dist/assets/index-*.css    ~120 kB  (gzipped: ~17 kB)
dist/assets/index-*.js    ~1,724 kB (gzipped: ~415 kB)
```

> The JS bundle is large (~1.7MB) because it includes ReactFlow, Motion, and all icons. This is expected for a rich app. In production, consider code splitting.

---

## Previewing the Production Build

After building, serve the `/dist` folder locally:

```bash
npm run preview
```

Opens at: **http://localhost:4173** (Vite's default preview port)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes (for AI features) | Google Gemini API key |

Variables are loaded from:
1. `.env.local` (local development — not committed)
2. `.env` (committed defaults, if any)

In `vite.config.ts`, the key is injected at build time:
```ts
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
}
```

Access in code via:
```ts
const key = process.env.GEMINI_API_KEY || '';
// OR
const key = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
```

---

## Project-Specific Notes

### TypeScript
Run `npm run lint` to type-check. There should be 0 errors with a clean build. TypeScript is in strict-ish mode (see `tsconfig.json`).

### Tailwind CSS
Using **Tailwind v4** (not v3). Configuration is done via `@theme` in `src/index.css`, not via `tailwind.config.js`. This is important — v4 has a different config API.

### @xyflow/react (ReactFlow)
- `NODE_TYPES` constant MUST be defined outside React components (at module scope) or it will cause performance issues
- `useReactFlow()` hook only works inside `<ReactFlowProvider>`
- The provider is applied in the outer `PipelineBuilder` export, not `BuilderInner`

### localStorage
All user data (pipelines, runs, approvals, notifications) is stored in `localStorage`. To reset to a clean state:
```javascript
// Run in browser DevTools console:
Object.keys(localStorage).filter(k => k.startsWith('baiedu_')).forEach(k => localStorage.removeItem(k));
location.reload();
```

### Mock Authentication
Default admin account:
- Email: `admin@baiedu.vn`
- Password: `admin123`

---

## Folder-Specific Conventions

### Adding a new page
1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx` inside the `<Route element={<Layout />}>` block
3. Add nav item to `src/components/Sidebar.tsx`

### Adding a new pipeline block
1. Add block definition to `BLOCK_REGISTRY` in `src/data/pipeline/blockRegistry.ts`
2. Add demo adapter in `src/data/pipeline/demoAdapters.ts` for the `runtimeMapping`
3. If it's an AI block: add metadata to `AI_PROVIDER_META` in `src/data/pipeline/aiProviders.ts`

### Adding a new pipeline template
1. Add template object to `PIPELINE_TEMPLATES` in `src/data/pipeline/pipelineTemplates.ts`
2. Add the template icon to `TEMPLATE_ICONS` in `src/components/lab/LabHome.tsx` if it uses a new icon

---

## Common Issues

### "Cannot find module" TypeScript errors
Run: `npm install` — dependencies may be missing.

### Gemini API key not working
- Check `.env.local` exists in the project root (not in `src/`)
- Check the key starts with `AIza...`
- Restart the dev server after changing `.env.local`

### ReactFlow nodes don't update
Make sure `NODE_TYPES` is defined outside the component. If defined inside, React re-creates it every render.

### Port 3000 already in use
```bash
# Kill whatever is on port 3000:
npx kill-port 3000
npm run dev
```
Or change the port: `vite --port=3001`

### Build warnings about chunk size
This is expected. The app is large. Not a breaking issue for development. For production, implement dynamic imports if needed.
