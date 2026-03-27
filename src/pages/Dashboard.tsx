import { BookOpen, Award, Clock, ChevronRight, PlayCircle, Flame, Star, Gift, Lock, Unlock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Dashboard() {
  const user = {
    name: "Nguyễn Văn B",
    level: 5,
    exp: 2450,
    nextLevelExp: 3000,
    streak: 12,
    totalCourses: 3,
    totalCertificates: 1,
    learningHours: "12h 30m"
  };

  const badges = [
    { id: 1, name: "Người Mới Bắt Đầu", icon: <Star size={24} />, description: "Hoàn thành bài học đầu tiên", unlocked: true, date: "01/10/2023" },
    { id: 2, name: "Chuyên Gia Đạo Đức", icon: <Award size={24} />, description: "Đạt 100 điểm bài test Đạo đức AI", unlocked: true, date: "15/10/2023" },
    { id: 3, name: "Thợ Săn Prompt", icon: <Zap size={24} />, description: "Sử dụng 50 prompts từ thư viện", unlocked: false, progress: 35, total: 50 },
    { id: 4, name: "Học Giả Chăm Chỉ", icon: <Flame size={24} />, description: "Chuỗi học tập 30 ngày liên tục", unlocked: false, progress: 12, total: 30 },
  ];

  const vouchers = [
    { id: 1, title: "Giảm 50% Khóa Advanced", description: "Áp dụng cho khóa học AI Advanced", cost: 1000, type: "discount" },
    { id: 2, title: "Mở khóa 10 Premium Prompts", description: "Truy cập kho prompt độc quyền", cost: 500, type: "feature" },
    { id: 3, title: "1 Giờ Mentor 1:1", description: "Trao đổi trực tiếp với chuyên gia AI", cost: 5000, type: "service" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0e0a20] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Gamification Overview */}
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <div className="relative">
              <img src="https://picsum.photos/seed/avatar/120/120" alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-md" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg border-2 border-white">
                Lv.{user.level}
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">Xin chào, {user.name}!</h1>
              <p className="text-slate-500 dark:text-slate-400">Tiếp tục giữ vững phong độ nhé.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto relative z-10">
            {/* Streak */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                <Flame size={28} className="fill-orange-500" />
              </div>
              <div>
                <div className="text-sm text-orange-600 font-semibold mb-1">Chuỗi ngày</div>
                <div className="text-2xl font-bold text-orange-700">{user.streak} <span className="text-sm font-medium">ngày</span></div>
              </div>
            </div>

            {/* EXP Progress */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 min-w-[240px] flex-1">
              <div className="flex justify-between items-end mb-2">
                <div className="text-sm text-blue-600 font-semibold">Kinh nghiệm (EXP)</div>
                <div className="text-sm font-bold text-blue-700">{user.exp} / {user.nextLevelExp}</div>
              </div>
              <div className="w-full bg-blue-200/50 rounded-full h-3 mb-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.exp / user.nextLevelExp) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-blue-500 h-full rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)' }}></div>
                </motion.div>
              </div>
              <div className="text-xs text-blue-500 text-right">Còn {user.nextLevelExp - user.exp} EXP nữa để lên cấp</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.totalCourses}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Khóa học đang học</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.totalCertificates}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Chứng chỉ đã đạt</div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.learningHours}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Thời gian học tập</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Continue Learning */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tiếp tục học</h2>
              </div>
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-full sm:w-48 aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden shrink-0 relative group cursor-pointer">
                    <img src="https://picsum.photos/seed/ai-safety/600/400" alt="Course" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                      <PlayCircle size={40} className="text-white opacity-90 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="text-sm font-semibold text-blue-600 mb-1">Học phần 1 • Bài 2</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Nguyên tắc đạo đức khi dùng AI</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="font-medium">25%</span>
                    </div>
                    <Link to="/learn/1" className="inline-block bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
                      Tiếp tục ngay
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Badges (Huy hiệu) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Award className="text-yellow-500" /> Bộ sưu tập Huy hiệu
                </h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Xem tất cả</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map(badge => (
                  <div key={badge.id} className={`p-4 rounded-2xl border ${badge.unlocked ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/40 border-dashed opacity-70'} flex gap-4 items-start`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${badge.unlocked ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-500' : 'bg-slate-200 text-slate-400'}`}>
                      {badge.unlocked ? badge.icon : <Lock size={24} />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold mb-1 ${badge.unlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'}`}>{badge.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{badge.description}</p>
                      {badge.unlocked ? (
                        <div className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-md">
                          Đạt được: {badge.date}
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Tiến độ</span>
                            <span>{badge.progress}/{badge.total}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-slate-400 dark:bg-slate-500 h-full rounded-full" style={{ width: `${(badge.progress! / badge.total!) * 100}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">
            
            {/* Vouchers / Rewards */}
            <section className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Gift className="text-purple-500" /> Đổi thưởng
                </h2>
                <div className="bg-blue-50 text-blue-600 text-sm font-bold px-3 py-1 rounded-lg">
                  {user.exp} EXP
                </div>
              </div>
              
              <div className="space-y-4">
                {vouchers.map(voucher => (
                  <div key={voucher.id} className="border border-slate-100 dark:border-slate-700/50 rounded-2xl p-4 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{voucher.title}</h4>
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        {voucher.cost} <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{voucher.description}</p>
                    <button 
                      className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${user.exp >= voucher.cost ? 'bg-purple-50 text-purple-600 hover:bg-purple-100' : 'bg-slate-50 text-slate-400 cursor-not-allowed'}`}
                      disabled={user.exp < voucher.cost}
                    >
                      {user.exp >= voucher.cost ? 'Đổi ngay' : 'Chưa đủ EXP'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Ethics Score */}
            <section className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
              <h2 className="text-xl font-bold mb-2 relative z-10">Chỉ số Đạo đức AI</h2>
              <p className="text-sm text-slate-400 mb-6 relative z-10">Dựa trên các bài kiểm tra tình huống bạn đã hoàn thành.</p>
              
              <div className="relative w-32 h-32 mx-auto mb-4 z-10">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: "85, 100" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-emerald-400"
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">85</span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <div className="text-center text-sm font-medium text-emerald-400 relative z-10 bg-emerald-400/10 py-2 rounded-xl border border-emerald-400/20">
                Mức độ: Xuất sắc
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
