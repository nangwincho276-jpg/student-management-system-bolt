import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import type { ViewKey } from '@/types';

interface TopbarProps {
  title: string;
  onMenu: () => void;
  onQuickSearch: (q: string) => void;
  onNavigate: (v: ViewKey) => void;
}

const titles: Record<ViewKey, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  attendance: 'Attendance',
  courses: 'Courses',
  settings: 'Settings',
};

export default function Topbar({ title, onMenu, onQuickSearch, onNavigate }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden sm:block">
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400">EduManage · Student Management System</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            onChange={(e) => onQuickSearch(e.target.value)}
            onFocus={() => onNavigate('students')}
            placeholder="Quick search…"
            className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:w-64 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-2 sm:pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
            AU
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-slate-700">Admin User</p>
            <p className="text-xs leading-tight text-slate-400">Administrator</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  );
}
