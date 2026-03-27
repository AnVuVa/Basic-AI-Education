// BAIEdu Open Prompt Library — used in AI block inspector

export interface BAIPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  compatibleBlocks: string[];  // blockIds this prompt targets
  estimatedTokens: number;
  estimatedTime: string;
  structure: string;
  rating: number;              // 1–5
  usageCount: number;
  tags: string[];
}

export const BAI_PROMPT_LIBRARY: BAIPrompt[] = [

  // ── Lịch Sử / Nghiên cứu ──────────────────────────────────────────

  {
    id: 'ls-001',
    title: 'Tra cứu sự kiện lịch sử Việt Nam',
    description: 'Tìm kiếm thông tin chính xác về một giai đoạn hoặc sự kiện lịch sử',
    prompt: `Hãy tra cứu và tổng hợp thông tin về chủ đề lịch sử: "{{topic}}".
Yêu cầu:
1. Liệt kê các sự kiện chính theo thứ tự thời gian
2. Nhân vật lịch sử quan trọng liên quan
3. Nguyên nhân và hệ quả
4. Trích dẫn từ ít nhất 3 nguồn đáng tin cậy
Trả lời bằng tiếng Việt, giọng văn học thuật.`,
    category: 'Lịch sử',
    compatibleBlocks: ['perplexity-sonar', 'gemini-pro', 'gpt-4o'],
    estimatedTokens: 180,
    estimatedTime: '~4s',
    structure: 'Structured (Task + Format + Constraint)',
    rating: 4.8,
    usageCount: 1243,
    tags: ['Lịch sử', 'Nghiên cứu', 'Trích dẫn'],
  },

  {
    id: 'ls-002',
    title: 'Tóm tắt nhanh sự kiện (bullet points)',
    description: 'Rút gọn sự kiện lịch sử thành các gạch đầu dòng ngắn gọn',
    prompt: `Tóm tắt sự kiện lịch sử "{{event}}" bằng tối đa 8 bullet points.
Mỗi bullet: 1 câu, không quá 20 từ.
Sắp xếp theo: Bối cảnh → Diễn biến → Kết quả → Ý nghĩa.`,
    category: 'Lịch sử',
    compatibleBlocks: ['gemini-flash', 'gpt-4o-mini', 'claude-sonnet'],
    estimatedTokens: 90,
    estimatedTime: '~1.5s',
    structure: 'Concise (Format-first)',
    rating: 4.5,
    usageCount: 2891,
    tags: ['Tóm tắt', 'Nhanh', 'Bullet'],
  },

  {
    id: 'ls-003',
    title: 'Dàn ý bài giảng chi tiết',
    description: 'Tạo dàn ý bài giảng hoàn chỉnh cho một chủ đề lịch sử',
    prompt: `Bạn là giáo viên lịch sử trung học phổ thông Việt Nam. Hãy tạo dàn ý bài giảng cho chủ đề: "{{topic}}"

Cấu trúc dàn ý:
I. Mục tiêu bài học (3-4 điểm)
II. Kiến thức trọng tâm (5-7 ý chính)
III. Các sự kiện/mốc thời gian then chốt
IV. Nhân vật lịch sử nổi bật
V. Câu hỏi thảo luận cho học sinh (3 câu)
VI. Hoạt động trải nghiệm đề xuất

Giọng văn: chuyên nghiệp, phù hợp với chương trình THPT Việt Nam.`,
    category: 'Giáo dục',
    compatibleBlocks: ['gemini-flash', 'gemini-pro', 'gpt-4o', 'claude-sonnet'],
    estimatedTokens: 320,
    estimatedTime: '~6s',
    structure: 'Detailed (Role + Task + Format)',
    rating: 4.9,
    usageCount: 876,
    tags: ['Bài giảng', 'Dàn ý', 'Giáo viên'],
  },

  {
    id: 'ls-004',
    title: 'Nội dung slide từng trang',
    description: 'Viết nội dung chi tiết cho từng slide trong bài giảng',
    prompt: `Dựa trên dàn ý sau:
{{outline}}

Hãy viết nội dung chi tiết cho TỪng slide:
- Tiêu đề slide (ngắn, ấn tượng, ≤8 từ)
- Nội dung chính (3-4 bullet points, mỗi bullet ≤15 từ)
- Ghi chú cho giáo viên (1-2 câu giải thích thêm)
- Từ khóa cho ảnh minh họa (3 từ khóa tiếng Anh để tìm ảnh)

Tổng số slide: 10-12 trang.`,
    category: 'Giáo dục',
    compatibleBlocks: ['gpt-4o', 'claude-sonnet', 'gemini-pro'],
    estimatedTokens: 580,
    estimatedTime: '~12s',
    structure: 'Complex (Context + Template + Output)',
    rating: 4.7,
    usageCount: 654,
    tags: ['Slide', 'Nội dung', 'Chi tiết'],
  },

  {
    id: 'ls-005',
    title: 'Prompt ảnh minh họa lịch sử (Midjourney)',
    description: 'Tạo prompt Midjourney cho ảnh lịch sử chân thực',
    prompt: `Tạo 5 Midjourney prompt để minh họa cho sự kiện lịch sử: "{{event}}"

Yêu cầu mỗi prompt:
- Phong cách: photorealistic historical painting, cinematic
- Mô tả cảnh vật, nhân vật, thời tiết, ánh sáng
- Độ phân giải: --ar 16:9 --q 2
- Giai đoạn: Việt Nam {{century}}

Ví dụ format: "Vietnamese soldiers marching through misty mountains, 1954, historical photograph style, dramatic lighting, --ar 16:9 --q 2"`,
    category: 'Hình ảnh',
    compatibleBlocks: ['midjourney', 'gemini-flash', 'gpt-4o'],
    estimatedTokens: 210,
    estimatedTime: '~3s',
    structure: 'Creative (Template + Examples)',
    rating: 4.6,
    usageCount: 432,
    tags: ['Midjourney', 'Ảnh', 'Lịch sử'],
  },

  // ── General AI blocks ──────────────────────────────────────────────

  {
    id: 'gen-001',
    title: 'Tóm tắt văn bản (general)',
    description: 'Tóm tắt bất kỳ văn bản nào thành các điểm chính',
    prompt: `Tóm tắt văn bản sau trong 150-200 từ:
{{content}}

Yêu cầu:
- Giữ lại các thông tin quan trọng nhất
- Loại bỏ thông tin trùng lặp và không cần thiết
- Giọng văn trung lập, khách quan
- Kết thúc bằng 1 câu kết luận`,
    category: 'Tóm tắt',
    compatibleBlocks: ['gemini-flash', 'gpt-4o-mini', 'claude-sonnet'],
    estimatedTokens: 120,
    estimatedTime: '~2s',
    structure: 'Standard (Task + Constraint)',
    rating: 4.4,
    usageCount: 5621,
    tags: ['Tóm tắt', 'General', 'Phổ biến'],
  },

  {
    id: 'gen-002',
    title: 'Phân tích & so sánh chuyên sâu',
    description: 'So sánh nhiều góc nhìn về một chủ đề',
    prompt: `Phân tích chuyên sâu chủ đề: "{{topic}}"
Góc nhìn cần phân tích:
1. Quan điểm học thuật truyền thống
2. Nghiên cứu hiện đại
3. Góc nhìn đa chiều (nếu có tranh luận)

Trình bày dưới dạng bảng so sánh và tóm tắt kết luận.
Độ dài: 400-500 từ.`,
    category: 'Phân tích',
    compatibleBlocks: ['claude-sonnet', 'gpt-4o', 'gemini-pro', 'perplexity-sonar'],
    estimatedTokens: 280,
    estimatedTime: '~7s',
    structure: 'Analytical (Multi-perspective)',
    rating: 4.3,
    usageCount: 1089,
    tags: ['Phân tích', 'So sánh', 'Chuyên sâu'],
  },

  {
    id: 'gen-003',
    title: 'Câu hỏi kiểm tra trắc nghiệm',
    description: 'Tạo bộ câu hỏi kiểm tra từ nội dung bài giảng',
    prompt: `Dựa trên nội dung sau:
{{content}}

Tạo 10 câu hỏi trắc nghiệm (4 đáp án A/B/C/D) phù hợp học sinh THPT.
Phân bổ:
- 4 câu biết (nhớ thông tin)
- 4 câu hiểu (giải thích, so sánh)
- 2 câu vận dụng (phân tích, đánh giá)

Format: Câu [n]: [nội dung] / A. ... B. ... C. ... D. ... / Đáp án: [X]`,
    category: 'Giáo dục',
    compatibleBlocks: ['gemini-flash', 'gpt-4o-mini', 'claude-sonnet'],
    estimatedTokens: 400,
    estimatedTime: '~8s',
    structure: 'Educational (Bloom taxonomy)',
    rating: 4.7,
    usageCount: 2134,
    tags: ['Kiểm tra', 'Trắc nghiệm', 'Học sinh'],
  },

  {
    id: 'gen-004',
    title: 'Narration script cho audio bài giảng',
    description: 'Chuyển slide thành kịch bản đọc tự nhiên cho ElevenLabs',
    prompt: `Chuyển nội dung slide sau thành kịch bản narration (giọng đọc):
{{slide_content}}

Yêu cầu:
- Giọng điệu: thân thiện, rõ ràng, như giáo viên đang giảng bài
- Mỗi slide: 30-60 giây đọc (~80-150 từ)
- Thêm ngắt nghỉ tự nhiên [pause] giữa các ý
- Nhấn mạnh từ khóa quan trọng bằng **bold**
- Kết thúc mỗi phần bằng câu dẫn sang phần tiếp`,
    category: 'Audio',
    compatibleBlocks: ['elevenlabs', 'gemini-flash', 'gpt-4o'],
    estimatedTokens: 250,
    estimatedTime: '~5s',
    structure: 'Media (Script format)',
    rating: 4.5,
    usageCount: 318,
    tags: ['Narration', 'Audio', 'ElevenLabs'],
  },
];

export function getPromptsForBlock(blockId: string): BAIPrompt[] {
  return BAI_PROMPT_LIBRARY.filter(p => p.compatibleBlocks.includes(blockId));
}
