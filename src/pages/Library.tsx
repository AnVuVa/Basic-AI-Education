import {
  Search, Copy, CheckCircle2, ExternalLink, Filter, Newspaper, Sparkles,
  BookOpen, ArrowRightLeft, X, Check, Pencil, Upload, Send,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROMPT_LIBRARY, PromptData } from '../data/prompts';

// ── Edit & Publish modal ──────────────────────────────────────────

function EditPublishModal({
  prompt,
  onClose,
}: {
  prompt: PromptData;
  onClose: () => void;
}) {
  const [text, setText] = useState(prompt.text);
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/60 bg-slate-800/60">
          <Pencil size={16} className="text-violet-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-slate-100 truncate">{prompt.title}</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Chỉnh sửa rồi sao chép hoặc xuất bản lên thư viện hệ thống</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Category + tags */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/40">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-900/30 text-orange-400 font-bold uppercase tracking-wider">
            {prompt.category}
          </span>
          {prompt.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700 text-slate-400">{tag}</span>
          ))}
        </div>

        {/* Editable textarea */}
        <div className="px-5 pt-4 pb-2">
          <label className="block text-[11px] text-slate-500 uppercase tracking-wide mb-2">Nội dung prompt</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={9}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
          <p className="text-[10px] text-slate-600 mt-1">
            {text.length} ký tự &nbsp;·&nbsp; ~{Math.ceil(text.split(/\s+/).length * 1.3)} tokens ước tính
          </p>
        </div>

        {/* Published success banner */}
        <AnimatePresence>
          {published && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-5 mb-2 px-4 py-3 bg-green-900/30 border border-green-700/40 rounded-xl flex items-center gap-2"
            >
              <CheckCircle2 size={14} className="text-green-400 shrink-0" />
              <span className="text-xs text-green-300">
                Đã gửi để duyệt — prompt của bạn sẽ được xem xét và thêm vào thư viện hệ thống.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-700/60 bg-slate-800/40">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              copied
                ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
            }`}
          >
            {copied ? <><CheckCircle2 size={14} /> Đã chép</> : <><Copy size={14} /> Sao chép</>}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-colors">
              Đóng
            </button>
            {!published ? (
              <button
                onClick={handlePublish}
                disabled={publishing || text.trim().length < 10}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-sm font-medium text-white transition-colors"
              >
                {publishing
                  ? <><Send size={14} className="animate-pulse" /> Đang gửi...</>
                  : <><Upload size={14} /> Xuất bản lên thư viện</>}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-green-400 font-medium">
                <CheckCircle2 size={14} /> Đã xuất bản
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Library page ─────────────────────────────────────────────

export default function Library() {
  const [activeTab, setActiveTab] = useState('prompts');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPromptsToCompare, setSelectedPromptsToCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptData | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTogglePromptCompare = (id: string) => {
    setSelectedPromptsToCompare(prev => {
      if (prev.includes(id)) return prev.filter(pId => pId !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id];
    });
  };

  const categories = ['Tất cả', ...Array.from(new Set(PROMPT_LIBRARY.map(p => p.category)))];

  const newsArticles = [
    {
      id: 1,
      title: 'EU chính thức thông qua Đạo luật Trí tuệ Nhân tạo (AI Act)',
      date: '15/03/2026',
      source: 'Tech & Law Journal',
      summary: 'Đạo luật toàn diện đầu tiên trên thế giới về AI đã được thông qua, phân loại các hệ thống AI theo mức độ rủi ro và đặt ra các quy định nghiêm ngặt về minh bạch dữ liệu và bản quyền.',
      tags: ['Pháp lý', 'EU', 'Minh bạch'],
    },
    {
      id: 2,
      title: 'Tranh cãi bản quyền: Các họa sĩ thắng kiện nền tảng AI tạo ảnh',
      date: '10/03/2026',
      source: 'Creative Rights News',
      summary: 'Một phán quyết mang tính bước ngoặt yêu cầu các công ty phát triển AI phải bồi thường và gỡ bỏ các tác phẩm nghệ thuật được sử dụng để huấn luyện mô hình mà không có sự cho phép của tác giả.',
      tags: ['Bản quyền', 'Nghệ thuật', 'Kiện tụng'],
    },
    {
      id: 3,
      title: 'Phát hiện công cụ Deepfake mới có khả năng vượt qua xác thực sinh trắc học',
      date: '05/03/2026',
      source: 'CyberSecurity Weekly',
      summary: 'Các chuyên gia bảo mật cảnh báo về một thế hệ Deepfake mới có thể đánh lừa các hệ thống nhận diện khuôn mặt và giọng nói của ngân hàng, đặt ra thách thức lớn cho an ninh mạng.',
      tags: ['Deepfake', 'Bảo mật', 'Rủi ro'],
    },
  ];

  const filteredPrompts = useMemo(() => {
    return PROMPT_LIBRARY.filter(prompt => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'Tất cả' || prompt.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0a20] via-[#0d0d2b] to-[#071428] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Thư viện Học liệu & Prompt</h1>
          <p className="text-slate-400">Khám phá kho prompt chuẩn mực và cập nhật tin tức đạo đức AI mới nhất.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-slate-700/60 mb-8">
          <button
            className={`flex items-center gap-2 px-8 py-4 font-semibold text-base border-b-2 transition-colors ${activeTab === 'prompts' ? 'border-violet-400 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('prompts')}
          >
            <Sparkles size={18} /> Prompt Hub
          </button>
          <button
            className={`flex items-center gap-2 px-8 py-4 font-semibold text-base border-b-2 transition-colors ${activeTab === 'news' ? 'border-violet-400 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={18} /> Bản tin AI
          </button>
        </div>

        {/* ── Prompt Hub ── */}
        {activeTab === 'prompts' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* Search + Filter bar */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm prompt..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                <Filter size={16} className="text-slate-500 shrink-0 hidden md:block ml-1" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPrompts.length > 0 ? (
                filteredPrompts.map(prompt => {
                  const isSelected = selectedPromptsToCompare.includes(prompt.id);
                  return (
                    <div
                      key={prompt.id}
                      className={`bg-slate-800/60 rounded-2xl border ${isSelected ? 'border-violet-500 ring-2 ring-violet-500/25' : 'border-slate-700/60 hover:border-slate-600'} transition-all overflow-hidden flex flex-col group relative`}
                    >
                      {/* Compare checkbox */}
                      <button
                        onClick={() => handleTogglePromptCompare(prompt.id)}
                        title="Chọn để so sánh"
                        className={`absolute top-4 right-4 z-10 w-6 h-6 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-violet-500 border-violet-500 text-white' : 'bg-slate-700 border-slate-600 text-transparent hover:border-violet-400'}`}
                      >
                        <Check size={13} />
                      </button>

                      <div className="p-5 flex-1">
                        <div className="flex items-center mb-3 pr-8">
                          <span className="bg-orange-900/30 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {prompt.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-100 mb-3 pr-8 leading-snug">{prompt.title}</h3>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {prompt.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-medium">{tag}</span>
                          ))}
                        </div>

                        <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 text-xs text-slate-400 font-mono leading-relaxed h-28 overflow-y-auto mb-3">
                          {prompt.text}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900/50 border border-slate-700/40 p-2 rounded-lg">
                            <span className="block text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Cấu trúc</span>
                            <span className="text-slate-300 font-medium truncate block text-[10px]" title={prompt.structure}>{prompt.structure}</span>
                          </div>
                          <div className="bg-slate-900/50 border border-slate-700/40 p-2 rounded-lg">
                            <span className="block text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Token · Thời gian</span>
                            <span className="text-slate-300 font-medium text-[10px]">{prompt.tokens} · {prompt.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="px-4 py-3 border-t border-slate-700/40 bg-slate-900/30 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-600 font-medium">Đã xác minh</span>
                        <div className="flex items-center gap-2">
                          {/* Edit button */}
                          <button
                            onClick={() => setEditingPrompt(prompt)}
                            title="Chỉnh sửa & Xuất bản"
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-violet-700/60 border border-slate-600 hover:border-violet-500/60 text-slate-300 hover:text-white transition-colors"
                          >
                            <Pencil size={12} /> Chỉnh sửa
                          </button>
                          {/* Copy button */}
                          <button
                            onClick={() => handleCopy(prompt.id, prompt.text)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${copiedId === prompt.id ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-400' : 'bg-slate-700 border-slate-600 text-slate-300 hover:text-sky-400 hover:border-sky-600/50'}`}
                          >
                            {copiedId === prompt.id ? <><CheckCircle2 size={12} /> Đã chép</> : <><Copy size={12} /> Sao chép</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16 text-slate-500">
                  <BookOpen size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Không tìm thấy prompt nào phù hợp.</p>
                </div>
              )}
            </div>

            {/* Floating Compare Bar */}
            {selectedPromptsToCompare.length > 0 && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-5 z-40"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-violet-500/20 text-violet-400 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                    {selectedPromptsToCompare.length}
                  </div>
                  <span className="text-sm font-medium">prompt đã chọn</span>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-700 pl-5">
                  <button onClick={() => setSelectedPromptsToCompare([])} className="text-slate-400 hover:text-white text-sm transition-colors px-2 py-1.5">
                    Bỏ chọn
                  </button>
                  <button
                    disabled={selectedPromptsToCompare.length !== 2}
                    onClick={() => setIsCompareModalOpen(true)}
                    className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <ArrowRightLeft size={14} /> So sánh ngay
                  </button>
                </div>
              </motion.div>
            )}

            {/* Comparison Modal */}
            {isCompareModalOpen && selectedPromptsToCompare.length === 2 && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                >
                  <div className="p-5 border-b border-slate-700/60 flex justify-between items-center bg-slate-800/60">
                    <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                      <ArrowRightLeft className="w-5 h-5 text-violet-400" /> So sánh Prompt
                    </h3>
                    <button onClick={() => setIsCompareModalOpen(false)} className="text-slate-400 hover:text-slate-200 bg-slate-700 p-1.5 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="overflow-y-auto p-6">
                    <div className="border border-slate-700/60 rounded-2xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800 text-slate-400">
                          <tr>
                            <th className="p-4 w-1/5 font-semibold border-b border-r border-slate-700/60">Tiêu chí</th>
                            <th className="p-4 w-2/5 font-bold border-b border-r border-slate-700/60 text-blue-400">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.title}
                            </th>
                            <th className="p-4 w-2/5 font-bold border-b border-slate-700/60 text-emerald-400">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.title}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/40">
                          {[
                            {
                              label: 'Nội dung',
                              render: (id: string) => (
                                <span className="font-mono text-xs text-slate-300 leading-relaxed">
                                  {PROMPT_LIBRARY.find(p => p.id === id)?.text}
                                </span>
                              ),
                            },
                            {
                              label: 'Tags',
                              render: (id: string) => (
                                <div className="flex flex-wrap gap-1.5">
                                  {PROMPT_LIBRARY.find(p => p.id === id)?.tags.map(tag => (
                                    <span key={tag} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md">{tag}</span>
                                  ))}
                                </div>
                              ),
                            },
                            {
                              label: 'Cấu trúc',
                              render: (id: string, idx: number) => (
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${idx === 0 ? 'bg-blue-900/30 text-blue-300' : 'bg-emerald-900/30 text-emerald-300'}`}>
                                  {PROMPT_LIBRARY.find(p => p.id === id)?.structure}
                                </span>
                              ),
                            },
                            {
                              label: 'Token (Ước tính)',
                              render: (id: string) => (
                                <span className="font-mono text-sm text-slate-300">
                                  {PROMPT_LIBRARY.find(p => p.id === id)?.tokens}
                                </span>
                              ),
                            },
                            {
                              label: 'Thời gian phản hồi',
                              render: (id: string) => (
                                <span className="font-mono text-sm text-slate-300">
                                  {PROMPT_LIBRARY.find(p => p.id === id)?.time}
                                </span>
                              ),
                            },
                            {
                              label: 'Thao tác',
                              render: (id: string, idx: number) => (
                                <button
                                  onClick={() => handleCopy(id, PROMPT_LIBRARY.find(p => p.id === id)?.text || '')}
                                  className={`w-full py-2 rounded-xl text-xs font-bold border-2 flex items-center justify-center gap-2 transition-colors ${idx === 0 ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20' : 'border-emerald-600 text-emerald-400 hover:bg-emerald-900/20'}`}
                                >
                                  {copiedId === id ? <><CheckCircle2 size={14} /> Đã chép</> : <><Copy size={14} /> Sao chép</>}
                                </button>
                              ),
                            },
                          ].map(row => (
                            <tr key={row.label}>
                              <td className="p-4 font-medium text-slate-400 border-r border-slate-700/60 bg-slate-800/40 align-top">{row.label}</td>
                              <td className="p-4 border-r border-slate-700/60 align-top">{row.render(selectedPromptsToCompare[0], 0)}</td>
                              <td className="p-4 align-top">{row.render(selectedPromptsToCompare[1], 1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── News Feed ── */}
        {activeTab === 'news' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-orange-900/20 border border-orange-700/40 rounded-xl p-4 mb-8 flex gap-3 items-start">
              <div className="bg-orange-900/40 text-orange-400 p-2 rounded-lg shrink-0">
                <Newspaper size={18} />
              </div>
              <div>
                <h4 className="font-bold text-orange-300 mb-1 text-sm">Dữ liệu DEMO (Thử nghiệm)</h4>
                <p className="text-xs text-orange-400/80 leading-relaxed">
                  Các bản tin dưới đây là dữ liệu mô phỏng nhằm mục đích trình diễn. Admin và Moderator có thể cập nhật nội dung thực tế tại khu vực này.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {newsArticles.map(article => (
                <div key={article.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-violet-400">{article.source}</span>
                    <span>·</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-3 hover:text-violet-300 transition-colors cursor-pointer leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-5 leading-relaxed">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
                      Đọc tiếp <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit & Publish Modal */}
      {editingPrompt && (
        <EditPublishModal
          prompt={editingPrompt}
          onClose={() => setEditingPrompt(null)}
        />
      )}
    </div>
  );
}
