import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Sparkles, BookOpen, Zap,
  Library, Users, Layout, Info, Plus, LogIn, LogOut, Bot, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from './AuthModal';

// --- Sidebar item ---

function SidebarItem({
  icon: Icon,
  label,
  to,
  active,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      title={label}
      className={`
        w-full flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition-all
        ${active
          ? 'bg-white/15 text-white'
          : 'text-white/45 hover:text-white hover:bg-white/10'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[9px] font-medium leading-tight text-center">{label}</span>
    </Link>
  );
}

// --- Sidebar ---

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <div className="w-[68px] bg-[#1e0a3c] flex flex-col items-center py-2 gap-0.5 border-r border-white/10 shrink-0 h-full overflow-y-auto">

        {/* Logo */}
        <Link
          to="/"
          title="BAIEdu"
          className="w-9 h-9 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors mb-0.5 shrink-0"
        >
          <GraduationCap className="w-5 h-5 text-white" />
        </Link>

        {/* Create new */}
        <button
          onClick={() => navigate('/lab', { state: { skipToBuilder: true } })}
          title="Tạo mới"
          className="w-full flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[9px] font-medium">Tạo mới</span>
        </button>

        <div className="w-8 h-px bg-white/10 my-0.5 shrink-0" />

        <SidebarItem icon={Sparkles} label="Trang chủ" to="/"          active={isActive('/')} />
        <SidebarItem icon={BookOpen} label="Khóa học"  to="/courses"    active={isActive('/courses')} />
        <SidebarItem icon={Zap}      label="Phòng Lab" to="/lab"         active={isActive('/lab')} />
        <SidebarItem icon={Bot}      label="AI Keys"   to="/ai-accounts" active={isActive('/ai-accounts')} />
        <SidebarItem icon={Library}  label="Thư viện"  to="/library"     active={isActive('/library')} />
        <SidebarItem icon={Users}    label="Cộng đồng" to="/community"   active={isActive('/community')} />

        {/* Spacer */}
        <div className="flex-1" />

        <div className="w-8 h-px bg-white/10 mb-0.5 shrink-0" />
        <SidebarItem icon={Layout} label="Dashboard"    to="/dashboard" active={isActive('/dashboard')} />
        <SidebarItem icon={Info}   label="Về chúng tôi" to="/about"     active={isActive('/about')} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
          className="w-full flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl text-white/45 hover:text-white hover:bg-white/10 transition-all shrink-0"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-[9px] font-medium">{theme === 'dark' ? 'Sáng' : 'Tối'}</span>
        </button>

        {/* Auth */}
        {user ? (
          <div className="flex flex-col items-center gap-0.5 mt-0.5 w-full px-1 shrink-0">
            <img
              src={user.avatar || `https://picsum.photos/seed/${user.email}/100/100`}
              alt={user.name}
              className="w-7 h-7 rounded-full border-2 border-purple-400/50"
            />
            <span className="text-[8px] text-white/40 text-center truncate w-full px-1 leading-tight">
              {user.name}
            </span>
            <button
              onClick={logout}
              title="Đăng xuất"
              className="w-full flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-900/20 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[9px]">Đăng xuất</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
            title="Đăng nhập"
            className="w-full flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl text-white/45 hover:text-white hover:bg-white/10 transition-all mt-0.5 shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span className="text-[9px] font-medium">Đăng nhập</span>
          </button>
        )}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
