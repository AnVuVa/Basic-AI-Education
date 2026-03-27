import { Search, Copy, CheckCircle2, ExternalLink, Filter, Newspaper, Sparkles, BookOpen, ArrowRightLeft, X, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { PROMPT_LIBRARY, PromptData } from '../data/prompts';

export default function Library() {
  const [activeTab, setActiveTab] = useState('prompts');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPromptsToCompare, setSelectedPromptsToCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTogglePromptCompare = (id: string) => {
    setSelectedPromptsToCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(pId => pId !== id);
      }
      if (prev.length < 2) {
        return [...prev, id];
      }
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
      tags: ['Pháp lý', 'EU', 'Minh bạch']
    },
    {
      id: 2,
      title: 'Tranh cãi bản quyền: Các họa sĩ thắng kiện nền tảng AI tạo ảnh',
      date: '10/03/2026',
      source: 'Creative Rights News',
      summary: 'Một phán quyết mang tính bước ngoặt yêu cầu các công ty phát triển AI phải bồi thường và gỡ bỏ các tác phẩm nghệ thuật được sử dụng để huấn luyện mô hình mà không có sự cho phép của tác giả.',
      tags: ['Bản quyền', 'Nghệ thuật', 'Kiện tụng']
    },
    {
      id: 3,
      title: 'Phát hiện công cụ Deepfake mới có khả năng vượt qua xác thực sinh trắc học',
      date: '05/03/2026',
      source: 'CyberSecurity Weekly',
      summary: 'Các chuyên gia bảo mật cảnh báo về một thế hệ Deepfake mới có thể đánh lừa các hệ thống nhận diện khuôn mặt và giọng nói của ngân hàng, đặt ra thách thức lớn cho an ninh mạng.',
      tags: ['Deepfake', 'Bảo mật', 'Rủi ro']
    }
  ];

  const filteredPrompts = useMemo(() => {
    return PROMPT_LIBRARY.filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'Tất cả' || prompt.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Thư viện Học liệu & Prompt</h1>
          <p className="text-slate-600">Khám phá thư viện câu lệnh (prompt) chuẩn mực và cập nhật các tin tức mới nhất về đạo đức, pháp lý AI.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-slate-200 mb-8">
          <button 
            className={`flex items-center gap-2 px-8 py-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'prompts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('prompts')}
          >
            <Sparkles size={20} /> Prompt Hub
          </button>
          <button 
            className={`flex items-center gap-2 px-8 py-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'news' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={20} /> Bản tin AI
          </button>
        </div>

        {/* Content: Prompt Hub */}
        {activeTab === 'prompts' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm prompt..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Filter size={20} className="text-slate-400 shrink-0 hidden md:block ml-2" />
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.length > 0 ? (
                filteredPrompts.map(prompt => {
                  const isSelected = selectedPromptsToCompare.includes(prompt.id);
                  return (
                    <div key={prompt.id} className={`bg-white rounded-2xl border ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'} shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group relative`}>
                      {/* Compare Checkbox */}
                      <button 
                        onClick={() => handleTogglePromptCompare(prompt.id)}
                        className={`absolute top-4 right-4 z-10 w-6 h-6 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-300 text-transparent hover:border-blue-400'}`}
                        title="Chọn để so sánh"
                      >
                        <Check size={14} />
                      </button>

                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-4 pr-8">
                          <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{prompt.category}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 pr-8">{prompt.title}</h3>
                        
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {prompt.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{tag}</span>
                          ))}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 font-mono leading-relaxed h-32 overflow-y-auto custom-scrollbar mb-4">
                          {prompt.text}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                          <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Cấu trúc</span>
                            <span className="font-medium text-slate-700 truncate block" title={prompt.structure}>{prompt.structure}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Token / Thời gian</span>
                            <span className="font-medium text-slate-700">{prompt.tokens} • {prompt.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">Đã xác minh</span>
                        <button 
                          onClick={() => handleCopy(prompt.id, prompt.text)}
                          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${copiedId === prompt.id ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200'}`}
                        >
                          {copiedId === prompt.id ? (
                            <><CheckCircle2 size={16} /> Đã chép</>
                          ) : (
                            <><Copy size={16} /> Sao chép</>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Không tìm thấy prompt nào phù hợp với tìm kiếm của bạn.</p>
                </div>
              )}
            </div>

            {/* Floating Compare Bar */}
            {selectedPromptsToCompare.length > 0 && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-40 border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {selectedPromptsToCompare.length}
                  </div>
                  <span className="font-medium">prompt đã chọn</span>
                </div>
                
                <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
                  <button 
                    onClick={() => setSelectedPromptsToCompare([])}
                    className="text-slate-400 hover:text-white text-sm font-medium px-3 py-2 transition-colors"
                  >
                    Bỏ chọn
                  </button>
                  <button 
                    disabled={selectedPromptsToCompare.length !== 2}
                    onClick={() => setIsCompareModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                  >
                    <ArrowRightLeft size={16} />
                    So sánh ngay
                  </button>
                </div>
              </motion.div>
            )}

            {/* Comparison Modal */}
            {isCompareModalOpen && selectedPromptsToCompare.length === 2 && (
              <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                >
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                      <ArrowRightLeft className="w-6 h-6 text-blue-600" />
                      So sánh Prompt chi tiết
                    </h3>
                    <button onClick={() => setIsCompareModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto bg-white">
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="p-4 w-1/5 font-semibold border-b border-r border-slate-200">Tiêu chí</th>
                            <th className="p-4 w-2/5 font-bold border-b border-r border-slate-200 text-blue-700 text-base">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.title}</th>
                            <th className="p-4 w-2/5 font-bold border-b border-slate-200 text-emerald-700 text-base">{PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.title}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-4 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50">Nội dung</td>
                            <td className="p-4 border-r border-slate-200 text-slate-700 font-mono text-xs leading-relaxed bg-blue-50/30">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.text}
                            </td>
                            <td className="p-4 text-slate-700 font-mono text-xs leading-relaxed bg-emerald-50/30">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.text}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50">Tags</td>
                            <td className="p-4 border-r border-slate-200">
                              <div className="flex flex-wrap gap-1.5">
                                {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.tags.map(tag => (
                                  <span key={tag} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{tag}</span>
                                ))}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1.5">
                                {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.tags.map(tag => (
                                  <span key={tag} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{tag}</span>
                                ))}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50">Cấu trúc</td>
                            <td className="p-4 border-r border-slate-200">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold">
                                {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.structure}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold">
                                {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.structure}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50">Token tiêu thụ (Ước tính)</td>
                            <td className="p-4 border-r border-slate-200 font-mono text-sm text-slate-600">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.tokens}
                            </td>
                            <td className="p-4 font-mono text-sm text-slate-600">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.tokens}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50">Thời gian phản hồi</td>
                            <td className="p-4 border-r border-slate-200 font-mono text-sm text-slate-600">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.time}
                            </td>
                            <td className="p-4 font-mono text-sm text-slate-600">
                              {PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.time}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/50">Thao tác</td>
                            <td className="p-4 border-r border-slate-200">
                              <button 
                                onClick={() => handleCopy(selectedPromptsToCompare[0], PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[0])?.text || '')}
                                className="w-full py-2.5 bg-white border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                              >
                                {copiedId === selectedPromptsToCompare[0] ? <><CheckCircle2 size={18} /> Đã chép</> : <><Copy size={18} /> Sao chép Prompt 1</>}
                              </button>
                            </td>
                            <td className="p-4">
                              <button 
                                onClick={() => handleCopy(selectedPromptsToCompare[1], PROMPT_LIBRARY.find(p => p.id === selectedPromptsToCompare[1])?.text || '')}
                                className="w-full py-2.5 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                              >
                                {copiedId === selectedPromptsToCompare[1] ? <><CheckCircle2 size={18} /> Đã chép</> : <><Copy size={18} /> Sao chép Prompt 2</>}
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Content: News Feed */}
        {activeTab === 'news' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex gap-3 items-start">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-lg shrink-0">
                <Newspaper size={20} />
              </div>
              <div>
                <h4 className="font-bold text-orange-800 mb-1">Dữ liệu DEMO (Thử nghiệm)</h4>
                <p className="text-sm text-orange-700 leading-relaxed">
                  Các bản tin dưới đây hiện là dữ liệu mô phỏng nhằm mục đích trình diễn giao diện. Trong tương lai, Admin và Moderator có thể cập nhật, chỉnh sửa và quản lý nội dung thực tế tại khu vực này.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {newsArticles.map(article => (
                <div key={article.id} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                      <span className="font-semibold text-blue-600">{article.source}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">{article.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{article.summary}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">{tag}</span>
                        ))}
                      </div>
                      <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        Đọc tiếp <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
