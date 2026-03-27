import React from 'react';
import {
  Search, BookOpen, Lightbulb, Presentation,
  PenTool, Film, BrainCircuit, GraduationCap,
} from 'lucide-react';
import type { PNode, PEdge } from '../components/WorkflowPreview';

// Re-export so consumers can import from one place
export type { PNode, PEdge };

export type WorkflowFrame = {
  id: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  tags: string[];
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  gradient: string;
  icon: React.ReactNode;
  chatSeed: string;
  preview: { nodes: PNode[]; edges: PEdge[] };
};

// ── Shared node helpers ────────────────────────────────────────────
// SVG viewBox 380×160, default node 76×30, rows center at y=65

/** 4 nodes in a straight horizontal line */
function linear4(
  a: [string,string,string], b: [string,string,string],
  c: [string,string,string], d: [string,string,string],
): { nodes: PNode[]; edges: PEdge[] } {
  return {
    nodes: [
      { id:'a', x:11,  y:65, label:a[0], sub:a[1], color:a[2] },
      { id:'b', x:105, y:65, label:b[0], sub:b[1], color:b[2] },
      { id:'c', x:199, y:65, label:c[0], sub:c[1], color:c[2] },
      { id:'d', x:293, y:65, label:d[0], sub:d[1], color:d[2] },
    ],
    edges: [
      { from:'a', to:'b' }, { from:'b', to:'c' }, { from:'c', to:'d' },
    ],
  };
}

/** 3 nodes centered */
function linear3(
  a: [string,string,string], b: [string,string,string],
  c: [string,string,string],
): { nodes: PNode[]; edges: PEdge[] } {
  return {
    nodes: [
      { id:'a', x:51,  y:65, label:a[0], sub:a[1], color:a[2] },
      { id:'b', x:152, y:65, label:b[0], sub:b[1], color:b[2] },
      { id:'c', x:253, y:65, label:c[0], sub:c[1], color:c[2] },
    ],
    edges: [{ from:'a', to:'b' }, { from:'b', to:'c' }],
  };
}

// ── Frame data ─────────────────────────────────────────────────────

export const FRAMES: WorkflowFrame[] = [
  {
    id: 'wf-presentation',
    title: 'Thuyết trình Lịch sử',
    description: 'Tìm kiếm → Tổng hợp nội dung → Tạo slide chuyên nghiệp với AI trong vài phút.',
    category: 'Thuyết trình',
    tools: ['Perplexity', 'Gemini', 'Gamma'],
    tags: ['Slide', 'Lịch sử', 'Nghiên cứu'],
    difficulty: 'Trung bình',
    gradient: 'from-blue-500 to-purple-600',
    icon: React.createElement(Presentation, { className: 'w-8 h-8' }),
    chatSeed: 'Tôi muốn tạo workflow cho bài thuyết trình Lịch sử Việt Nam',
    preview: linear4(
      ['Tìm kiếm',  'Perplexity', '#818cf8'],
      ['Tổng hợp',  'Gemini',     '#60a5fa'],
      ['Tạo slide', 'Gamma',      '#34d399'],
      ['Xuất bản',  'Export',     '#fbbf24'],
    ),
  },
  {
    id: 'wf-document',
    title: 'Phân tích Tài liệu',
    description: 'Tóm tắt, trích xuất luận điểm và tổng hợp kiến thức từ tài liệu học thuật.',
    category: 'Nghiên cứu',
    tools: ['Claude', 'Perplexity'],
    tags: ['Học thuật', 'Tóm tắt', 'Phân tích'],
    difficulty: 'Cơ bản',
    gradient: 'from-cyan-500 to-blue-600',
    icon: React.createElement(BookOpen, { className: 'w-8 h-8' }),
    chatSeed: 'Thiết kế workflow để phân tích và tóm tắt tài liệu học thuật',
    preview: linear4(
      ['Tải lên',   'PDF/Doc',   '#22d3ee'],
      ['Tóm tắt',   'Claude',    '#a78bfa'],
      ['Trích xuất','Perplexity','#60a5fa'],
      ['Báo cáo',   'Output',    '#34d399'],
    ),
  },
  {
    id: 'wf-brainstorm',
    title: 'Brainstorm Ý tưởng',
    description: 'Khai phá góc nhìn đa chiều, lọc và phát triển ý tưởng sáng tạo cùng AI.',
    category: 'Sáng tạo',
    tools: ['ChatGPT', 'Gemini'],
    tags: ['Sáng tạo', 'Ý tưởng', 'Brainstorm'],
    difficulty: 'Cơ bản',
    gradient: 'from-amber-500 to-orange-600',
    icon: React.createElement(Lightbulb, { className: 'w-8 h-8' }),
    chatSeed: 'Tôi muốn brainstorm ý tưởng sáng tạo cho dự án của mình',
    // Fork layout: 1 source → 3 AI agents → 1 synthesis
    preview: {
      nodes: [
        { id:'start', x:10,  y:65,  label:'Chủ đề',   sub:'Input',      color:'#fbbf24' },
        { id:'t1',    x:140, y:10,  label:'ChatGPT',  sub:'Góc nhìn 1', color:'#34d399' },
        { id:'t2',    x:140, y:65,  label:'Gemini',   sub:'Góc nhìn 2', color:'#60a5fa' },
        { id:'t3',    x:140, y:120, label:'Claude',   sub:'Góc nhìn 3', color:'#f472b6' },
        { id:'end',   x:270, y:65,  label:'Tổng hợp', sub:'AI Filter',  color:'#818cf8' },
      ],
      edges: [
        { from:'start', to:'t1' }, { from:'start', to:'t2' }, { from:'start', to:'t3' },
        { from:'t1',    to:'end' }, { from:'t2', to:'end' }, { from:'t3', to:'end' },
      ],
    },
  },
  {
    id: 'wf-essay',
    title: 'Viết Tiểu luận',
    description: 'Từ dàn ý → viết nháp → chỉnh sửa văn phong học thuật chuyên nghiệp.',
    category: 'Viết lách',
    tools: ['Claude', 'ChatGPT'],
    tags: ['Học thuật', 'Văn phong', 'Tiểu luận'],
    difficulty: 'Trung bình',
    gradient: 'from-emerald-500 to-teal-600',
    icon: React.createElement(PenTool, { className: 'w-8 h-8' }),
    chatSeed: 'Giúp tôi tạo workflow để viết một bài tiểu luận học thuật',
    preview: linear4(
      ['Đề cương',   'Outline', '#a78bfa'],
      ['Bản nháp',   'Claude',  '#818cf8'],
      ['Chỉnh sửa',  'ChatGPT', '#60a5fa'],
      ['Hoàn chỉnh', 'Polish',  '#34d399'],
    ),
  },
  {
    id: 'wf-coding',
    title: 'Debug & Giải thích Code',
    description: 'Phân tích lỗi, giải thích từng dòng code và đề xuất cách tối ưu hóa.',
    category: 'Lập trình',
    tools: ['ChatGPT', 'Claude'],
    tags: ['Lập trình', 'Debug', 'Giải thích'],
    difficulty: 'Cơ bản',
    gradient: 'from-violet-500 to-indigo-600',
    icon: React.createElement(BrainCircuit, { className: 'w-8 h-8' }),
    chatSeed: 'Tôi cần workflow để debug code và giải thích cho người mới học',
    preview: linear3(
      ['Code vào', 'Input',   '#f87171'],
      ['Phân tích','ChatGPT', '#fbbf24'],
      ['Sửa lỗi', 'Claude',  '#34d399'],
    ),
  },
  {
    id: 'wf-study',
    title: 'Lập Kế hoạch Ôn thi',
    description: 'Phân tích đề cương → phân bổ thời gian theo Pomodoro → lịch ôn tập tối ưu.',
    category: 'Học tập',
    tools: ['Gemini', 'ChatGPT'],
    tags: ['Kế hoạch', 'Pomodoro', 'Ôn thi'],
    difficulty: 'Cơ bản',
    gradient: 'from-pink-500 to-rose-600',
    icon: React.createElement(GraduationCap, { className: 'w-8 h-8' }),
    chatSeed: 'Thiết kế workflow lập kế hoạch ôn thi với phương pháp Pomodoro',
    preview: linear3(
      ['Đề cương',   'Syllabus', '#f472b6'],
      ['Phân bổ TG', 'Gemini',   '#fbbf24'],
      ['Lịch học',   'ChatGPT',  '#34d399'],
    ),
  },
  {
    id: 'wf-research',
    title: 'Nghiên cứu Chuyên sâu',
    description: 'Tổng hợp thông tin từ nhiều nguồn → xây dựng báo cáo có trích dẫn đầy đủ.',
    category: 'Nghiên cứu',
    tools: ['Perplexity', 'Claude', 'Gemini'],
    tags: ['Báo cáo', 'Trích dẫn', 'Nghiên cứu'],
    difficulty: 'Nâng cao',
    gradient: 'from-slate-600 to-blue-700',
    icon: React.createElement(Search, { className: 'w-8 h-8' }),
    chatSeed: 'Tôi muốn xây workflow nghiên cứu chuyên sâu và tổng hợp báo cáo',
    // Fan-in: 3 sources → 1 synthesis → 1 report
    preview: {
      nodes: [
        { id:'p',   x:10,  y:12,  label:'Perplexity', sub:'Tìm kiếm', color:'#60a5fa' },
        { id:'c',   x:10,  y:65,  label:'Claude',     sub:'Phân tích', color:'#a78bfa' },
        { id:'g',   x:10,  y:118, label:'Gemini',     sub:'Tổng quan', color:'#34d399' },
        { id:'syn', x:170, y:65,  label:'Tổng hợp',   sub:'AI Merge',  color:'#818cf8' },
        { id:'rep', x:292, y:65,  label:'Báo cáo',    sub:'Output',    color:'#fbbf24' },
      ],
      edges: [
        { from:'p', to:'syn' }, { from:'c', to:'syn' }, { from:'g', to:'syn' },
        { from:'syn', to:'rep' },
      ],
    },
  },
  {
    id: 'wf-multimedia',
    title: 'Nội dung Đa phương tiện',
    description: 'Viết kịch bản → Tạo hình ảnh AI → Lồng tiếng → Dựng video hoàn chỉnh.',
    category: 'Sáng tạo',
    tools: ['ChatGPT', 'Midjourney', 'ElevenLabs'],
    tags: ['Video', 'Hình ảnh', 'Kịch bản'],
    difficulty: 'Nâng cao',
    gradient: 'from-fuchsia-500 to-pink-600',
    icon: React.createElement(Film, { className: 'w-8 h-8' }),
    chatSeed: 'Thiết kế workflow tạo nội dung đa phương tiện từ kịch bản đến video',
    // 2×2 grid pipeline
    preview: {
      nodes: [
        { id:'sc', x:15,  y:14,  w:155, h:34, label:'Kịch bản',   sub:'ChatGPT',   color:'#818cf8' },
        { id:'im', x:210, y:14,  w:155, h:34, label:'Hình ảnh AI', sub:'Midjourney', color:'#f472b6' },
        { id:'vo', x:15,  y:100, w:155, h:34, label:'Lồng tiếng',  sub:'ElevenLabs', color:'#34d399' },
        { id:'vi', x:210, y:100, w:155, h:34, label:'Video HD',    sub:'Compile',    color:'#fbbf24' },
      ],
      edges: [
        { from:'sc', to:'im', fromSide:'right',  toSide:'left'  },
        { from:'sc', to:'vo', fromSide:'bottom', toSide:'top'   },
        { from:'im', to:'vi', fromSide:'bottom', toSide:'top'   },
        { from:'vo', to:'vi', fromSide:'right',  toSide:'left'  },
      ],
    },
  },
];

export const CATEGORIES = ['Tất cả', 'Nghiên cứu', 'Thuyết trình', 'Viết lách', 'Sáng tạo', 'Lập trình', 'Học tập'];

export const QUICK_SUGGESTIONS = [
  'Làm thuyết trình', 'Phân tích tài liệu', 'Viết tiểu luận',
  'Debug code', 'Lập kế hoạch ôn thi', 'Nghiên cứu chuyên sâu',
];
