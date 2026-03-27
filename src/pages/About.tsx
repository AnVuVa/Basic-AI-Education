import { motion } from 'motion/react';
import { ArrowRight, ShieldAlert, BookX, AlertTriangle, ShieldCheck, Users, Lightbulb, BookOpen, Terminal, Library, Award, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function About() {
  return (
    <div className="flex flex-col bg-white dark:bg-[#0e0a20]">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/ai-education/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
                Nền tảng giáo dục AI tiên phong
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Làm chủ AI - Kiến tạo tương lai với <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Đạo đức và Trách nhiệm số
                </span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-slate-300 mb-10 max-w-xl">
                BAIEdu là nền tảng tiên phong giúp người không chuyên thấu hiểu, ứng dụng và kiểm soát Trí tuệ nhân tạo một cách hiệu quả và tử tế.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/25">
                  Học thử miễn phí ngay <ArrowRight size={20} />
                </Link>
                <Link to="/library" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all">
                  Khám phá lộ trình
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                <img src="https://picsum.photos/seed/student-ai/800/600" alt="Học sinh tương tác với AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent mix-blend-overlay"></div>
                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-3 shadow-xl">
                  <ShieldCheck className="text-emerald-400" size={24} />
                  <div className="text-sm font-medium text-white">AI Ethics Verified</div>
                </div>
                <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-3 shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                  <div className="text-sm font-medium text-white">Data Processing...</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d0d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Mặt trái của sự bùng nổ AI</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Sự phát triển quá nhanh của Trí tuệ nhân tạo đang để lại những khoảng trống lớn trong nhận thức và giáo dục.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeIn} className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                  <BookX size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Đạo văn & Gian lận học thuật</h3>
                  <p className="text-slate-600 dark:text-slate-400">Sự lạm dụng AI tạo sinh khiến học sinh, sinh viên phụ thuộc, đánh mất khả năng tự nghiên cứu và viết lách.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Thui chột tư duy phản biện</h3>
                  <p className="text-slate-600 dark:text-slate-400">Tiếp nhận thông tin từ AI một cách thụ động mà không có khả năng kiểm chứng tính đúng sai của dữ liệu.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 flex gap-4">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Tin giả & Deepfake</h3>
                  <p className="text-slate-600 dark:text-slate-400">Không thể phân biệt được nội dung thật giả, dễ dàng trở thành nạn nhân hoặc công cụ lan truyền thông tin sai lệch.</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                  <AlertTriangle size={32} className="text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Khoảng trống giáo dục</h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  Hiện nay, <span className="text-white font-semibold">thiếu vắng hoàn toàn</span> các chương trình đào tạo Đạo đức AI chính thống tại trường học. Học sinh đang phải tự bơi trong biển thông tin mà không có "la bàn" định hướng.
                </p>
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-sm text-blue-200 uppercase tracking-wider font-semibold mb-2">Hậu quả</p>
                  <p className="text-white font-medium">Một thế hệ có thể thao tác công cụ rất giỏi, nhưng thiếu trách nhiệm và nhận thức về tác động của công nghệ đối với xã hội.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="py-24 bg-white dark:bg-[#0e0a20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Giải pháp từ BAIEdu</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">3 trụ cột cốt lõi giúp định hình tư duy và trang bị kỹ năng cho thế hệ công dân số mới.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="text-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Nền tảng Đạo đức & Trách nhiệm</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Xây dựng nhận thức đúng đắn về bản quyền, bảo mật dữ liệu và tính công bằng.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 -rotate-3 hover:rotate-0 transition-transform">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Bình dân học vụ số AI</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Đơn giản hóa các khái niệm công nghệ phức tạp. Bất kỳ ai cũng có thể hiểu và làm chủ AI.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform">
                <Lightbulb size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Đồng kiến tạo thay vì ỷ lại</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chuyển đổi tư duy từ "nhờ AI làm hộ" sang "cùng AI sáng tạo".</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hệ sinh thái tính năng toàn diện</h2>
            <p className="text-lg text-slate-400">Mọi công cụ bạn cần để học tập và làm chủ AI.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]"
          >
            <motion.div variants={fadeIn} className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-blue-900 to-slate-800 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-blue-500/30">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Hệ thống khóa học đa tầng</h3>
                <p className="text-slate-300 mb-6 max-w-md">Lộ trình học tập được thiết kế bài bản từ cơ bản đến chuyên sâu, phù hợp với mọi đối tượng.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="md:col-span-1 lg:col-span-2 row-span-1 bg-slate-800 rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
              <div className="relative z-10 flex items-center gap-6 h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Terminal className="text-emerald-400" size={24} />
                    <h3 className="text-xl font-bold">Interactive Lab & Gamification</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Thực hành tương tác với AI model ngay trên trình duyệt. Học qua các thử thách game hóa thú vị.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="md:col-span-1 lg:col-span-1 row-span-1 bg-slate-800 rounded-3xl p-8 border border-white/10">
              <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-4 border border-orange-500/30">
                <Library size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Prompt Engineering Hub</h3>
              <p className="text-slate-400 text-sm">Thư viện hàng ngàn câu lệnh AI chuẩn mực.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="md:col-span-1 lg:col-span-1 row-span-1 bg-slate-800 rounded-3xl p-8 border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4 border border-purple-500/30">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Dashboard & Phần thưởng</h3>
              <p className="text-slate-400 text-sm">Theo dõi tiến độ và nhận chứng chỉ "Công dân AI".</p>
            </motion.div>

            <motion.div variants={fadeIn} className="md:col-span-2 lg:col-span-2 row-span-1 bg-gradient-to-r from-slate-800 to-blue-900/50 rounded-3xl p-8 border border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="text-blue-400" size={24} />
                  <h3 className="text-xl font-bold">Cộng đồng Peer Review</h3>
                </div>
                <p className="text-slate-400 text-sm max-w-md">Thảo luận, đánh giá chéo bài tập và học hỏi từ cộng đồng.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-900"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Sẵn sàng làm chủ công nghệ tương lai?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Tham gia cùng hàng ngàn học viên khác trên hành trình trở thành những công dân AI có trách nhiệm.
            </p>
            <Link to="/courses" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 transition-all shadow-lg shadow-orange-500/25">
              Đăng ký học thử miễn phí
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
