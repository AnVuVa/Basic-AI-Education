# AI Integration

## Gemini API (Active)

The only live AI integration is Google Gemini via `@google/genai`.

### Setup
The API key is loaded from the environment:
```ts
// vite.config.ts injects at build time:
'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)

// In code, access via:
const key = (import.meta as any).env?.VITE_GEMINI_API_KEY
         || (import.meta as any).env?.GEMINI_API_KEY
         || process.env.GEMINI_API_KEY
         || '';
```

### Where Gemini is used
1. **AIAccounts.tsx** — Live health check:
   ```
   GET https://generativelanguage.googleapis.com/v1beta/models?key={KEY}
   ```
   - Returns `{ ok: true }` if key is valid
   - Returns `{ ok: false, detail: 'Rate limit' }` on 429 (key valid, throttled)
   - Uses `AbortSignal.timeout(5000)` — 5 second timeout

2. **Pipeline blocks** — `gemini-flash` and `gemini-pro` blocks in the registry reference Gemini as the underlying model. Currently executed via `demoAdapters` (mock), but real Gemini calls would replace those adapters.

---

## AI Model Registry (`src/data/pipeline/aiProviders.ts`)

### AIProviderMeta interface
```typescript
interface AIProviderMeta {
  blockId: string;         // Matches BLOCK_REGISTRY key
  name: string;            // Display name
  provider: string;        // Company name
  model: string;           // Model ID
  modelVersion: string;
  pricing: string;         // e.g. "$0.075/1M tokens"
  contextWindow: string;   // e.g. "1M tokens"
  capabilities: string[];
  strengths: string[];
  weaknesses: string[];
  alternatives: string[];  // Other blockIds to swap with
  purpose: string;         // Role in a pipeline (Vietnamese description)
  icon: string;            // Emoji
  color: string;           // Tailwind class
  accent: string;          // Tailwind text color
}
```

### Registered AI Models (11):

| blockId | Model | Provider | Price | Context |
|---------|-------|----------|-------|---------|
| `gemini-flash` | Gemini 2.0 Flash | Google | Free tier / $0.075/1M | 1M tokens |
| `gemini-pro` | Gemini 1.5 Pro | Google | $1.25/1M | 2M tokens |
| `gpt-4o` | GPT-4o | OpenAI | $2.5/1M | 128K tokens |
| `gpt-4o-mini` | GPT-4o Mini | OpenAI | $0.15/1M | 128K tokens |
| `claude-sonnet` | Claude 3.5 Sonnet | Anthropic | $3/1M | 200K tokens |
| `perplexity-sonar` | Sonar Pro | Perplexity | $3/1M | Real-time web |
| `gamma-ai` | Gamma AI | Gamma | Per slide | Slides/docs |
| `midjourney` | Midjourney v6 | Midjourney | Per image | Images |
| `canva-magic` | Magic Studio | Canva | Subscription | Designs |
| `elevenlabs` | ElevenLabs | ElevenLabs | Per char | TTS audio |
| `whisper` | Whisper | OpenAI | $0.006/min | STT audio |

---

## AI Accounts Page (`src/pages/AIAccounts.tsx`)

Shows 6 connected accounts with mock data (except Gemini which is live-checked):

| Provider | Account | Status | Key available? |
|----------|---------|--------|---------------|
| Google Gemini | BAIEdu Gemini Account | Live checked | Yes (GEMINI_API_KEY) |
| OpenAI | BAIEdu OpenAI Account | Mock (Demo) | No |
| Anthropic | BAIEdu Anthropic Account | Mock (Demo) | No |
| Perplexity | BAIEdu Perplexity Account | Mock (Demo) | No |
| Gamma AI | BAIEdu Gamma Account | Mock (Demo) | No |
| ElevenLabs | BAIEdu ElevenLabs Account | Mock (Demo) | No |

The page shows as "BAIEdu System Account / Admin" — no login screen needed.

---

## BAIEdu Prompt Library (`src/data/pipeline/promptLibrary.ts`)

AI blocks can use prompts from a curated internal library.

### BAIPrompt interface:
```typescript
interface BAIPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;            // Full prompt text
  category: string;
  compatibleBlocks: string[]; // Which blockIds this prompt suits
  estimatedTokens: string;   // e.g. "~850 tokens"
  estimatedTime: string;     // e.g. "8-12 giây"
  structure: string;         // Prompt structure description
  rating: number;            // 1-5 stars
  usageCount: number;
  tags: string[];
}
```

### Included prompts (9):
- `ls-001` — Tìm kiếm tư liệu Lịch Sử Việt Nam (for perplexity-sonar)
- `ls-002` — Dàn ý bài giảng Lịch sử (for gemini-flash)
- `ls-003` — Viết nội dung 12 slide (for gpt-4o)
- `ls-004` — Tạo hình ảnh lịch sử (for midjourney)
- `edu-001` — Tóm tắt nội dung giáo dục
- `edu-002` — Tạo câu hỏi kiểm tra
- `gen-001` — Phân tích và tổng hợp thông tin
- `gen-002` — Tạo outline nội dung
- `gen-004` — Viết nội dung chuyên nghiệp

### Helper function:
```typescript
getPromptsForBlock(blockId: string): BAIPrompt[]
```
Returns compatible prompts for a given block, falling back to general prompts.

---

## AI Chat Assistant (in PipelineBuilder)

The right panel "Trợ lý AI" tab has a mock chatbot that understands simple Vietnamese commands:

| Command | Action |
|---------|--------|
| "gmail", "email", "mail" | Adds `new-email` block |
| "lọc", "filter" | Adds `email-filter` block |
| "tóm tắt", "phân tích", "ai" | Adds `email-summarize` block |
| "thông báo", "notify" | Adds `in-app-notify` block |
| "task", "công việc" | Adds `create-task` block |
| "quyết định", "decide" | Adds `priority-decision` block |
| "calendar", "lịch", "meeting" | Adds `new-event` block |
| "xóa", "clear" | Clears canvas |
| "đếm", "bao nhiêu" | Counts nodes |
| "lưu", "save" | Saves pipeline |

This is a rule-based mock — not connected to actual Gemini API.

---

## Adding Real AI Calls

To wire real API calls into a block:

1. In `src/data/pipeline/demoAdapters.ts`, find the adapter for the block's `runtimeMapping`
2. Replace the mock with a real API call using `@google/genai`:
   ```typescript
   import { GoogleGenAI } from '@google/genai';
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
   const response = await ai.models.generateContent({
     model: 'gemini-2.0-flash',
     contents: config.prompt,
   });
   return { output: response.text };
   ```
3. The execution engine in `pipelineRuntime.ts` passes adapter results forward automatically.

**Warning:** Be conservative with Gemini API calls — the free quota is limited. Use `gemini-2.0-flash` for most tasks.
