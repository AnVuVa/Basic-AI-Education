import { PlayCircle, CheckCircle2, Clock, BookOpen, Star, ChevronDown, ChevronUp, Users, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function CourseDetail() {
  const [openModule, setOpenModule] = useState<number | null>(0);

  const modules = [
    {
      title: 'Học phần 1: Nền tảng AI an toàn',
      lessons: [
        { title: 'AI là gì và rủi ro tiềm ẩn?', duration: '15:00', type: 'video' },
        { title: 'Nguyên tắc đạo đức khi dùng AI', duration: '20:30', type: 'video' },
        { title: 'Case Study: Hậu quả của việc lạm dụng AI', duration: '10 EXP', type: 'case' },
      ]
    },
    {
      title: 'Học phần 2: Ứng dụng AI có trách nhiệm',
      lessons: [
        { title: 'Bảo mật dữ liệu cá nhân & doanh nghiệp', duration: '25:00', type: 'video' },
        { title: 'Kiểm chứng thông tin do AI tạo ra', duration: '18:45', type: 'video' },
        { title: 'Tránh đạo văn và vi phạm bản quyền', duration: '22:15', type: 'video' },
        { title: 'Case Study: Xử lý khủng hoảng truyền thông do AI', duration: '15 EXP', type: 'case' },
      ]
    },
    {
      title: 'Học phần 3: Thực hành an toàn',
      lessons: [
        { title: 'Thiết lập quy tắc sử dụng AI trong nhóm', duration: '30:00', type: 'video' },
        { title: 'Đánh giá rủi ro trước khi triển khai AI', duration: '25:00', type: 'video' },
        { title: 'Bài kiểm tra cuối khóa', duration: '50 EXP', type: 'quiz' },
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Course Header */}
      <div className="bg-slate-900 text-white pt-12 pb-32 md:pt-20 md:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pattern/1920/1080')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-sm text-blue-300 mb-6 font-medium">
                <Link to="/courses" className="hover:text-white transition-colors">Khóa học</Link>
                <span>/</span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md border border-blue-500/30">Cơ bản</span>
                <span>/</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md border border-emerald-500/30">Nghiên cứu</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Sử dụng AI an toàn và có trách nhiệm <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">(Safe & Responsible AI)</span></h1>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
                Hiểu rõ các nguyên tắc đạo đức, rủi ro tiềm ẩn và cách ứng dụng AI một cách có trách nhiệm trong công việc và học tập. Khóa học nền tảng giúp bạn tự tin bước vào kỷ nguyên Trí tuệ Nhân tạo mà không đánh mất tư duy phản biện.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 inline-flex backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="font-bold text-white text-base">4.9</span>
                  <span>(1,234 đánh giá)</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  <span className="font-medium text-white">10,500</span> học viên
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-emerald-400" />
                  <span className="font-medium text-white">4 tuần</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden border-2 border-white/20 shadow-lg">
                  <img src="https://picsum.photos/seed/instructor1/100/100" alt="Instructor" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-0.5">Giảng viên hướng dẫn</div>
                  <div className="font-bold text-white text-lg">TS. Nguyễn Văn A</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* What you'll learn */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> Bạn sẽ học được gì?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Hiểu rõ bản chất của AI, phân biệt được AI và con người.",
                  "Nắm bắt cơ chế hoạt động cơ bản của các mô hình ngôn ngữ lớn.",
                  "Nhận diện được các rủi ro về đạo đức khi sử dụng AI.",
                  "Xây dựng tư duy phản biện khi tiếp nhận thông tin từ AI.",
                  "Biết cách đặt câu hỏi (Prompt) hiệu quả và an toàn.",
                  "Tránh được các lỗi đạo văn và vi phạm liêm chính học thuật."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Syllabus */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="text-blue-500" /> Lộ trình học tập
              </h2>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button 
                      className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                      onClick={() => setOpenModule(openModule === index ? null : index)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${openModule === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                          {index + 1}
                        </div>
                        <span className="font-bold text-slate-900 text-left text-lg">{module.title}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openModule === index ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                        {openModule === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>
                    
                    {openModule === index && (
                      <div className="px-6 pb-4 bg-slate-50/50 border-t border-slate-100">
                        <div className="pt-2 space-y-2">
                          {module.lessons.map((lesson, lIndex) => (
                            <div key={lIndex} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-3">
                                {lesson.type === 'video' && <PlayCircle size={18} className="text-blue-500" />}
                                {lesson.type === 'case' && <AlertCircle size={18} className="text-orange-500" />}
                                {lesson.type === 'quiz' && <FileText size={18} className="text-purple-500" />}
                                <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">{lesson.title}</span>
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded-md ${lesson.type === 'case' || lesson.type === 'quiz' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column: Floating Card */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl overflow-hidden text-slate-800 sticky top-24 border border-slate-200">
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center group cursor-pointer overflow-hidden">
                <img src="https://picsum.photos/seed/ai-ethics/600/400" alt="Course preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity group-hover:scale-105 duration-500" referrerPolicy="no-referrer" />
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white relative z-10 group-hover:scale-110 transition-transform shadow-2xl border border-white/30">
                  <PlayCircle size={32} className="ml-1" />
                </div>
                <div className="absolute bottom-4 text-white font-medium z-10 text-sm tracking-wide">XEM VIDEO GIỚI THIỆU</div>
              </div>
              
              <div className="p-8">
                <div className="text-3xl font-bold text-slate-900 mb-6">Miễn phí</div>
                <Link to="/learn/1" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-xl font-bold text-lg mb-4 transition-colors shadow-lg shadow-blue-600/20">
                  Bắt đầu học ngay
                </Link>
                <p className="text-center text-sm text-slate-500 mb-8 font-medium">Hoàn thành để nhận 100 EXP & Huy hiệu</p>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-2">Khóa học bao gồm</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><PlayCircle size={16} /></div>
                    <span className="font-medium">10 giờ video bài giảng</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><AlertCircle size={16} /></div>
                    <span className="font-medium">15 Case Study thực tế</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></div>
                    <span className="font-medium">Chứng chỉ hoàn thành</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Star size={16} /></div>
                    <span className="font-medium">Truy cập trọn đời</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
