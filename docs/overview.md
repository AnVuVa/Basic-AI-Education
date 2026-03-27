# BAIEdu — Project Overview

## What Is This?

**BAIEdu** (Basic AI Education) is a Vietnamese-language AI education web platform. Its mission is:

> "Định hình tư duy và trang bị la bàn đạo đức cho mọi người trong kỷ nguyên Trí tuệ Nhân tạo."
> ("Shape thinking and equip everyone with an ethical compass in the age of Artificial Intelligence.")

The platform teaches people how to use AI tools effectively and ethically, through courses, an interactive lab, a community, and a curated prompt library.

---

## Core Features

### 1. Phòng Lab (Pipeline Lab)
The flagship feature. A visual drag-and-drop **pipeline builder** (like a simplified n8n/Zapier, but focused on AI workflows). Users can:
- Create pipelines from 30+ pre-built blocks (triggers, AI models, actions, etc.)
- Choose from 10+ ready-made templates (e.g. Gmail monitor, slide generator, research pipeline)
- Run pipelines in a demo/sandbox mode
- Manage approval workflows and view execution logs
- Chat with an AI assistant inside the builder

### 2. Courses (Khóa học)
Structured AI learning paths with an LMS viewer.

### 3. Prompt Library (Thư viện)
Curated prompt library with categories, ratings, and usage counts.

### 4. Community (Cộng đồng)
Peer discussion and collaborative learning.

### 5. AI Keys (Tài khoản AI)
Dashboard showing all AI API accounts connected to BAIEdu, with live status checks (balance, usage, model availability). Currently supports: Google Gemini, OpenAI, Anthropic, Perplexity, Gamma, ElevenLabs.

### 6. Dashboard
User progress and achievement tracking.

---

## Who Built This?

- **Developer / Lead:** NgJaBach
- **Language:** Vietnamese-first UI
- **Working directory:** `d:\NgJaBach\Project\Web\Basic-AI-Education`
- **Git branch:** `main`

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 6.2 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing | React Router 7.13 |
| Canvas | @xyflow/react 12.10 (ReactFlow) |
| Icons | Lucide React 0.546 |
| Animations | Motion 12 (Framer Motion successor) |
| AI SDK | @google/genai 1.29 (Gemini) |
| Auth/State | React Context + localStorage |

---

## Project Origin

Started as a Google AI Studio project (app ID: `bd89f426-6744-4d5e-9974-d0e48853b6c7`). The Gemini API key is the primary AI credential. The project runs entirely client-side (no backend server in active use) — `express` and `better-sqlite3` are installed but not currently used.

---

## Current Status (as of 2026-03-28)

- All main pages implemented and working
- Pipeline Lab is the most complex and actively developed feature
- AI Keys page shows live Gemini API status
- Demo/mock data seeded on first launch via `pipelineStorage.ts`
- Authentication is mock (localStorage only, pre-seeded admin account)
- No real backend — all persistence is localStorage
