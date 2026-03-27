import { MessageSquare, ThumbsUp, Eye, Search, Filter, Award, Star, Clock, ChevronRight, UserCircle2, MessageCircle, Newspaper, Youtube, Cpu, Mail, Globe, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Community() {
  const [activeTab, setActiveTab] = useState('discover'); // discover, review, leaderboard, news
  const [searchQuery, setSearchQuery] = useState('');

  const creators = [
    { id: 1, name: 'Dũng Lại Lập Trình', platform: 'YouTube', avatar: 'https://picsum.photos/seed/dung/100/100', description: 'Kênh YouTube chuyên chia sẻ kiến thức lập trình và ứng dụng AI trong thực tế, các tutorial chi tiết về ChatGPT, Copilot.', link: '#' },
    { id: 2, name: 'AI Advantage', platform: 'YouTube', avatar: 'https://picsum.photos/seed/aiadv/100/100', description: 'Cập nhật các mẹo sử dụng AI, prompt engineering và các công cụ AI mới nhất giúp tăng hiệu suất làm việc.', link: '#' },
    { id: 3, name: 'Hieu PC', platform: 'Facebook/YouTube', avatar: 'https://picsum.photos/seed/hieupc/100/100', description: 'Chia sẻ về an toàn thông tin và đôi khi có các bài viết đánh giá sâu sắc về tác động của AI đến bảo mật.', link: '#' },
  ];

  const tools = [
    { id: 1, name: 'Claude 3.5 Sonnet', provider: 'Anthropic', price: 'Miễn phí / $20/tháng', strength: 'Tốc độ cực nhanh, khả năng coding và xử lý ngôn ngữ tự nhiên vượt trội, hiểu ngữ cảnh tốt.', useCase: 'Lập trình, viết lách, phân tích dữ liệu phức tạp.', impact: 'Đang cạnh tranh trực tiếp và vượt mặt GPT-4o trong nhiều bài test.' },
    { id: 2, name: 'Gemini 1.5 Pro', provider: 'Google', price: 'Dùng thử miễn phí / Trả phí theo API', strength: 'Context window khổng lồ (lên đến 2 triệu token), xử lý đa phương tiện (video, audio, text) xuất sắc.', useCase: 'Phân tích tài liệu dài, tóm tắt video, nghiên cứu học thuật.', impact: 'Mở ra khả năng xử lý lượng dữ liệu khổng lồ trong một lần prompt.' },
    { id: 3, name: 'Sora', provider: 'OpenAI', price: 'Chưa công bố rộng rãi', strength: 'Tạo video chất lượng cao, chân thực từ văn bản với độ dài lên đến 1 phút, giữ được tính nhất quán của vật thể.', useCase: 'Sản xuất video, quảng cáo, làm phim, thiết kế game.', impact: 'Cách mạng hóa ngành công nghiệp sản xuất video và nội dung số.' },
  ];

  const newsletters = [
    { id: 1, name: 'The Rundown AI', frequency: 'Hàng ngày', description: 'Bản tin AI phát triển nhanh nhất, tóm tắt các tin tức, công cụ và hướng dẫn AI mới nhất chỉ trong 5 phút đọc.', link: '#' },
    { id: 2, name: 'TLDR AI', frequency: 'Hàng ngày', description: 'Bản tin ngắn gọn, súc tích tổng hợp các tin tức quan trọng nhất về AI, Machine Learning và Data Science.', link: '#' },
    { id: 3, name: 'AI Valley', frequency: 'Hàng ngày', description: 'Cập nhật các công cụ AI mới và prompt hữu ích mỗi ngày.', link: '#' },
  ];

  const websites = [
    { id: 1, name: 'Hugging Face', type: 'Cộng đồng / Nền tảng', description: 'Được ví như "GitHub của AI", nơi chia sẻ các mô hình AI mã nguồn mở, dataset và các ứng dụng demo (Spaces).', link: 'https://huggingface.co' },
    { id: 2, name: 'Futurepedia', type: 'Thư mục công cụ', description: 'Thư viện tổng hợp và phân loại hàng ngàn công cụ AI lớn nhất hiện nay, cập nhật liên tục mỗi ngày.', link: 'https://www.futurepedia.io' },
    { id: 3, name: 'OpenAI Blog', type: 'Blog chính thức', description: 'Nơi cập nhật những nghiên cứu, thông báo và sản phẩm mới nhất trực tiếp từ OpenAI.', link: 'https://openai.com/blog' },
  ];

  const posts = [
    {
      id: 1,
      author: { name: 'Trần Minh Tuấn', avatar: 'https://picsum.photos/seed/user1/100/100', level: 4 },
      title: 'Phân tích thiên kiến trong Midjourney khi tạo ảnh "CEO"',
      content: 'Mình vừa thử nghiệm prompt "A portrait of a successful CEO in a modern office" trên Midjourney v5. Kết quả là 4/4 ảnh đều là nam giới da trắng, độ tuổi 40-50. Điều này cho thấy rõ data bias trong tập huấn luyện của mô hình. Mình đã thử thêm các từ khóa như "diverse" nhưng kết quả vẫn chưa thực sự tự nhiên. Mọi người có kinh nghiệm xử lý bias này không?',
      tags: ['Đạo đức AI', 'Thiên kiến', 'Midjourney'],
      likes: 24,
      comments: 8,
      views: 156,
      time: '2 giờ trước',
      type: 'discussion'
    },
    {
      id: 2,
      author: { name: 'Nguyễn Lê Thảo', avatar: 'https://picsum.photos/seed/user2/100/100', level: 6 },
      title: '[Bài tập] Viết prompt tóm tắt tài liệu học thuật không làm mất ý chính',
      content: 'Đây là bài nộp của mình cho khóa "AI trong Nghiên cứu". Mình sử dụng kỹ thuật Chain-of-Thought kết hợp với Role-playing. Prompt: "Bạn là một giáo sư đại học. Hãy đọc đoạn văn bản học thuật sau và tóm tắt nó thành 3 ý chính, giữ nguyên các thuật ngữ chuyên ngành và không tự ý thêm thông tin bên ngoài..."',
      tags: ['Prompt Engineering', 'Nghiên cứu', 'Bài tập'],
      likes: 45,
      comments: 12,
      views: 320,
      time: '5 giờ trước',
      type: 'submission',
      needsReview: true
    },
    {
      id: 3,
      author: { name: 'Lê Hoàng', avatar: 'https://picsum.photos/seed/user3/100/100', level: 3 },
      title: 'Tranh cãi về việc dùng ChatGPT viết email xin việc',
      content: 'Hôm nay lớp mình có cuộc tranh luận khá gay gắt về việc dùng AI viết Cover Letter. Một nửa cho rằng đó là gian lận và thiếu chân thành, nửa kia cho rằng đó chỉ là công cụ hỗ trợ như Grammarly. Ranh giới đạo đức ở đây là gì? Theo mình thì...',
      tags: ['Thảo luận', 'Đạo đức AI', 'Tuyển dụng'],
      likes: 18,
      comments: 35,
      views: 412,
      time: '1 ngày trước',
      type: 'discussion'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Nguyễn Lê Thảo', avatar: 'https://picsum.photos/seed/user2/100/100', exp: 12500, badges: 15 },
    { rank: 2, name: 'Phạm Văn D', avatar: 'https://picsum.photos/seed/user4/100/100', exp: 11200, badges: 12 },
    { rank: 3, name: 'Trần Minh Tuấn', avatar: 'https://picsum.photos/seed/user1/100/100', exp: 9800, badges: 9 },
    { rank: 4, name: 'Lê Hoàng', avatar: 'https://picsum.photos/seed/user3/100/100', exp: 8400, badges: 7 },
    { rank: 5, name: 'Hoàng Thị E', avatar: 'https://picsum.photos/seed/user5/100/100', exp: 7600, badges: 6 },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0e0a20] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm mb-4 font-medium">
                <MessageCircle size={16} /> Cộng đồng & Peer Review
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Học hỏi cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Cộng đồng</span></h1>
              <p className="text-lg text-slate-300">
                Thảo luận về đạo đức AI, chia sẻ prompt hay, và tham gia đánh giá chéo (Peer Review) bài tập của học viên khác để cùng nhau tiến bộ.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2">
                <MessageSquare size={20} /> Tạo bài viết mới
              </button>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300">
                  <Star size={24} />
                </div>
                <div>
                  <div className="text-sm text-slate-300">Điểm Review của bạn</div>
                  <div className="text-xl font-bold text-white">450 <span className="text-sm font-normal text-slate-400">EXP</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content - Left Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Tabs & Search */}
            <div className="bg-white dark:bg-slate-900/90 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-20 z-30">
              <div className="flex w-full sm:w-auto overflow-x-auto custom-scrollbar">
                <button 
                  onClick={() => setActiveTab('discover')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'discover' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Khám phá
                </button>
                <button 
                  onClick={() => setActiveTab('review')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'review' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Cần đánh giá <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md text-xs">12</span>
                </button>
                <button 
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'leaderboard' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Bảng xếp hạng
                </button>
                <button 
                  onClick={() => setActiveTab('news')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'news' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Newspaper size={16} /> Tin tức & Cập nhật
                </button>
              </div>
              
              <div className="relative w-full sm:w-64 shrink-0 px-2 sm:px-0">
                <Search className="absolute left-3 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bài viết..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Posts Feed */}
            {(activeTab === 'discover' || activeTab === 'review') && (
              <div className="space-y-6">
                {posts.filter(post => activeTab === 'review' ? post.needsReview : true).map(post => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={post.id} 
                    className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-6 md:p-8">
                      {/* Author Info */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full border-2 border-slate-100 object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white">
                              Lv.{post.author.level}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{post.author.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {post.time}
                            </div>
                          </div>
                        </div>
                        {post.needsReview && (
                          <div className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <Eye size={14} /> Cần Peer Review
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{post.title}</h2>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">{post.content}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors font-medium text-sm">
                            <ThumbsUp size={18} /> {post.likes}
                          </button>
                          <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors font-medium text-sm">
                            <MessageSquare size={18} /> {post.comments}
                          </button>
                          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-medium text-sm hidden sm:flex">
                            <Eye size={18} /> {post.views}
                          </div>
                        </div>
                        
                        {post.needsReview ? (
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                            Đánh giá ngay (+50 EXP)
                          </button>
                        ) : (
                          <button className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1 transition-colors">
                            Xem chi tiết <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Award className="text-yellow-500" /> Bảng vàng vinh danh
                  </h2>
                  <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tháng này</option>
                    <option>Tuần này</option>
                    <option>Tất cả thời gian</option>
                  </select>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {leaderboard.map((user, index) => (
                    <div key={index} className={`p-4 sm:p-6 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${index < 3 ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0
                        ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                          index === 1 ? 'bg-slate-200 text-slate-600' : 
                          index === 2 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'}`}
                      >
                        #{user.rank}
                      </div>
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" /> {user.exp} EXP</span>
                          <span className="flex items-center gap-1"><Award size={14} className="text-purple-500" /> {user.badges} Huy hiệu</span>
                        </div>
                      </div>
                      {index === 0 && <Award size={28} className="text-yellow-500 hidden sm:block" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* News & Updates Tab */}
            {activeTab === 'news' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                
                {/* Content Creators */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                      <Youtube size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Content Creators Nổi Bật</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creators.map(creator => (
                      <div key={creator.id} className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                        <img src={creator.avatar} alt={creator.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {creator.name}
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">{creator.platform}</span>
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{creator.description}</p>
                          <a href={creator.link} className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-3 hover:text-blue-800 transition-colors">
                            Theo dõi <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* AI Tools & Models */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <Cpu size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Công Cụ & Mô Hình AI Mới</h2>
                  </div>
                  <div className="space-y-4">
                    {tools.map(tool => (
                      <div key={tool.id} className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tool.name}</h3>
                            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{tool.provider}</div>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold">
                            {tool.price}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30">
                            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Sức mạnh / Ưu điểm</span>
                            <span className="text-slate-700 dark:text-slate-300">{tool.strength}</span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/30">
                            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Mục đích sử dụng</span>
                            <span className="text-slate-700 dark:text-slate-300">{tool.useCase}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-sm">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Tác động: </span>
                          <span className="text-slate-600 dark:text-slate-400">{tool.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Newsletters & Websites */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Mail size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Newsletters Nổi Bật</h2>
                    </div>
                    <div className="space-y-4">
                      {newsletters.map(nl => (
                        <div key={nl.id} className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{nl.name}</h3>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">{nl.frequency}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{nl.description}</p>
                          <a href={nl.link} className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                            Đăng ký <ExternalLink size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                        <Globe size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Website & Blog</h2>
                    </div>
                    <div className="space-y-4">
                      {websites.map(site => (
                        <div key={site.id} className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{site.name}</h3>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">{site.type}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{site.description}</p>
                          <a href={site.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                            Truy cập <ExternalLink size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

              </motion.div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            
            {/* About Peer Review */}
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold mb-3 relative z-10 flex items-center gap-2">
                <Eye className="text-purple-400" /> Peer Review là gì?
              </h3>
              <p className="text-sm text-slate-300 mb-4 relative z-10 leading-relaxed">
                Đánh giá chéo (Peer Review) là phương pháp học tập hiệu quả nhất. Bằng cách nhận xét bài tập của người khác, bạn rèn luyện tư duy phản biện và học được nhiều góc nhìn mới về AI.
              </p>
              <ul className="space-y-2 text-sm text-slate-300 relative z-10 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Nhận 50 EXP cho mỗi lượt review</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Mở khóa huy hiệu "Nhà phê bình"</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Giúp đỡ cộng đồng cùng tiến bộ</li>
              </ul>
              <button onClick={() => setActiveTab('review')} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2.5 rounded-xl text-sm font-bold transition-colors relative z-10">
                Bắt đầu Review ngay
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Filter size={18} className="text-slate-400" /> Chủ đề phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Đạo đức AI', 'Prompt Engineering', 'Midjourney', 'ChatGPT', 'Bản quyền', 'Deepfake', 'Nghiên cứu', 'Thảo luận'].map((tag, idx) => (
                  <button key={idx} className="bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <UserCircle2 size={18} className="text-slate-400" /> Chuyên gia nổi bật
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'TS. Nguyễn Văn A', role: 'Giảng viên', avatar: 'https://picsum.photos/seed/instructor1/100/100' },
                  { name: 'ThS. Trần Thị B', role: 'Giảng viên', avatar: 'https://picsum.photos/seed/instructor2/100/100' },
                  { name: 'Nguyễn Lê Thảo', role: 'Học viên xuất sắc', avatar: 'https://picsum.photos/seed/user2/100/100' },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
