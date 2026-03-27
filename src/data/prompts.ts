export type PromptData = {
  id: string;
  title: string;
  text: string;
  tags: string[];
  tokens: string;
  time: string;
  structure: string;
  category: string;
};

export const PROMPT_LIBRARY: PromptData[] = [
  // ── Top picks: most detailed & complete prompts ────────────────
  {
    id: 'p52',
    title: 'Lên kế hoạch dự án nhanh',
    text: 'Tôi cần lập kế hoạch triển khai dự án "[Tên dự án]" trong vòng [Thời gian, ví dụ: 4 tuần]. Mục tiêu chính là [Mục tiêu]. Team gồm [Số người] người với vai trò [Liệt kê vai trò]. Hãy tạo: 1. Breakdown các milestone theo từng tuần, 2. Danh sách rủi ro tiềm ẩn và cách phòng tránh, 3. Tiêu chí đánh giá thành công.',
    tags: ['Dự án', 'Kế hoạch', 'Quản lý'],
    tokens: '~500 tokens',
    time: '~9s',
    structure: 'Quản lý dự án (Milestone + Risk + KPI)',
    category: 'Công việc'
  },
  {
    id: 'p11',
    title: 'Tạo câu hỏi phỏng vấn',
    text: 'Bạn là một chuyên gia nhân sự (HR). Hãy tạo danh sách 5 câu hỏi phỏng vấn hành vi (behavioral questions) cho vị trí [Tên vị trí], tập trung vào các kỹ năng: giải quyết vấn đề, làm việc nhóm và chịu áp lực. Kèm theo gợi ý cách đánh giá câu trả lời của ứng viên.',
    tags: ['Nhân sự', 'Phỏng vấn', 'Đánh giá'],
    tokens: '~400 tokens',
    time: '~7s',
    structure: 'Đầy đủ (Role + Task + Evaluation)',
    category: 'Công việc'
  },
  {
    id: 'p7',
    title: 'Lập kế hoạch ôn thi',
    text: 'Tôi có một kỳ thi môn [Tên môn] vào [Số ngày] ngày nữa. Khối lượng kiến thức bao gồm [Liệt kê các chương/chủ đề]. Hãy giúp tôi lập một thời gian biểu ôn tập chi tiết theo phương pháp Pomodoro, phân bổ thời gian hợp lý cho từng chủ đề và bao gồm cả thời gian làm bài thi thử.',
    tags: ['Học tập', 'Kế hoạch', 'Pomodoro'],
    tokens: '~400 tokens',
    time: '~8s',
    structure: 'Chi tiết (Context + Task + Method)',
    category: 'Học tập'
  },
  {
    id: 'p32',
    title: 'Tạo lộ trình học tập (Roadmap)',
    text: 'Tôi là người mới hoàn toàn và muốn trở thành [Ví dụ: Data Analyst, Frontend Developer] trong vòng 6 tháng. Hãy tạo một lộ trình học tập chi tiết từng tháng. Chỉ ra các kỹ năng cần học, công cụ cần nắm vững và gợi ý 1-2 dự án thực hành cho mỗi giai đoạn.',
    tags: ['Học tập', 'Lộ trình', 'Định hướng'],
    tokens: '~500 tokens',
    time: '~9s',
    structure: 'Chi tiết (Timeline + Skills + Projects)',
    category: 'Học tập'
  },
  {
    id: 'p46',
    title: 'Thiết kế kiến trúc hệ thống',
    text: 'Hãy thiết kế kiến trúc hệ thống (System Architecture) ở mức high-level cho một ứng dụng [Ví dụ: Đặt xe công nghệ, Mạng xã hội]. Liệt kê các thành phần chính (Frontend, Backend, Database, Caching, Message Queue) và giải thích luồng dữ liệu cơ bản.',
    tags: ['System Design', 'Kiến trúc', 'Lập trình'],
    tokens: '~600 tokens',
    time: '~10s',
    structure: 'Hệ thống (Components + Data Flow)',
    category: 'Lập trình'
  },
  {
    id: 'p3',
    title: 'Tóm tắt tài liệu nghiên cứu',
    text: 'Hãy đóng vai trò là một trợ lý nghiên cứu học thuật. Tôi sẽ cung cấp cho bạn một văn bản. Nhiệm vụ của bạn là tóm tắt các ý chính, phương pháp nghiên cứu và kết luận của văn bản đó trong khoảng 300 từ. Hãy giữ giọng văn khách quan và trích dẫn nguồn nếu có.',
    tags: ['Học thuật', 'Tóm tắt', 'Khách quan'],
    tokens: '~150 tokens',
    time: '~4s',
    structure: 'Đầy đủ (Role + Task + Constraint)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p2',
    title: 'Chuyên gia phân tích lịch sử',
    text: 'Bạn là một nhà sử học chuyên nghiệp. Hãy phân tích nguyên nhân, diễn biến và hệ quả của chiến dịch Điện Biên Phủ năm 1954. Trình bày dưới dạng các gạch đầu dòng chi tiết.',
    tags: ['Lịch sử', 'Chi tiết', 'Chuyên gia'],
    tokens: '~250 tokens',
    time: '~5s',
    structure: 'Đầy đủ (System + User + Format)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p12',
    title: 'Viết bài blog chuẩn SEO',
    text: 'Viết một bài blog dài khoảng 800 từ về chủ đề [Chủ đề]. Sử dụng từ khóa chính là "[Từ khóa 1]" và các từ khóa phụ "[Từ khóa 2], [Từ khóa 3]". Bài viết cần có thẻ H1, H2, H3 rõ ràng, một đoạn mở bài hấp dẫn và kết luận tóm tắt. Giọng văn thân thiện, dễ hiểu.',
    tags: ['SEO', 'Blog', 'Marketing'],
    tokens: '~800 tokens',
    time: '~12s',
    structure: 'Chi tiết (Task + Keywords + Format)',
    category: 'Viết lách'
  },
  {
    id: 'p29',
    title: 'Phân tích đối thủ cạnh tranh',
    text: 'Hãy đóng vai trò là chuyên gia phân tích thị trường. Phân tích 3 đối thủ cạnh tranh chính của [Tên thương hiệu/Sản phẩm] trong ngành [Tên ngành]. So sánh về: Giá cả, Tính năng cốt lõi, Chiến lược marketing, và Đánh giá của người dùng.',
    tags: ['Kinh doanh', 'Phân tích', 'Thị trường'],
    tokens: '~600 tokens',
    time: '~10s',
    structure: 'Nghiên cứu sâu (Role + Comparison Criteria)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p44',
    title: 'Phân tích báo cáo tài chính',
    text: 'Đóng vai trò là một chuyên gia phân tích tài chính. Dựa trên các số liệu sau đây của công ty [Tên công ty]: [Cung cấp số liệu Doanh thu, Lợi nhuận, Nợ...], hãy đánh giá tình hình sức khỏe tài chính của công ty và chỉ ra các dấu hiệu đáng lo ngại (red flags) nếu có.',
    tags: ['Tài chính', 'Phân tích', 'Đầu tư'],
    tokens: '~500 tokens',
    time: '~9s',
    structure: 'Chuyên sâu (Role + Data Analysis + Red flags)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p51',
    title: 'Viết báo cáo công việc tuần',
    text: 'Bạn là một nhân viên chuyên nghiệp. Viết báo cáo công việc tuần cho tôi dựa trên các đầu việc đã hoàn thành: [Liệt kê đầu việc]. Báo cáo cần có 3 phần: 1. Tóm tắt kết quả đạt được (highlight thành tích nổi bật), 2. Các vấn đề gặp phải & giải pháp đã áp dụng, 3. Kế hoạch tuần tới. Giọng văn chuyên nghiệp, súc tích.',
    tags: ['Báo cáo', 'Công việc', 'Tuần'],
    tokens: '~350 tokens',
    time: '~6s',
    structure: 'Cấu trúc 3 phần (Results + Issues + Plan)',
    category: 'Công việc'
  },

  // ── Remaining prompts ──────────────────────────────────────────
  {
    id: 'p1',
    title: 'Phân tích lịch sử cơ bản',
    text: 'Hãy tóm tắt các sự kiện chính trong chiến tranh Việt Nam.',
    tags: ['Lịch sử', 'Tóm tắt', 'Cơ bản'],
    tokens: '~50 tokens',
    time: '~2s',
    structure: 'Đơn giản (Zero-shot)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p4',
    title: 'Brainstorm ý tưởng tiểu luận',
    text: 'Tôi đang cần viết một bài tiểu luận về chủ đề [Chủ đề của bạn]. Hãy giúp tôi liệt kê 5 hướng tiếp cận khác nhau cho chủ đề này. Với mỗi hướng, hãy cung cấp 3 luận điểm chính và 1 câu hỏi nghiên cứu tiềm năng. Không viết sẵn bài cho tôi, chỉ gợi ý dàn ý.',
    tags: ['Sáng tạo', 'Dàn ý', 'Giáo dục'],
    tokens: '~300 tokens',
    time: '~6s',
    structure: 'Đa nhiệm (Task + Constraint)',
    category: 'Sáng tạo'
  },
  {
    id: 'p5',
    title: 'Kiểm tra ngữ pháp và văn phong',
    text: 'Hãy kiểm tra đoạn văn bản sau đây của tôi. Chỉ ra các lỗi ngữ pháp, chính tả và đề xuất cách diễn đạt tự nhiên hơn, học thuật hơn. Vui lòng giải thích lý do tại sao bạn đề xuất thay đổi đó để tôi có thể học hỏi. Đây là đoạn văn: [Đoạn văn của bạn]',
    tags: ['Ngữ pháp', 'Chỉnh sửa', 'Học thuật'],
    tokens: '~200 tokens',
    time: '~4s',
    structure: 'Đầy đủ (Task + Explain + Input)',
    category: 'Viết lách'
  },
  {
    id: 'p6',
    title: 'Giải thích code phức tạp',
    text: 'Hãy giải thích đoạn code [ngôn ngữ] dưới đây cho một người mới bắt đầu học lập trình. Phân tích từng dòng quan trọng, giải thích mục đích của các hàm/biến và đưa ra một ví dụ thực tế tương tự để dễ hình dung.',
    tags: ['Lập trình', 'Giải thích', 'Người mới'],
    tokens: '~350 tokens',
    time: '~7s',
    structure: 'Đa nhiệm (Role + Task + Example)',
    category: 'Lập trình'
  },
  {
    id: 'p8',
    title: 'Viết email xin việc',
    text: 'Hãy đóng vai trò là một ứng viên chuyên nghiệp. Viết một email xin việc ngắn gọn, ấn tượng cho vị trí [Tên vị trí] tại công ty [Tên công ty]. Nêu bật 2 kỹ năng chính là [Kỹ năng 1] và [Kỹ năng 2]. Giọng điệu tự tin, lịch sự.',
    tags: ['Email', 'Công việc', 'Chuyên nghiệp'],
    tokens: '~150 tokens',
    time: '~3s',
    structure: 'Đầy đủ (Role + Task + Tone)',
    category: 'Công việc'
  },
  {
    id: 'p9',
    title: 'Dịch thuật giữ nguyên văn phong',
    text: 'Dịch đoạn văn bản sau từ tiếng [Ngôn ngữ nguồn] sang tiếng [Ngôn ngữ đích]. Hãy đảm bảo giữ nguyên văn phong [Trang trọng/Hài hước/Học thuật] của bản gốc và điều chỉnh các thành ngữ sao cho tự nhiên nhất với người bản xứ.',
    tags: ['Dịch thuật', 'Văn phong', 'Ngôn ngữ'],
    tokens: '~250 tokens',
    time: '~5s',
    structure: 'Đa nhiệm (Task + Constraint)',
    category: 'Viết lách'
  },
  {
    id: 'p10',
    title: 'Tạo kịch bản video TikTok',
    text: 'Viết một kịch bản video TikTok dài 60 giây về chủ đề [Chủ đề]. Kịch bản cần có một hook (câu mở đầu) thu hút trong 3 giây đầu, phần thân chia sẻ 3 mẹo hữu ích, và phần kết kêu gọi hành động (Call to Action). Cung cấp cả gợi ý về hình ảnh/góc máy.',
    tags: ['Video', 'TikTok', 'Kịch bản'],
    tokens: '~350 tokens',
    time: '~6s',
    structure: 'Cấu trúc rõ ràng (Hook + Body + CTA)',
    category: 'Sáng tạo'
  },
  {
    id: 'p13',
    title: 'Tạo prompt tạo ảnh Midjourney',
    text: 'Hãy đóng vai trò là một chuyên gia tạo prompt cho Midjourney. Viết 3 prompt bằng tiếng Anh để tạo ra hình ảnh về [Chủ đề/Ý tưởng]. Sử dụng các từ khóa về phong cách nghệ thuật, ánh sáng, góc máy, và chất lượng (ví dụ: 8k, photorealistic, cinematic lighting).',
    tags: ['Hình ảnh', 'Midjourney', 'Prompt Engineering'],
    tokens: '~200 tokens',
    time: '~4s',
    structure: 'Đa nhiệm (Role + Task + Keywords)',
    category: 'Sáng tạo'
  },
  {
    id: 'p14',
    title: 'Giải toán từng bước',
    text: 'Hãy giải bài toán sau đây từng bước một. Giải thích rõ ràng lý do tại sao bạn áp dụng công thức hoặc phương pháp đó ở mỗi bước để tôi có thể hiểu được tư duy giải toán. Bài toán: [Nội dung bài toán]',
    tags: ['Toán học', 'Giáo dục', 'Từng bước'],
    tokens: '~300 tokens',
    time: '~6s',
    structure: 'Sư phạm (Task + Step-by-step + Explain)',
    category: 'Học tập'
  },
  {
    id: 'p15',
    title: 'Phân tích dữ liệu JSON',
    text: 'Dưới đây là một đoạn dữ liệu định dạng JSON. Hãy phân tích nó và trích xuất các thông tin sau: 1. Tổng số lượng [Đối tượng], 2. Giá trị trung bình của [Trường dữ liệu], 3. Liệt kê top 3 [Đối tượng] có giá trị cao nhất. Dữ liệu: [Chèn JSON]',
    tags: ['Dữ liệu', 'JSON', 'Phân tích'],
    tokens: '~400 tokens',
    time: '~7s',
    structure: 'Trích xuất (Data + Specific Tasks)',
    category: 'Lập trình'
  },
  {
    id: 'p16',
    title: 'Viết Unit Test',
    text: 'Viết các Unit Test bằng [Framework, ví dụ: Jest/JUnit] cho hàm [Tên hàm] dưới đây. Đảm bảo bao phủ các trường hợp: đầu vào hợp lệ, đầu vào không hợp lệ (edge cases), và các ngoại lệ (exceptions) có thể xảy ra. Code: [Chèn code]',
    tags: ['Lập trình', 'Testing', 'Unit Test'],
    tokens: '~350 tokens',
    time: '~6s',
    structure: 'Kỹ thuật (Task + Edge Cases)',
    category: 'Lập trình'
  },
  {
    id: 'p17',
    title: 'Tạo slide thuyết trình',
    text: 'Hãy tạo dàn ý cho một bài thuyết trình 10 slide về chủ đề [Chủ đề]. Với mỗi slide, hãy chỉ định: 1. Tiêu đề slide, 2. Các ý chính (bullet points), 3. Gợi ý hình ảnh minh họa phù hợp.',
    tags: ['Thuyết trình', 'Dàn ý', 'Slide'],
    tokens: '~400 tokens',
    time: '~8s',
    structure: 'Cấu trúc rõ ràng (Slide by Slide)',
    category: 'Sáng tạo'
  },
  {
    id: 'p18',
    title: 'Viết code React Component',
    text: 'Viết một functional component trong React (sử dụng TypeScript và Tailwind CSS) để tạo một [Tên Component, ví dụ: Card sản phẩm]. Component cần nhận các props: [Danh sách props]. Đảm bảo code clean, responsive và có xử lý trạng thái loading/error nếu cần.',
    tags: ['React', 'Frontend', 'Tailwind'],
    tokens: '~450 tokens',
    time: '~8s',
    structure: 'Kỹ thuật (Task + Tech Stack + Constraints)',
    category: 'Lập trình'
  },
  {
    id: 'p19',
    title: 'Tóm tắt sách',
    text: 'Hãy tóm tắt cuốn sách "[Tên sách]" của tác giả [Tên tác giả]. Chia bài tóm tắt thành 3 phần: 1. Thông điệp cốt lõi (1 câu), 2. 5 bài học quan trọng nhất, 3. Đánh giá cá nhân về tính ứng dụng của cuốn sách.',
    tags: ['Sách', 'Tóm tắt', 'Bài học'],
    tokens: '~500 tokens',
    time: '~9s',
    structure: 'Phân tích (Core + Lessons + Review)',
    category: 'Học tập'
  },
  {
    id: 'p20',
    title: 'Tạo bài tập trắc nghiệm',
    text: 'Tạo 10 câu hỏi trắc nghiệm (Multiple Choice) về chủ đề [Chủ đề] dành cho học sinh cấp [Cấp độ]. Mỗi câu hỏi có 4 đáp án (A, B, C, D), chỉ định rõ đáp án đúng và kèm theo một câu giải thích ngắn gọn tại sao đáp án đó đúng.',
    tags: ['Giáo dục', 'Trắc nghiệm', 'Đánh giá'],
    tokens: '~600 tokens',
    time: '~10s',
    structure: 'Đa nhiệm (Questions + Answers + Explanations)',
    category: 'Học tập'
  },
  {
    id: 'p21',
    title: 'Viết thư xin lỗi khách hàng',
    text: 'Đóng vai trò là quản lý chăm sóc khách hàng. Viết một email xin lỗi khách hàng vì sự cố [Mô tả sự cố]. Thể hiện sự đồng cảm, nhận trách nhiệm, giải thích ngắn gọn nguyên nhân (không đổ lỗi) và đưa ra giải pháp đền bù là [Giải pháp].',
    tags: ['CSKH', 'Email', 'Xin lỗi'],
    tokens: '~200 tokens',
    time: '~4s',
    structure: 'Chuyên nghiệp (Empathy + Responsibility + Solution)',
    category: 'Công việc'
  },
  {
    id: 'p22',
    title: 'Phân tích SWOT',
    text: 'Thực hiện phân tích SWOT (Điểm mạnh, Điểm yếu, Cơ hội, Thách thức) cho [Tên công ty/Sản phẩm/Ý tưởng]. Trình bày dưới dạng bảng hoặc danh sách rõ ràng, mỗi phần có ít nhất 3 ý phân tích sâu sắc dựa trên bối cảnh thị trường hiện tại.',
    tags: ['Kinh doanh', 'SWOT', 'Phân tích'],
    tokens: '~400 tokens',
    time: '~7s',
    structure: 'Phân tích chiến lược (S-W-O-T)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p23',
    title: 'Tạo Regex (Biểu thức chính quy)',
    text: 'Viết một biểu thức chính quy (Regex) để trích xuất/kiểm tra [Mô tả mẫu cần tìm, ví dụ: địa chỉ email, số điện thoại VN]. Giải thích chi tiết từng phần của Regex đó hoạt động như thế nào và cung cấp 3 ví dụ chuỗi khớp (match) và 3 ví dụ chuỗi không khớp (mismatch).',
    tags: ['Lập trình', 'Regex', 'Kỹ thuật'],
    tokens: '~250 tokens',
    time: '~5s',
    structure: 'Kỹ thuật (Code + Explain + Examples)',
    category: 'Lập trình'
  },
  {
    id: 'p24',
    title: 'Lên thực đơn ăn kiêng',
    text: 'Tôi là một [Giới tính], [Tuổi] tuổi, nặng [Cân nặng] kg, cao [Chiều cao] cm. Mục tiêu của tôi là [Giảm cân/Tăng cơ] trong 1 tháng. Hãy lên một thực đơn ăn uống trong 7 ngày, đảm bảo lượng calo khoảng [Số calo] kcal/ngày, giàu protein và dễ chuẩn bị.',
    tags: ['Sức khỏe', 'Thực đơn', 'Cá nhân hóa'],
    tokens: '~600 tokens',
    time: '~10s',
    structure: 'Cá nhân hóa (Context + Goal + Plan)',
    category: 'Sáng tạo'
  },
  {
    id: 'p25',
    title: 'Viết SQL Query phức tạp',
    text: 'Cho 2 bảng dữ liệu: Bảng A (id, name, category_id) và Bảng B (id, category_name, status). Hãy viết một câu truy vấn SQL để lấy ra [Yêu cầu dữ liệu, ví dụ: danh sách tên các mục đang active]. Sử dụng JOIN và giải thích logic của câu truy vấn.',
    tags: ['Lập trình', 'SQL', 'Database'],
    tokens: '~200 tokens',
    time: '~4s',
    structure: 'Kỹ thuật (Schema + Query + Explain)',
    category: 'Lập trình'
  },
  {
    id: 'p26',
    title: 'Sáng tác thơ/bài hát',
    text: 'Hãy sáng tác một bài thơ (hoặc lời bài hát) gồm 4 khổ, thể thơ [Lục bát/Tự do/7 chữ], về chủ đề [Chủ đề]. Giọng điệu mang tính [Buồn/Vui tươi/Hào hùng]. Sử dụng các biện pháp tu từ như ẩn dụ và nhân hóa.',
    tags: ['Sáng tạo', 'Thơ ca', 'Nghệ thuật'],
    tokens: '~250 tokens',
    time: '~5s',
    structure: 'Nghệ thuật (Format + Theme + Tone)',
    category: 'Sáng tạo'
  },
  {
    id: 'p27',
    title: 'Tạo kịch bản Chatbot',
    text: 'Thiết kế một luồng hội thoại (kịch bản) cho Chatbot hỗ trợ khách hàng của một cửa hàng [Loại cửa hàng]. Kịch bản cần bao gồm: Lời chào, Xử lý 3 câu hỏi thường gặp nhất, và Cách chuyển tiếp (fallback) tới nhân viên tư vấn khi Chatbot không hiểu.',
    tags: ['Chatbot', 'CSKH', 'Kịch bản'],
    tokens: '~450 tokens',
    time: '~8s',
    structure: 'Luồng logic (Greeting + FAQ + Fallback)',
    category: 'Sáng tạo'
  },
  {
    id: 'p28',
    title: 'Viết bài PR/Thông cáo báo chí',
    text: 'Viết một thông cáo báo chí dài khoảng 500 từ để công bố sự kiện ra mắt sản phẩm [Tên sản phẩm] của công ty [Tên công ty]. Cấu trúc bao gồm: Tiêu đề giật tít, Đoạn tóm tắt (Lead), Chi tiết tính năng nổi bật, Trích dẫn từ CEO, và Thông tin liên hệ.',
    tags: ['PR', 'Báo chí', 'Marketing'],
    tokens: '~550 tokens',
    time: '~9s',
    structure: 'Chuẩn báo chí (Headline + Lead + Body + Quote)',
    category: 'Viết lách'
  },
  {
    id: 'p30',
    title: 'Tối ưu hóa Code (Refactoring)',
    text: 'Đoạn code [Ngôn ngữ] dưới đây đang chạy chậm và khó đọc. Hãy refactor (tối ưu hóa) lại nó để cải thiện hiệu suất (performance) và tuân thủ các nguyên tắc Clean Code (như SOLID). Giải thích những thay đổi bạn đã thực hiện. Code: [Chèn code]',
    tags: ['Lập trình', 'Tối ưu hóa', 'Clean Code'],
    tokens: '~400 tokens',
    time: '~7s',
    structure: 'Kỹ thuật (Code + Refactor + Explain)',
    category: 'Lập trình'
  },
  {
    id: 'p31',
    title: 'Viết mô tả sản phẩm (E-commerce)',
    text: 'Viết một đoạn mô tả sản phẩm hấp dẫn cho [Tên sản phẩm], bán trên sàn thương mại điện tử. Đoạn mô tả cần nêu bật 3 lợi ích chính (không chỉ là tính năng), sử dụng các từ ngữ kích thích mua hàng và có một Call to Action mạnh mẽ ở cuối.',
    tags: ['E-commerce', 'Bán hàng', 'Copywriting'],
    tokens: '~250 tokens',
    time: '~5s',
    structure: 'Thuyết phục (Benefits + Action Words + CTA)',
    category: 'Viết lách'
  },
  {
    id: 'p33',
    title: 'Dịch và giải thích thuật ngữ chuyên ngành',
    text: 'Dịch đoạn văn bản chuyên ngành [Y tế/Kỹ thuật/Tài chính] sau sang tiếng Việt. Với các thuật ngữ chuyên ngành khó hiểu, hãy giữ nguyên từ gốc trong ngoặc đơn và thêm một câu giải thích ngắn gọn ý nghĩa của thuật ngữ đó. Văn bản: [Chèn văn bản]',
    tags: ['Dịch thuật', 'Chuyên ngành', 'Giải thích'],
    tokens: '~350 tokens',
    time: '~6s',
    structure: 'Đa nhiệm (Translate + Annotate)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p34',
    title: 'Tạo kịch bản Podcast',
    text: 'Viết dàn ý kịch bản cho một tập Podcast dài 20 phút về chủ đề [Chủ đề]. Bao gồm: Intro (chào mừng & giới thiệu chủ đề), 3 phân đoạn chính (mỗi phân đoạn có 2 câu hỏi thảo luận), và Outro (tóm tắt & kêu gọi đăng ký).',
    tags: ['Podcast', 'Kịch bản', 'Sáng tạo'],
    tokens: '~400 tokens',
    time: '~7s',
    structure: 'Cấu trúc rõ ràng (Intro + Segments + Outro)',
    category: 'Sáng tạo'
  },
  {
    id: 'p35',
    title: 'Luyện phỏng vấn bằng tiếng Anh',
    text: 'Hãy đóng vai trò là người phỏng vấn cho vị trí [Tên vị trí]. Hãy hỏi tôi từng câu hỏi một bằng tiếng Anh. Đợi tôi trả lời, sau đó nhận xét câu trả lời của tôi (về ngữ pháp, từ vựng và nội dung) rồi mới hỏi câu tiếp theo.',
    tags: ['Tiếng Anh', 'Phỏng vấn', 'Tương tác'],
    tokens: '~Variable',
    time: '~Real-time',
    structure: 'Tương tác (Roleplay + Feedback loop)',
    category: 'Học tập'
  },
  {
    id: 'p36',
    title: 'Viết Dockerfile/Docker Compose',
    text: 'Viết một Dockerfile và file docker-compose.yml cho một ứng dụng [Node.js/Python/PHP] sử dụng database [MySQL/PostgreSQL/MongoDB]. Cấu hình các biến môi trường cần thiết và đảm bảo tối ưu hóa dung lượng image.',
    tags: ['DevOps', 'Docker', 'Lập trình'],
    tokens: '~300 tokens',
    time: '~6s',
    structure: 'Kỹ thuật (Config + Optimization)',
    category: 'Lập trình'
  },
  {
    id: 'p37',
    title: 'Tạo bài đăng Mạng xã hội',
    text: 'Viết 3 mẫu bài đăng Facebook/LinkedIn khác nhau để quảng bá cho [Sự kiện/Sản phẩm]. Mẫu 1: Tập trung vào kể chuyện (Storytelling). Mẫu 2: Tập trung vào số liệu/lợi ích trực tiếp. Mẫu 3: Dạng câu hỏi tương tác. Kèm theo gợi ý hashtag.',
    tags: ['Social Media', 'Marketing', 'Content'],
    tokens: '~350 tokens',
    time: '~6s',
    structure: 'Đa dạng (Story + Data + Interactive)',
    category: 'Viết lách'
  },
  {
    id: 'p38',
    title: 'Giải quyết xung đột nhóm',
    text: 'Đóng vai trò là một chuyên gia tâm lý học tổ chức. Tôi đang gặp xung đột với đồng nghiệp về vấn đề [Mô tả vấn đề]. Hãy tư vấn cho tôi 3 bước cụ thể để bắt đầu cuộc trò chuyện giải quyết xung đột một cách xây dựng, không gây phòng thủ.',
    tags: ['Kỹ năng mềm', 'Tâm lý', 'Giao tiếp'],
    tokens: '~300 tokens',
    time: '~5s',
    structure: 'Tư vấn (Role + Actionable Steps)',
    category: 'Học tập'
  },
  {
    id: 'p39',
    title: 'Tạo dữ liệu giả (Mock Data)',
    text: 'Tạo một mảng JSON chứa 10 bản ghi dữ liệu giả cho đối tượng [Ví dụ: Người dùng, Sản phẩm]. Mỗi bản ghi cần có các trường: id (UUID), name, email, created_at (định dạng ISO 8601), và status (random active/inactive).',
    tags: ['Lập trình', 'Dữ liệu', 'JSON'],
    tokens: '~400 tokens',
    time: '~6s',
    structure: 'Tạo dữ liệu (Schema + Format)',
    category: 'Lập trình'
  },
  {
    id: 'p40',
    title: 'Đánh giá rủi ro dự án',
    text: 'Tôi đang chuẩn bị triển khai dự án [Mô tả ngắn gọn dự án]. Hãy giúp tôi xác định 5 rủi ro tiềm ẩn lớn nhất (về kỹ thuật, tài chính, nhân sự...) và đề xuất kế hoạch dự phòng (mitigation plan) cho từng rủi ro đó.',
    tags: ['Quản lý dự án', 'Rủi ro', 'Kế hoạch'],
    tokens: '~450 tokens',
    time: '~8s',
    structure: 'Phân tích (Identify + Mitigate)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p41',
    title: 'Viết thư giới thiệu (Recommendation Letter)',
    text: 'Viết một bức thư giới thiệu chuyên nghiệp cho [Tên người được giới thiệu], người đã làm việc dưới quyền quản lý của tôi ở vị trí [Vị trí] trong [Số năm] năm. Nhấn mạnh vào khả năng lãnh đạo, sự tận tâm và một thành tích nổi bật là [Thành tích].',
    tags: ['Nhân sự', 'Thư giới thiệu', 'Chuyên nghiệp'],
    tokens: '~300 tokens',
    time: '~5s',
    structure: 'Chuyên nghiệp (Context + Strengths + Achievement)',
    category: 'Viết lách'
  },
  {
    id: 'p42',
    title: 'Tạo câu lệnh Linux (Bash)',
    text: 'Tôi cần một câu lệnh Linux (Bash shell) để thực hiện việc: [Mô tả yêu cầu, ví dụ: tìm tất cả các file .log lớn hơn 100MB và xóa chúng]. Hãy cung cấp câu lệnh và giải thích ý nghĩa của từng cờ (flag) được sử dụng.',
    tags: ['Linux', 'Bash', 'Hệ thống'],
    tokens: '~150 tokens',
    time: '~3s',
    structure: 'Kỹ thuật (Command + Explain)',
    category: 'Lập trình'
  },
  {
    id: 'p43',
    title: 'Sáng tạo tên thương hiệu',
    text: 'Tôi đang khởi nghiệp một công ty về [Lĩnh vực kinh doanh], hướng tới đối tượng khách hàng là [Đối tượng]. Hãy gợi ý 10 tên thương hiệu độc đáo, dễ nhớ. Bao gồm 5 tên tiếng Việt và 5 tên tiếng Anh. Giải thích ngắn gọn ý nghĩa của mỗi tên.',
    tags: ['Khởi nghiệp', 'Branding', 'Sáng tạo'],
    tokens: '~350 tokens',
    time: '~6s',
    structure: 'Sáng tạo (Ideas + Explanations)',
    category: 'Sáng tạo'
  },
  {
    id: 'p45',
    title: 'Viết kịch bản Telesale',
    text: 'Viết một kịch bản gọi điện bán hàng (Telesale) cho sản phẩm [Tên sản phẩm]. Kịch bản cần vượt qua sự từ chối ban đầu (ví dụ: "Tôi đang bận", "Tôi không có tiền"), đặt câu hỏi khơi gợi nhu cầu và chốt sale nhẹ nhàng.',
    tags: ['Bán hàng', 'Telesale', 'Kịch bản'],
    tokens: '~400 tokens',
    time: '~7s',
    structure: 'Thuyết phục (Hook + Objection Handling + Close)',
    category: 'Viết lách'
  },
  {
    id: 'p47',
    title: 'Tạo bài tập thực hành ngôn ngữ',
    text: 'Tạo một đoạn hội thoại ngắn bằng tiếng [Ngôn ngữ] ở trình độ [A1/B1/C1] về chủ đề [Chủ đề]. Sau đó, tạo 5 câu hỏi đọc hiểu và trích xuất 5 từ vựng quan trọng kèm theo nghĩa và ví dụ sử dụng.',
    tags: ['Ngoại ngữ', 'Bài tập', 'Từ vựng'],
    tokens: '~400 tokens',
    time: '~7s',
    structure: 'Giáo dục (Dialogue + Comprehension + Vocab)',
    category: 'Học tập'
  },
  {
    id: 'p48',
    title: 'Phân tích tâm lý nhân vật',
    text: 'Phân tích diễn biến tâm lý của nhân vật [Tên nhân vật] trong tác phẩm [Tên tác phẩm] ở phân đoạn [Mô tả phân đoạn]. Chỉ ra những mâu thuẫn nội tâm và động cơ dẫn đến hành động của nhân vật đó.',
    tags: ['Văn học', 'Phân tích', 'Tâm lý'],
    tokens: '~450 tokens',
    time: '~8s',
    structure: 'Phân tích sâu (Character + Conflict + Motive)',
    category: 'Nghiên cứu'
  },
  {
    id: 'p49',
    title: 'Tạo hợp đồng mẫu',
    text: 'Soạn thảo một mẫu hợp đồng [Loại hợp đồng, ví dụ: Thuê nhà, Cung cấp dịch vụ Freelance] cơ bản theo quy định pháp luật Việt Nam. Bao gồm các điều khoản thiết yếu như: Thông tin các bên, Quyền và nghĩa vụ, Thanh toán, và Giải quyết tranh chấp.',
    tags: ['Pháp lý', 'Hợp đồng', 'Biểu mẫu'],
    tokens: '~700 tokens',
    time: '~12s',
    structure: 'Pháp lý (Standard Clauses + Formal Tone)',
    category: 'Viết lách'
  },
  {
    id: 'p50',
    title: 'Gợi ý quà tặng',
    text: 'Tôi cần mua quà tặng cho [Đối tượng, ví dụ: Mẹ, Sếp nam, Bạn gái] nhân dịp [Dịp lễ/Sinh nhật]. Ngân sách của tôi là khoảng [Số tiền]. Người đó có sở thích là [Sở thích]. Hãy gợi ý 5 món quà ý nghĩa, độc đáo và giải thích tại sao nó phù hợp.',
    tags: ['Đời sống', 'Quà tặng', 'Gợi ý'],
    tokens: '~300 tokens',
    time: '~5s',
    structure: 'Tư vấn (Context + Ideas + Reasons)',
    category: 'Sáng tạo'
  },
];
