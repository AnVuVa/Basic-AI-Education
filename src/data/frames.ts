import React from 'react';
import {
  Search, BookOpen, Lightbulb, Presentation,
  PenTool, Film, BrainCircuit, GraduationCap,
} from 'lucide-react';

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
};

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
  },
];

export const CATEGORIES = ['Tất cả', 'Nghiên cứu', 'Thuyết trình', 'Viết lách', 'Sáng tạo', 'Lập trình', 'Học tập'];

export const QUICK_SUGGESTIONS = [
  'Làm thuyết trình', 'Phân tích tài liệu', 'Viết tiểu luận',
  'Debug code', 'Lập kế hoạch ôn thi', 'Nghiên cứu chuyên sâu',
];
