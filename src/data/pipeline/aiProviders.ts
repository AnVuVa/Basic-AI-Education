// AI Provider metadata — used by inspector and AIAccounts page

export interface AIProviderMeta {
  blockId: string;
  name: string;
  provider: string;
  providerUrl: string;
  model: string;
  modelVersion: string;
  icon: string;            // emoji or short label
  color: string;           // Tailwind bg class (dark variant)
  accent: string;          // Tailwind text color
  contextWindow: string;
  pricing: string;         // per 1M tokens (input / output)
  capabilities: string[];
  strengths: string[];
  weaknesses: string[];
  alternatives: string[];  // blockIds that can replace this
  purpose: string;         // role in a pipeline
}

export const AI_PROVIDER_META: Record<string, AIProviderMeta> = {

  'gemini-flash': {
    blockId: 'gemini-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google DeepMind',
    providerUrl: 'https://deepmind.google',
    model: 'gemini-1.5-flash',
    modelVersion: '1.5 Flash',
    icon: '✦',
    color: 'bg-blue-900/50',
    accent: 'text-blue-300',
    contextWindow: '1M tokens',
    pricing: '$0.075 / $0.30 per 1M',
    capabilities: ['Text', 'Vision', 'Code', 'Long context'],
    strengths: ['Rất nhanh (~1s)', 'Giá rẻ nhất', 'Context cực dài 1M', 'Miễn phí tier'],
    weaknesses: ['Kém hơn Pro về reasoning', 'Ít chi tiết hơn GPT-4o'],
    alternatives: ['gemini-pro', 'gpt-4o-mini', 'claude-sonnet'],
    purpose: 'Tạo dàn ý nhanh, tóm tắt nội dung, phân loại văn bản',
  },

  'gemini-pro': {
    blockId: 'gemini-pro',
    name: 'Gemini 2.0 Flash',
    provider: 'Google DeepMind',
    providerUrl: 'https://deepmind.google',
    model: 'gemini-2.0-flash',
    modelVersion: '2.0 Flash',
    icon: '✦',
    color: 'bg-blue-900/50',
    accent: 'text-blue-400',
    contextWindow: '1M tokens',
    pricing: '$0.10 / $0.40 per 1M',
    capabilities: ['Text', 'Vision', 'Code', 'Reasoning', 'Multimodal'],
    strengths: ['Reasoning tốt hơn 1.5', 'Cực nhanh với model mới', 'Multimodal đa dạng'],
    weaknesses: ['Đắt hơn Flash', 'Cần API key'],
    alternatives: ['gpt-4o', 'claude-sonnet', 'perplexity-sonar'],
    purpose: 'Viết nội dung chi tiết, phân tích phức tạp, tổng hợp thông tin',
  },

  'gpt-4o': {
    blockId: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerUrl: 'https://openai.com',
    model: 'gpt-4o',
    modelVersion: '4o (2024-11-20)',
    icon: '⬡',
    color: 'bg-green-900/50',
    accent: 'text-green-300',
    contextWindow: '128K tokens',
    pricing: '$2.50 / $10.00 per 1M',
    capabilities: ['Text', 'Vision', 'Code', 'Voice', 'Structured output'],
    strengths: ['Chất lượng top tier', 'Structured output ổn định', 'Tool calling tốt'],
    weaknesses: ['Đắt nhất', 'Context ngắn hơn Gemini'],
    alternatives: ['gemini-pro', 'claude-sonnet'],
    purpose: 'Viết nội dung chất lượng cao, lập trình, phân tích chuyên sâu',
  },

  'gpt-4o-mini': {
    blockId: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    providerUrl: 'https://openai.com',
    model: 'gpt-4o-mini',
    modelVersion: '4o-mini',
    icon: '⬡',
    color: 'bg-green-900/40',
    accent: 'text-green-400',
    contextWindow: '128K tokens',
    pricing: '$0.15 / $0.60 per 1M',
    capabilities: ['Text', 'Vision', 'Code'],
    strengths: ['Nhanh và rẻ', 'Phù hợp task đơn giản', 'Ổn định'],
    weaknesses: ['Yếu hơn GPT-4o', 'Không phù hợp task phức tạp'],
    alternatives: ['gemini-flash', 'claude-sonnet'],
    purpose: 'Phân loại, tóm tắt ngắn, phản hồi nhanh',
  },

  'claude-sonnet': {
    blockId: 'claude-sonnet',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    providerUrl: 'https://anthropic.com',
    model: 'claude-sonnet-4-5',
    modelVersion: 'Sonnet 4.5',
    icon: '◈',
    color: 'bg-orange-900/50',
    accent: 'text-orange-300',
    contextWindow: '200K tokens',
    pricing: '$3.00 / $15.00 per 1M',
    capabilities: ['Text', 'Code', 'Analysis', 'Long documents'],
    strengths: ['Tốt nhất cho viết văn bản dài', 'An toàn & nhất quán', 'Context 200K'],
    weaknesses: ['Đắt', 'Không có vision miễn phí'],
    alternatives: ['gpt-4o', 'gemini-pro'],
    purpose: 'Viết nội dung chất lượng học thuật, phân tích tài liệu dài',
  },

  'perplexity-sonar': {
    blockId: 'perplexity-sonar',
    name: 'Perplexity Sonar Pro',
    provider: 'Perplexity AI',
    providerUrl: 'https://perplexity.ai',
    model: 'sonar-pro',
    modelVersion: 'Sonar Pro',
    icon: '⊕',
    color: 'bg-teal-900/50',
    accent: 'text-teal-300',
    contextWindow: '200K tokens',
    pricing: '$3.00 / $15.00 per 1M',
    capabilities: ['Web search', 'Real-time data', 'Citations', 'Research'],
    strengths: ['Tìm kiếm web thời gian thực', 'Trích dẫn nguồn', 'Tin tức mới nhất'],
    weaknesses: ['Cần subscription', 'Không phù hợp task sáng tạo'],
    alternatives: ['gemini-pro'],
    purpose: 'Tra cứu sự kiện lịch sử, tìm kiếm nguồn tài liệu tin cậy',
  },

  'gamma-ai': {
    blockId: 'gamma-ai',
    name: 'Gamma AI',
    provider: 'Gamma',
    providerUrl: 'https://gamma.app',
    model: 'gamma-presentation',
    modelVersion: 'Presentation Engine',
    icon: '▦',
    color: 'bg-pink-900/50',
    accent: 'text-pink-300',
    contextWindow: 'N/A',
    pricing: '$10/month Pro',
    capabilities: ['Slide generation', 'Design', 'Export PDF/PPTX'],
    strengths: ['Tự động tạo slide đẹp', 'Nhiều template', 'Export đa định dạng'],
    weaknesses: ['Ít tùy chỉnh sâu', 'Phụ thuộc vào service'],
    alternatives: ['canva-magic'],
    purpose: 'Tự động tạo slide bài giảng từ nội dung văn bản',
  },

  'midjourney': {
    blockId: 'midjourney',
    name: 'Midjourney v6',
    provider: 'Midjourney',
    providerUrl: 'https://midjourney.com',
    model: 'midjourney-v6',
    modelVersion: 'v6.1',
    icon: '✺',
    color: 'bg-indigo-900/50',
    accent: 'text-indigo-300',
    contextWindow: 'N/A',
    pricing: '$10-120/month',
    capabilities: ['Image generation', 'Artistic styles', 'High resolution'],
    strengths: ['Chất lượng ảnh nghệ thuật cao nhất', 'Nhiều phong cách', 'Ảnh lịch sử, cổ điển rất đẹp'],
    weaknesses: ['Chỉ qua Discord/API', 'Không viết được chữ trong ảnh'],
    alternatives: ['canva-magic'],
    purpose: 'Tạo hình ảnh minh họa lịch sử, tranh phong cảnh, nhân vật',
  },

  'canva-magic': {
    blockId: 'canva-magic',
    name: 'Canva Magic Studio',
    provider: 'Canva',
    providerUrl: 'https://canva.com',
    model: 'canva-magic-design',
    modelVersion: 'Magic Studio 2024',
    icon: '◐',
    color: 'bg-cyan-900/50',
    accent: 'text-cyan-300',
    contextWindow: 'N/A',
    pricing: '$15/month Pro',
    capabilities: ['Design', 'Image AI', 'Presentation', 'Video'],
    strengths: ['All-in-one', 'Dễ dùng', 'Nhiều template đẹp'],
    weaknesses: ['AI image yếu hơn Midjourney', 'Thiết kế dễ trùng lặp'],
    alternatives: ['gamma-ai', 'midjourney'],
    purpose: 'Thiết kế infographic, poster minh họa, banner bài giảng',
  },

  'elevenlabs': {
    blockId: 'elevenlabs',
    name: 'ElevenLabs TTS',
    provider: 'ElevenLabs',
    providerUrl: 'https://elevenlabs.io',
    model: 'eleven-multilingual-v2',
    modelVersion: 'Multilingual v2',
    icon: '♪',
    color: 'bg-yellow-900/50',
    accent: 'text-yellow-300',
    contextWindow: 'N/A',
    pricing: '$5-330/month',
    capabilities: ['Text-to-Speech', 'Voice cloning', 'Vietnamese support'],
    strengths: ['Giọng tự nhiên nhất', 'Hỗ trợ tiếng Việt', 'Clone giọng'],
    weaknesses: ['Đắt', 'Giới hạn character/tháng'],
    alternatives: [],
    purpose: 'Chuyển nội dung bài giảng thành audio narration',
  },

  'whisper': {
    blockId: 'whisper',
    name: 'OpenAI Whisper',
    provider: 'OpenAI',
    providerUrl: 'https://openai.com',
    model: 'whisper-1',
    modelVersion: 'v3 Turbo',
    icon: '◎',
    color: 'bg-slate-700/50',
    accent: 'text-slate-300',
    contextWindow: 'N/A',
    pricing: '$0.006/minute',
    capabilities: ['Speech-to-text', '99 languages', 'High accuracy'],
    strengths: ['Chính xác cao', 'Hỗ trợ tiếng Việt', 'Rẻ'],
    weaknesses: ['Chỉ làm transcription'],
    alternatives: [],
    purpose: 'Chuyển âm thanh bài giảng thành văn bản',
  },
};

// ── AI Account status (for AIAccounts page) ─────────────────────────

export interface AIAccount {
  id: string;
  provider: string;
  icon: string;
  color: string;
  accent: string;
  accountName: string;
  plan: string;
  status: 'connected' | 'limited' | 'error' | 'mock';
  balance?: string;
  balanceRaw?: number;
  usedThisMonth: string;
  quota: string;
  models: string[];
  lastUsed?: string;
  isReal?: boolean; // true = real API call made
}

export const AI_ACCOUNTS_MOCK: AIAccount[] = [
  {
    id: 'google-gemini',
    provider: 'Google DeepMind',
    icon: '✦',
    color: 'bg-blue-600',
    accent: 'text-blue-300',
    accountName: 'baiedu-system@gemini',
    plan: 'Gemini API (Pay-as-you-go)',
    status: 'connected', // will be updated by real API check
    balance: '~$18.50',
    balanceRaw: 18.50,
    usedThisMonth: '$1.42',
    quota: '15 RPM / 1M TPM (free tier)',
    models: ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
    lastUsed: '2 giờ trước',
    isReal: true,
  },
  {
    id: 'openai-gpt',
    provider: 'OpenAI',
    icon: '⬡',
    color: 'bg-emerald-600',
    accent: 'text-emerald-300',
    accountName: 'baiedu-system@openai',
    plan: 'API Pay-per-use',
    status: 'mock',
    balance: '$24.80',
    balanceRaw: 24.80,
    usedThisMonth: '$3.67',
    quota: '500K TPM (Tier 1)',
    models: ['gpt-4o', 'gpt-4o-mini', 'o1-mini'],
    lastUsed: '1 ngày trước',
  },
  {
    id: 'anthropic-claude',
    provider: 'Anthropic',
    icon: '◈',
    color: 'bg-orange-600',
    accent: 'text-orange-300',
    accountName: 'baiedu-system@anthropic',
    plan: 'API (Build tier)',
    status: 'mock',
    balance: '$45.00',
    balanceRaw: 45.00,
    usedThisMonth: '$2.10',
    quota: '100K TPM',
    models: ['claude-sonnet-4-5', 'claude-haiku-4-5'],
    lastUsed: '3 ngày trước',
  },
  {
    id: 'perplexity',
    provider: 'Perplexity AI',
    icon: '⊕',
    color: 'bg-teal-600',
    accent: 'text-teal-300',
    accountName: 'baiedu-system@perplexity',
    plan: 'Enterprise Pro',
    status: 'mock',
    balance: 'Unlimited',
    usedThisMonth: '847 requests',
    quota: '5000 req/month',
    models: ['sonar-pro', 'sonar-reasoning'],
    lastUsed: '5 giờ trước',
  },
  {
    id: 'gamma',
    provider: 'Gamma',
    icon: '▦',
    color: 'bg-pink-600',
    accent: 'text-pink-300',
    accountName: 'baiedu@gamma.app',
    plan: 'Pro ($10/month)',
    status: 'mock',
    balance: '380 credits còn',
    usedThisMonth: '120 slides tạo',
    quota: '400 AI credits/month',
    models: ['gamma-presentation'],
    lastUsed: '1 tuần trước',
  },
  {
    id: 'elevenlabs',
    provider: 'ElevenLabs',
    icon: '♪',
    color: 'bg-yellow-600',
    accent: 'text-yellow-300',
    accountName: 'baiedu@elevenlabs.io',
    plan: 'Creator ($22/month)',
    status: 'mock',
    balance: '42,500 chars còn',
    usedThisMonth: '30,000 chars',
    quota: '100K chars/month',
    models: ['eleven-multilingual-v2'],
    lastUsed: '2 tuần trước',
  },
];
