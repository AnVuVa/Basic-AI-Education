import { Link, Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-primary p-1.5 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">BAIEdu</span>
            </div>
            <p className="text-sm">Định hình tư duy và trang bị la bàn đạo đức cho mọi người trong kỷ nguyên Trí tuệ Nhân tạo.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Khóa học</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white">AI Literacy Cơ bản</Link></li>
              <li><Link to="#" className="hover:text-white">Đạo đức AI</Link></li>
              <li><Link to="#" className="hover:text-white">AI cho Sinh viên</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Thư viện</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white">Case Studies</Link></li>
              <li><Link to="#" className="hover:text-white">Prompt Library</Link></li>
              <li><Link to="#" className="hover:text-white">Fact-check Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white">Sứ mệnh</Link></li>
              <li><Link to="#" className="hover:text-white">Đội ngũ</Link></li>
              <li><Link to="#" className="hover:text-white">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          &copy; {new Date().getFullYear()} BAIEdu. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
