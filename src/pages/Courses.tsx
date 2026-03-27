import { Search, Filter, Star, PlayCircle, BookOpen, PenTool, Lightbulb, Code, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';

export default function Courses() {
  const [activeLevel, setActiveLevel] = useState('all'); // all, basic, advanced
  const [activeDomain, setActiveDomain] = useState('all'); // all, writing, design, research, programming
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      id: 1,
      title: 'Sử dụng AI an toàn và có trách nhiệm',
      description: 'Hiểu rõ các nguyên tắc đạo đức, rủi ro tiềm ẩn và cách ứng dụng AI một cách có trách nhiệm trong công việc và học tập.',
      level: 'basic',
      domain: 'research',
      duration: '4 tuần',
      instructor: 'TS. Nguyễn Văn A',
      rating: 4.9,
      image: 'https://picsum.photos/seed/ai-safety/600/400',
      badge: 'Bestseller'
    },
    {
      id: 2,
      title: 'Nhận diện và phòng chống Deepfake',
      description: 'Trang bị kỹ năng phân biệt nội dung thật giả, hiểu cơ chế tạo Deepfake và các công cụ phát hiện nội dung do AI tạo ra.',
      level: 'basic',
      domain: 'research',
      duration: '5 tuần',
      instructor: 'ThS. Trần Thị B',
      rating: 4.8,
      image: 'https://picsum.photos/seed/deepfake/600/400',
      badge: 'Mới'
    },
    {
      id: 3,
      title: 'Vấn đề pháp lý khi ứng dụng AI',
      description: 'Khám phá các khung pháp lý hiện hành, rủi ro pháp lý khi sử dụng dữ liệu và công cụ AI trong doanh nghiệp.',
      level: 'advanced',
      domain: 'research',
      duration: '6 tuần',
      instructor: 'Luật sư Lê C',
      rating: 4.7,
      image: 'https://picsum.photos/seed/ai-law/600/400',
    },
    {
      id: 4,
      title: 'Bản quyền trong kỷ nguyên AI',
      description: 'Giải đáp các thắc mắc về quyền sở hữu trí tuệ đối với sản phẩm do AI tạo ra và cách bảo vệ tài sản sáng tạo của bạn.',
      level: 'advanced',
      domain: 'design',
      duration: '4 tuần',
      instructor: 'Chuyên gia Phạm D',
      rating: 4.9,
      image: 'https://picsum.photos/seed/copyright/600/400',
    },
    {
      id: 5,
      title: 'AI trong Viết lách & Sáng tạo',
      description: 'Sử dụng AI để brainstorm, lập dàn ý và biên tập nội dung mà không đánh mất văn phong cá nhân và đảm bảo tính nguyên bản.',
      level: 'advanced',
      domain: 'writing',
      duration: '8 tuần',
      instructor: 'Nhà văn Lê C',
      rating: 5.0,
      image: 'https://picsum.photos/seed/writing/600/400',
    }
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchLevel = activeLevel === 'all' || course.level === activeLevel;
      const matchDomain = activeDomain === 'all' || course.domain === activeDomain;
      const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchDomain && matchSearch;
    });
  }, [activeLevel, activeDomain, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Personalized Roadmap Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-10 mb-12 relative overflow-hidden text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm mb-4">
                <Star size={14} className="fill-blue-400" /> Lộ trình cá nhân hóa
              </div>
              <h2 className="text-3xl font-bold mb-4">Bạn muốn ứng dụng AI vào lĩnh vực nào?</h2>
              <p className="text-slate-300 mb-6">Chọn một lĩnh vực để BAIEdu gợi ý lộ trình học tập phù hợp nhất, giúp bạn làm chủ AI một cách an toàn và hiệu quả.</p>
              
              <div className="flex flex-wrap gap-3">
                <button onClick={() => {setActiveDomain('writing'); setActiveLevel('all');}} className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${activeDomain === 'writing' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'}`}>
                  <PenTool size={18} /> Viết lách
                </button>
                <button onClick={() => {setActiveDomain('design'); setActiveLevel('all');}} className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${activeDomain === 'design' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'}`}>
                  <Lightbulb size={18} /> Thiết kế
                </button>
                <button onClick={() => {setActiveDomain('research'); setActiveLevel('all');}} className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${activeDomain === 'research' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'}`}>
                  <BookOpen size={18} /> Nghiên cứu
                </button>
                <button onClick={() => {setActiveDomain('programming'); setActiveLevel('all');}} className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${activeDomain === 'programming' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'}`}>
                  <Code size={18} /> Lập trình
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen size={20} className="text-blue-400" /> Lộ trình đề xuất</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/10 border border-white/10 p-4 rounded-xl">
                    <div className="text-blue-300 text-xs font-bold mb-1 uppercase">Nền tảng (Bắt buộc)</div>
                    <div className="font-bold text-white">Sử dụng AI an toàn và có trách nhiệm</div>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-700 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    2
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/5 p-4 rounded-xl">
                    <div className="text-slate-400 text-xs font-bold mb-1 uppercase">Chuyên sâu</div>
                    <div className="font-bold text-slate-200">
                      {activeDomain === 'writing' ? 'AI trong Viết lách' : 
                       activeDomain === 'design' ? 'Bản quyền trong kỷ nguyên AI' : 
                       activeDomain === 'programming' ? 'Code với AI Assistant' : 'Vấn đề pháp lý khi ứng dụng AI'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Tất cả khóa học</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex bg-slate-200/50 p-1 rounded-xl">
              <button onClick={() => setActiveLevel('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLevel === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Tất cả</button>
              <button onClick={() => setActiveLevel('basic')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLevel === 'basic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Cơ bản</button>
              <button onClick={() => setActiveLevel('advanced')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLevel === 'advanced' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Chuyên sâu</button>
            </div>
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm khóa học..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Link key={course.id} to={`/courses/${course.id}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  {course.badge && (
                    <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${course.badge === 'Bestseller' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                      {course.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 shadow-lg">
                      <PlayCircle size={24} className="ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <span className="bg-slate-100 px-2 py-1 rounded-md font-medium text-slate-700">
                      {course.level === 'basic' ? 'Cơ bản' : 'Chuyên sâu'}
                    </span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://picsum.photos/seed/instructor${course.id}/100/100`} alt="Instructor" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" /> {course.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <p>Không tìm thấy khóa học nào phù hợp với bộ lọc của bạn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
