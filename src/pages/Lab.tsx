import React, { useState, useCallback, useRef, useEffect } from 'react';
import LabLanding from '../components/LabLanding';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Search, 
  Sparkles, 
  Presentation, 
  Send, 
  Bot, 
  User, 
  Info, 
  Zap, 
  MessageSquare,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  MessageCircle,
  BrainCircuit,
  Palette,
  Volume2,
  Film,
  Globe,
  Layout,
  ImagePlus,
  PenTool,
  ArrowRightLeft,
  Library,
  X,
  Check,
  UserCircle2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROMPT_LIBRARY, PromptData } from '../data/prompts';

// --- Types & Mock Data ---

type AIBlockData = {
  id: string;
  name: string;
  icon: React.ReactNode;
  purpose: string;
  bestFor: string;
  combinations: string[];
  prompts: {
    text: string;
    tags: string[];
  }[];
  color: string;
  category: 'research' | 'synthesis' | 'presentation' | 'image' | 'video' | 'audio' | 'design';
  stats: {
    strengths: string[];
    weaknesses: string[];
  };
  accountStatus: {
    plan: string;
    url?: string;
  };
};

const AI_BLOCKS: Record<string, AIBlockData> = {
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI',
    icon: <Search className="w-5 h-5" />,
    purpose: 'Tìm kiếm và trích dẫn thông tin theo thời gian thực.',
    bestFor: 'Research, fact-checking, citation gathering.',
    combinations: ['Gemini', 'ChatGPT', 'Claude'],
    prompts: [
      { text: 'Tìm kiếm các sự kiện chính trong lịch sử Việt Nam giai đoạn 1945-1975, kèm theo nguồn trích dẫn uy tín.', tags: ['Research', 'Detailed'] },
      { text: 'Tóm tắt các triều đại phong kiến Việt Nam và đặc điểm nổi bật của từng triều đại.', tags: ['Summary', 'Historical'] }
    ],
    color: 'bg-cyan-500',
    category: 'research',
    stats: { strengths: ['Trích dẫn nguồn uy tín', 'Cập nhật thời gian thực', 'Giao diện dễ dùng'], weaknesses: ['Ít sáng tạo nội dung', 'Phụ thuộc vào nguồn web'] },
    accountStatus: { plan: 'Free Plan' }
  },
  copilot: {
    id: 'copilot',
    name: 'Microsoft Copilot',
    icon: <Globe className="w-5 h-5" />,
    purpose: 'Tìm kiếm tích hợp AI và tạo nội dung đa phương tiện.',
    bestFor: 'Web search, document summarization, quick answers.',
    combinations: ['Gamma', 'Canva'],
    prompts: [
      { text: 'Tìm các bài báo mới nhất về khảo cổ học tại Hoàng thành Thăng Long.', tags: ['News', 'Archaeology'] }
    ],
    color: 'bg-blue-600',
    category: 'research',
    stats: { strengths: ['Dùng GPT-4 miễn phí', 'Tích hợp hệ sinh thái Microsoft'], weaknesses: ['Đôi khi phản hồi chậm', 'Giới hạn số lượng câu hỏi'] },
    accountStatus: { plan: 'Free Plan' }
  },
  youcom: {
    id: 'youcom',
    name: 'You.com',
    icon: <Search className="w-5 h-5" />,
    purpose: 'Công cụ tìm kiếm AI cá nhân hóa.',
    bestFor: 'Coding research, personalized search results.',
    combinations: ['ChatGPT', 'Claude'],
    prompts: [
      { text: 'Tìm các nguồn tài liệu học thuật về văn hóa Đông Sơn.', tags: ['Academic', 'Culture'] }
    ],
    color: 'bg-indigo-600',
    category: 'research',
    stats: { strengths: ['Nhiều chế độ AI (Research, Genius)', 'Tốt cho lập trình'], weaknesses: ['Giao diện hơi rối', 'Bản miễn phí giới hạn'] },
    accountStatus: { plan: 'Chưa tạo tài khoản', url: 'https://you.com' }
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    icon: <Sparkles className="w-5 h-5" />,
    purpose: 'Xử lý ngôn ngữ tự nhiên, tổng hợp và sáng tạo nội dung.',
    bestFor: 'Writing, summarizing, brainstorming, coding.',
    combinations: ['Perplexity', 'Gamma', 'Canva'],
    prompts: [
      { text: 'Dựa vào các thông tin lịch sử sau, hãy viết một kịch bản thuyết trình dài 10 phút, giọng văn trang trọng và lôi cuốn.', tags: ['Script', 'Engaging'] },
      { text: 'Tạo dàn ý chi tiết cho bài thuyết trình về chiến thắng Bạch Đằng.', tags: ['Outline', 'Structured'] }
    ],
    color: 'bg-blue-500',
    category: 'synthesis',
    stats: { strengths: ['Tốc độ phản hồi cực nhanh', 'Tích hợp Google Workspace', 'Xử lý ngữ cảnh lớn'], weaknesses: ['Đôi khi từ chối prompt an toàn', 'Logic toán học chưa hoàn hảo'] },
    accountStatus: { plan: 'Gemini Plus' }
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: <MessageCircle className="w-5 h-5" />,
    purpose: 'Trợ lý AI đa năng, xử lý ngôn ngữ, lập trình và phân tích dữ liệu.',
    bestFor: 'Brainstorming, coding, data analysis, general writing.',
    combinations: ['Midjourney', 'Gamma', 'ElevenLabs'],
    prompts: [
      { text: 'Đóng vai một chuyên gia lịch sử, hãy phân tích nguyên nhân và kết quả của chiến thắng Điện Biên Phủ.', tags: ['Analysis', 'Expert'] },
      { text: 'Viết một đoạn code Python để vẽ biểu đồ các sự kiện lịch sử theo dòng thời gian.', tags: ['Coding', 'Data'] }
    ],
    color: 'bg-emerald-600',
    category: 'synthesis',
    stats: { strengths: ['Khả năng suy luận logic xuất sắc', 'Phân tích dữ liệu mạnh mẽ', 'Đa dụng'], weaknesses: ['Bản miễn phí giới hạn tính năng', 'Văn phong đôi khi rập khuôn'] },
    accountStatus: { plan: 'Plus' }
  },
  claude: {
    id: 'claude',
    name: 'Claude 3',
    icon: <BrainCircuit className="w-5 h-5" />,
    purpose: 'Phân tích tài liệu dài, viết văn bản tự nhiên và suy luận logic sâu.',
    bestFor: 'Long-form writing, document analysis, nuanced reasoning.',
    combinations: ['Perplexity', 'Canva'],
    prompts: [
      { text: 'Đọc tài liệu đính kèm và tóm tắt các luận điểm chính về văn hóa Việt Nam thế kỷ 19.', tags: ['Document', 'Summary'] },
      { text: 'Viết một bài luận so sánh nghệ thuật kiến trúc thời Lý và thời Trần với văn phong học thuật.', tags: ['Academic', 'Writing'] }
    ],
    color: 'bg-orange-600',
    category: 'synthesis',
    stats: { strengths: ['Văn phong tự nhiên, giống người', 'Đọc hiểu tài liệu cực dài', 'Ít bị ảo giác'], weaknesses: ['Không tạo được hình ảnh', 'Bộ lọc an toàn quá khắt khe'] },
    accountStatus: { plan: 'Free Plan' }
  },
  gamma: {
    id: 'gamma',
    name: 'Gamma App',
    icon: <Presentation className="w-5 h-5" />,
    purpose: 'Tự động tạo slide thuyết trình từ văn bản.',
    bestFor: 'Presentations, pitch decks, visual storytelling.',
    combinations: ['Gemini', 'ChatGPT'],
    prompts: [
      { text: 'Tạo một bài thuyết trình 10 slide dựa trên nội dung kịch bản sau, sử dụng theme lịch sử, cổ điển.', tags: ['Presentation', 'Visual'] },
      { text: 'Thiết kế slide tóm tắt các cột mốc lịch sử, mỗi slide ít chữ, tập trung vào hình ảnh minh họa.', tags: ['Minimalist', 'Visual'] }
    ],
    color: 'bg-purple-500',
    category: 'presentation',
    stats: { strengths: ['Tạo slide siêu tốc', 'Giao diện đẹp, hiện đại', 'Dễ dàng chỉnh sửa'], weaknesses: ['Khó tùy chỉnh chi tiết nhỏ', 'Export PDF đôi khi bị lỗi font'] },
    accountStatus: { plan: 'Pro' }
  },
  tome: {
    id: 'tome',
    name: 'Tome',
    icon: <Layout className="w-5 h-5" />,
    purpose: 'Kể chuyện bằng AI với định dạng slide tương tác.',
    bestFor: 'Storytelling, visual narratives, pitch decks.',
    combinations: ['ChatGPT', 'Midjourney'],
    prompts: [
      { text: 'Tạo một câu chuyện hình ảnh về hành trình tìm đường cứu nước của Bác Hồ.', tags: ['Story', 'Visual'] }
    ],
    color: 'bg-pink-600',
    category: 'presentation',
    stats: { strengths: ['Tích hợp mô hình 3D & video', 'Thiết kế mang tính kể chuyện cao'], weaknesses: ['Nhiều tính năng bị khóa ở bản Free', 'Ít template truyền thống'] },
    accountStatus: { plan: 'Chưa tạo tài khoản', url: 'https://tome.app' }
  },
  beautifulai: {
    id: 'beautifulai',
    name: 'Beautiful.ai',
    icon: <Presentation className="w-5 h-5" />,
    purpose: 'Thiết kế slide chuyên nghiệp với bố cục tự động.',
    bestFor: 'Business presentations, clean designs.',
    combinations: ['Claude', 'Gemini'],
    prompts: [
      { text: 'Tạo slide báo cáo tiến độ dự án nghiên cứu lịch sử.', tags: ['Report', 'Professional'] }
    ],
    color: 'bg-blue-700',
    category: 'presentation',
    stats: { strengths: ['Tự động căn chỉnh bố cục hoàn hảo', 'Phù hợp môi trường doanh nghiệp'], weaknesses: ['Khả năng tạo nội dung AI yếu hơn Gamma', 'Giá khá cao'] },
    accountStatus: { plan: 'Chưa tạo tài khoản', url: 'https://www.beautiful.ai' }
  },
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    icon: <ImageIcon className="w-5 h-5" />,
    purpose: 'Tạo hình ảnh minh họa chất lượng cao từ văn bản.',
    bestFor: 'Visuals, concept art, slide backgrounds.',
    combinations: ['Gemini', 'Gamma', 'ChatGPT'],
    prompts: [
      { text: 'A cinematic historical illustration of Vietnamese ancient warriors, highly detailed, 8k, unreal engine 5 --ar 16:9', tags: ['Cinematic', 'Historical'] },
      { text: 'Watercolor painting of ancient Vietnamese architecture, peaceful, soft lighting --ar 16:9', tags: ['Watercolor', 'Architecture'] }
    ],
    color: 'bg-pink-500',
    category: 'image',
    stats: { strengths: ['Chất lượng nghệ thuật đỉnh cao', 'Chi tiết cực kỳ sắc nét', 'Phong cách đa dạng'], weaknesses: ['Phải dùng qua Discord', 'Không có bản miễn phí'] },
    accountStatus: { plan: 'Pro' }
  },
  dalle3: {
    id: 'dalle3',
    name: 'DALL-E 3',
    icon: <ImagePlus className="w-5 h-5" />,
    purpose: 'Tạo hình ảnh chính xác theo prompt, tích hợp trong ChatGPT.',
    bestFor: 'Illustrations, diagrams, precise prompt adherence.',
    combinations: ['ChatGPT', 'Canva'],
    prompts: [
      { text: 'Vẽ một bức tranh phong cảnh làng quê Việt Nam thế kỷ 19, có chú bé chăn trâu thổi sáo.', tags: ['Illustration', 'Culture'] }
    ],
    color: 'bg-teal-500',
    category: 'image',
    stats: { strengths: ['Hiểu prompt cực kỳ chính xác', 'Tạo được văn bản trong ảnh', 'Dễ dùng qua ChatGPT'], weaknesses: ['Phong cách hơi "nhựa" (plastic)', 'Ít tùy chỉnh thông số'] },
    accountStatus: { plan: 'Plus (via ChatGPT)' }
  },
  stablediffusion: {
    id: 'stablediffusion',
    name: 'Stable Diffusion',
    icon: <PenTool className="w-5 h-5" />,
    purpose: 'Tạo hình ảnh mã nguồn mở với khả năng kiểm soát tối đa.',
    bestFor: 'Advanced image generation, ControlNet, custom models.',
    combinations: ['Runway', 'Claude'],
    prompts: [
      { text: 'A photorealistic portrait of an ancient Vietnamese king, wearing traditional royal attire, dramatic lighting.', tags: ['Portrait', 'Realistic'] }
    ],
    color: 'bg-purple-700',
    category: 'image',
    stats: { strengths: ['Miễn phí & Mã nguồn mở', 'Kiểm soát tuyệt đối (ControlNet, LoRA)', 'Không bị kiểm duyệt'], weaknesses: ['Cần cấu hình máy tính mạnh', 'Đường cong học tập (learning curve) dốc'] },
    accountStatus: { plan: 'Free Plan' }
  },
  canva: {
    id: 'canva',
    name: 'Canva Magic Studio',
    icon: <Palette className="w-5 h-5" />,
    purpose: 'Thiết kế đồ họa, tạo bài đăng mạng xã hội và slide nhanh chóng.',
    bestFor: 'Social media posts, quick designs, marketing materials.',
    combinations: ['ChatGPT', 'Midjourney'],
    prompts: [
      { text: 'Tạo một infographic về các mốc thời gian quan trọng trong lịch sử Việt Nam.', tags: ['Infographic', 'Design'] },
      { text: 'Thiết kế một poster quảng bá cho buổi triển lãm văn hóa cổ truyền.', tags: ['Poster', 'Marketing'] }
    ],
    color: 'bg-blue-400',
    category: 'design',
    stats: { strengths: ['All-in-one design tool', 'Dễ sử dụng cho người mới', 'Nhiều template'], weaknesses: ['AI generation chưa chuyên sâu', 'Thiết kế dễ bị trùng lặp'] },
    accountStatus: { plan: 'Canva Pro' }
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    icon: <Volume2 className="w-5 h-5" />,
    purpose: 'Chuyển đổi văn bản thành giọng nói (TTS) chân thực và nhân bản giọng nói.',
    bestFor: 'Voiceovers, audiobooks, video narration.',
    combinations: ['ChatGPT', 'Runway', 'Gamma'],
    prompts: [
      { text: 'Đọc đoạn văn bản sau với giọng nam trầm ấm, truyền cảm, tốc độ vừa phải.', tags: ['Voiceover', 'Narration'] },
      { text: 'Tạo giọng đọc cho một video tài liệu lịch sử, mang âm hưởng hào hùng.', tags: ['Documentary', 'Epic'] }
    ],
    color: 'bg-slate-800',
    category: 'audio',
    stats: { strengths: ['Giọng đọc tự nhiên nhất', 'Hỗ trợ nhiều ngôn ngữ (có Tiếng Việt)', 'Voice cloning xuất sắc'], weaknesses: ['Bản miễn phí rất ít ký tự', 'Giá khá đắt cho người dùng nhiều'] },
    accountStatus: { plan: 'Chưa tạo tài khoản', url: 'https://elevenlabs.io' }
  },
  runway: {
    id: 'runway',
    name: 'Runway Gen-2',
    icon: <Film className="w-5 h-5" />,
    purpose: 'Tạo và chỉnh sửa video bằng AI từ văn bản hoặc hình ảnh.',
    bestFor: 'Video generation, visual effects, storytelling.',
    combinations: ['Midjourney', 'ElevenLabs', 'Claude'],
    prompts: [
      { text: 'A cinematic panning shot of an ancient Vietnamese temple in the misty mountains, photorealistic.', tags: ['Cinematic', 'Video'] },
      { text: 'Animate this historical painting, making the river flow and the leaves rustle gently.', tags: ['Animation', 'VFX'] }
    ],
    color: 'bg-indigo-500',
    category: 'video',
    stats: { strengths: ['Tạo video từ ảnh cực tốt (Image-to-Video)', 'Nhiều công cụ chỉnh sửa AI (Inpainting, Motion Brush)'], weaknesses: ['Video đôi khi bị biến dạng (morphing)', 'Giới hạn độ dài video ngắn'] },
    accountStatus: { plan: 'Free Plan' }
  }
};



// --- Custom Node Component ---
const CustomNode = ({ data, selected }: any) => {
  const blockData = AI_BLOCKS[data.blockId as keyof typeof AI_BLOCKS];
  
  if (!blockData) return null;

  return (
    <div className={`px-4 py-3 shadow-lg rounded-xl border-2 bg-white flex flex-col gap-2 min-w-[200px] transition-all ${selected ? 'border-blue-500 shadow-blue-100' : 'border-slate-200'}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400 border-2 border-white" />
      <div className="flex items-center gap-3">
        <div className={`${blockData.color} text-white p-2 rounded-lg`}>
          {blockData.icon}
        </div>
        <div>
          <div className="font-bold text-slate-800 text-sm">{blockData.name}</div>
          <div className="text-xs text-slate-500">{data.label}</div>
        </div>
      </div>
      {data.appliedPrompt && (
        <div className="mt-1 p-2 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600 italic line-clamp-2">
          "{data.appliedPrompt}"
        </div>
      )}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-slate-400 border-2 border-white" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// --- Main Lab Component ---
export default function Lab() {
  const [labStage, setLabStage] = useState<'landing' | 'builder'>('landing');
  const [pendingChatSeed, setPendingChatSeed] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [previewBlockId, setPreviewBlockId] = useState<string | null>(null);

  // Prompt Library state
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const [selectedPromptsToCompare, setSelectedPromptsToCompare] = useState<string[]>([]);

  // Chatbot state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Chào bạn! Tôi có thể giúp bạn tạo workflow AI. Hãy thử yêu cầu: "Thiết kế 1 bài thuyết trình về chủ đề Lịch sử Việt Nam"' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } } as Edge, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setPreviewBlockId(node.data.blockId as string);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setPreviewBlockId(null);
  }, []);

  const handleDeleteNode = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
      setPreviewBlockId(null);
    }
  }, [selectedNodeId, setNodes, setEdges]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-send frame chatSeed when entering builder from LabLanding
  useEffect(() => {
    if (!pendingChatSeed) return;
    const seed = pendingChatSeed;
    setPendingChatSeed(null);
    setMessages(prev => [...prev, { role: 'user', text: seed }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const lower = seed.toLowerCase();
      if (lower.includes('thuyết trình') || lower.includes('lịch sử')) {
        setMessages(prev => [...prev, { role: 'bot', text: 'Tôi đã tạo workflow hoàn chỉnh cho bài thuyết trình Lịch sử Việt Nam! Xem trên canvas nhé.' }]);
        setNodes([
          { id: 'node-1', type: 'custom', position: { x: 100, y: 200 }, data: { blockId: 'perplexity', label: 'Bước 1: Tìm & trích dẫn' } },
          { id: 'node-2', type: 'custom', position: { x: 400, y: 200 }, data: { blockId: 'gemini', label: 'Bước 2: Tổng hợp nội dung' } },
          { id: 'node-3', type: 'custom', position: { x: 700, y: 100 }, data: { blockId: 'gamma', label: 'Bước 3: Tạo slide' } },
          { id: 'node-4', type: 'custom', position: { x: 700, y: 300 }, data: { blockId: 'midjourney', label: 'Bước 4: Tạo hình ảnh' } },
        ] as Node[]);
        setEdges([
          { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
          { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
          { id: 'e2-4', source: 'node-2', target: 'node-4', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
        ] as Edge[]);
        setSelectedNodeId('node-1');
        setPreviewBlockId('perplexity');
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Đã nhận yêu cầu! Kéo thả các AI Block từ bảng bên trái vào canvas để bắt đầu xây dựng workflow của bạn.' }]);
      }
    }, 1200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingChatSeed]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    // Simple if-else logic for demo
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('thuyết trình') || lowerMsg.includes('lịch sử')) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: 'Tôi đã tạo một workflow hoàn chỉnh cho bài thuyết trình Lịch sử Việt Nam của bạn. Xem trên canvas nhé!' 
        }]);
        
        // Generate the workflow
        const newNodes: Node[] = [
          {
            id: 'node-1',
            type: 'custom',
            position: { x: 100, y: 200 },
            data: { blockId: 'perplexity', label: 'Bước 1: Tìm & trích dẫn' },
          },
          {
            id: 'node-2',
            type: 'custom',
            position: { x: 400, y: 200 },
            data: { blockId: 'gemini', label: 'Bước 2: Tổng hợp nội dung' },
          },
          {
            id: 'node-3',
            type: 'custom',
            position: { x: 700, y: 100 },
            data: { blockId: 'gamma', label: 'Bước 3: Tạo slide' },
          },
          {
            id: 'node-4',
            type: 'custom',
            position: { x: 700, y: 300 },
            data: { blockId: 'midjourney', label: 'Bước 4: Tạo hình ảnh' },
          }
        ];
        
        const newEdges: Edge[] = [
          {
            id: 'e1-2',
            source: 'node-1',
            target: 'node-2',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
          },
          {
            id: 'e2-3',
            source: 'node-2',
            target: 'node-3',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
          },
          {
            id: 'e2-4',
            source: 'node-2',
            target: 'node-4',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
          }
        ];
        
        setNodes(newNodes);
        setEdges(newEdges);
        // Auto select first node to show details
        setSelectedNodeId('node-1');
        setPreviewBlockId('perplexity');
      } else {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: 'Xin lỗi, tôi chỉ là bản demo. Hãy thử nhập: "Thiết kế 1 bài thuyết trình về chủ đề Lịch sử Việt Nam"' 
        }]);
      }
    }, 1500);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const blockId = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof blockId === 'undefined' || !blockId) {
        return;
      }

      // We don't have the react flow instance to project coordinates easily without useReactFlow hook,
      // so for this simple demo we'll just use a rough estimate or fixed position.
      // A better way is to use the react flow instance, but this is fine for a quick demo.
      const position = {
        x: event.clientX - 300, // rough estimate based on sidebar width
        y: event.clientY - 100,
      };

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'custom',
        position,
        data: { blockId, label: 'Custom Step' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const onDragStart = (event: React.DragEvent, blockId: string) => {
    event.dataTransfer.setData('application/reactflow', blockId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleReplaceNode = useCallback((newBlockId: string) => {
    if (selectedNodeId) {
      setNodes((nds) => nds.map((n) => {
        if (n.id === selectedNodeId) {
          return { ...n, data: { ...n.data, blockId: newBlockId } };
        }
        return n;
      }));
      setPreviewBlockId(newBlockId);
    }
  }, [selectedNodeId, setNodes]);

  const handleApplyPrompt = useCallback((promptText: string) => {
    if (selectedNodeId) {
      setNodes((nds) => nds.map((n) => {
        if (n.id === selectedNodeId) {
          return { ...n, data: { ...n.data, appliedPrompt: promptText } };
        }
        return n;
      }));
    }
  }, [selectedNodeId, setNodes]);

  const handleTogglePromptCompare = useCallback((id: string) => {
    setSelectedPromptsToCompare(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[0], id];
    });
  }, []);

  const activeBlock = previewBlockId ? AI_BLOCKS[previewBlockId] : null;
  const alternatives = activeBlock && selectedNodeId
    ? Object.values(AI_BLOCKS).filter(b => b.category === activeBlock.category && b.id !== activeBlock.id)
    : [];

  // Show landing/gallery before the builder
  if (labStage === 'landing') {
    return (
      <div className="h-[calc(100vh-73px)]">
        <LabLanding
          onEnterBuilder={(chatSeed) => {
            if (chatSeed) setPendingChatSeed(chatSeed);
            setLabStage('builder');
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)] bg-slate-50 overflow-hidden">
      
      {/* Left Sidebar - Palette (Optional for demo, but good for UI completeness) */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm hidden md:flex">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            AI Blocks
          </h2>
          <p className="text-xs text-slate-500 mt-1">Kéo thả để tạo workflow</p>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {Object.values(AI_BLOCKS).map(block => (
            <div 
              key={block.id}
              className={`p-3 border rounded-xl flex items-center gap-3 cursor-grab hover:border-blue-300 hover:shadow-sm transition-all bg-white ${previewBlockId === block.id && !selectedNodeId ? 'border-blue-500 shadow-blue-100' : 'border-slate-200'}`}
              draggable
              onDragStart={(e) => onDragStart(e, block.id)}
              onClick={() => {
                setSelectedNodeId(null);
                setPreviewBlockId(block.id);
              }}
            >
              <div className={`${block.color} text-white p-2 rounded-lg`}>
                {block.icon}
              </div>
              <div className="font-medium text-sm text-slate-700">{block.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
        >
          <Background color="#cbd5e1" gap={16} />
          <Controls className="bg-white border-slate-200 shadow-sm rounded-lg" />
          <MiniMap className="rounded-lg border border-slate-200 shadow-sm" />
        </ReactFlow>

        {/* Floating Details Panel */}
        <AnimatePresence>
          {activeBlock && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-20 flex flex-col max-h-[400px]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`${activeBlock.color} text-white p-2 rounded-lg`}>
                    {activeBlock.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{activeBlock.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Thông tin chi tiết
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedNodeId && (
                    <button 
                      onClick={handleDeleteNode}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedNodeId(null);
                      setPreviewBlockId(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100"
                  >
                    Đóng
                  </button>
                </div>
              </div>
              
              <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                {/* Account Status */}
                <div className="mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Trạng thái tài khoản:</span>
                    <span className={`text-sm font-bold ${activeBlock.accountStatus.plan === 'Chưa tạo tài khoản' ? 'text-slate-500' : 'text-emerald-600'}`}>
                      {activeBlock.accountStatus.plan}
                    </span>
                  </div>
                  {activeBlock.accountStatus.plan === 'Chưa tạo tài khoản' && activeBlock.accountStatus.url && (
                    <a 
                      href={activeBlock.accountStatus.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      Tạo tài khoản <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mục đích</h4>
                    <p className="text-sm text-slate-700">{activeBlock.purpose}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phù hợp nhất cho</h4>
                    <p className="text-sm text-slate-700">{activeBlock.bestFor}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý kết hợp</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeBlock.combinations.map((combo, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> {combo}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" /> Gợi ý Prompt
                    </h4>
                    <button 
                      onClick={() => setIsPromptLibraryOpen(true)}
                      className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700 font-medium"
                    >
                      <Search className="w-3 h-3" /> Thư viện Prompt
                    </button>
                  </div>
                  <div className="space-y-3">
                    {activeBlock.prompts.map((prompt, idx) => (
                      <div key={idx} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-slate-700 leading-relaxed pr-4">"{prompt.text}"</p>
                          <button 
                            onClick={() => handleApplyPrompt(prompt.text)}
                            className="shrink-0 px-2 py-1 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded text-xs font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {prompt.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 bg-white text-blue-600 text-[10px] font-bold rounded border border-blue-200 uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alternatives & Comparison */}
                {alternatives.length > 0 && (
                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                      Các công cụ thay thế (Cùng nhóm)
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Công cụ</th>
                            <th className="px-4 py-3 font-semibold">Điểm mạnh</th>
                            <th className="px-4 py-3 font-semibold">Điểm yếu</th>
                            <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="bg-blue-50/30">
                            <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                              <div className={`${activeBlock.color} text-white p-1 rounded`}>{activeBlock.icon}</div>
                              {activeBlock.name} <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase">Hiện tại</span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              <ul className="list-disc pl-4 space-y-1">{activeBlock.stats.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              <ul className="list-disc pl-4 space-y-1">{activeBlock.stats.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-xs font-medium text-slate-400">Đang chọn</span>
                            </td>
                          </tr>
                          {alternatives.map(alt => (
                            <tr key={alt.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                                <div className={`${alt.color} text-white p-1 rounded`}>{alt.icon}</div>
                                {alt.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                <ul className="list-disc pl-4 space-y-1">{alt.stats.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                <ul className="list-disc pl-4 space-y-1">{alt.stats.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button 
                                  onClick={() => handleReplaceNode(alt.id)}
                                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-md text-xs font-medium transition-all"
                                >
                                  Thay thế
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Sidebar - Chatbot */}
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col z-10 shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-blue-600 text-white">
          <h2 className="font-bold flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Workflow Assistant
          </h2>
          <p className="text-xs text-blue-100 mt-1">Mô tả workflow bạn muốn tạo</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập yêu cầu..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm transition-all outline-none"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-slate-400 text-center">
            Gợi ý: "Thiết kế 1 bài thuyết trình về chủ đề Lịch sử Việt Nam"
          </div>
        </div>
      </div>

      {/* Prompt Library Modal */}
      {isPromptLibraryOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Library className="w-5 h-5 text-blue-500" />
                Thư viện Prompt
              </h3>
              <button onClick={() => { setIsPromptLibraryOpen(false); setSelectedPromptsToCompare([]); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Prompt List */}
              <div className={`p-4 overflow-y-auto ${selectedPromptsToCompare.length === 2 ? 'md:w-1/3 border-r border-slate-100' : 'w-full'}`}>
                <p className="text-sm text-slate-500 mb-4">Chọn 2 prompt để xem bảng so sánh chi tiết.</p>
                <div className="space-y-3">
                  {PROMPT_LIBRARY.map(prompt => {
                    const isSelected = selectedPromptsToCompare.includes(prompt.id);
                    return (
                      <div 
                        key={prompt.id} 
                        className={`p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                        onClick={() => handleTogglePromptCompare(prompt.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-sm text-slate-800">{prompt.title}</h4>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'}`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{prompt.text}</p>
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comparison View */}
              {selectedPromptsToCompare.length === 2 && (
                <div className="md:w-2/3 p-6 overflow-y-auto bg-slate-50">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                    So sánh Prompt
                  </h4>
                  
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="p-3 w-1/4 font-semibold border-b border-r border-slate-200">Tiêu chí</th>
                          <th className="p-3 w-3/8 font-semibold border-b border-r border-slate-200 text-blue-700">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.title}</th>
                          <th className="p-3 w-3/8 font-semibold border-b border-slate-200 text-emerald-700">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.title}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-medium text-slate-700 border-r border-slate-200 bg-slate-50">Nội dung</td>
                          <td className="p-3 border-r border-slate-200 text-slate-600 italic">"{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.text}"</td>
                          <td className="p-3 text-slate-600 italic">"{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.text}"</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-slate-700 border-r border-slate-200 bg-slate-50">Cấu trúc</td>
                          <td className="p-3 border-r border-slate-200"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.structure}</span></td>
                          <td className="p-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.structure}</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-slate-700 border-r border-slate-200 bg-slate-50">Token tiêu thụ (Ước tính)</td>
                          <td className="p-3 border-r border-slate-200 font-mono text-xs text-slate-600">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.tokens}</td>
                          <td className="p-3 font-mono text-xs text-slate-600">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.tokens}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-slate-700 border-r border-slate-200 bg-slate-50">Thời gian phản hồi</td>
                          <td className="p-3 border-r border-slate-200 font-mono text-xs text-slate-600">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.time}</td>
                          <td className="p-3 font-mono text-xs text-slate-600">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.time}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-slate-700 border-r border-slate-200 bg-slate-50">Thao tác</td>
                          <td className="p-3 border-r border-slate-200">
                            <button 
                              onClick={() => {
                                handleApplyPrompt(PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.text || '');
                                setIsPromptLibraryOpen(false);
                              }}
                              className="w-full py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                            >
                              Apply Prompt Này
                            </button>
                          </td>
                          <td className="p-3">
                            <button 
                              onClick={() => {
                                handleApplyPrompt(PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.text || '');
                                setIsPromptLibraryOpen(false);
                              }}
                              className="w-full py-1.5 bg-emerald-600 text-white rounded-md text-xs font-medium hover:bg-emerald-700"
                            >
                              Apply Prompt Này
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
