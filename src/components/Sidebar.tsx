import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  Settings,
  GraduationCap,
  X,
  LifeBuoy,
  CircleDot,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ViewKey } from '@/types';

interface SidebarProps {
  active: ViewKey;
  onNavigate: (view: ViewKey) => void;
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
  desc: string;
}

const mainNav: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & stats' },
  { key: 'students', label: 'Students', icon: Users, desc: 'Manage records' },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck, desc: 'Daily tracking' },
  { key: 'courses', label: 'Courses', icon: BookOpen, desc: 'Class catalog' },
  { key: 'settings', label: 'Settings', icon: Settings, desc: 'Preferences' },
];

export default function Sidebar({ active, onNavigate, open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white border-r border-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 leading-tight">EduManage</p>
              <p className="text-xs text-slate-400">Student Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onNavigate(item.key)}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {/* Active accent bar */}
                    <span
                      className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 transition-opacity ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex flex-col items-start leading-tight">
                      <span>{item.label}</span>
                      <span
                        className={`text-[11px] font-normal ${
                          isActive ? 'text-blue-400' : 'text-slate-400'
                        }`}
                      >
                        {item.desc}
                      </span>
                    </span>
                    {isActive && (
                      <CircleDot className="ml-auto h-3.5 w-3.5 text-blue-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer help card */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white shadow-lg shadow-blue-600/20">
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-blue-100" />
              <p className="text-sm font-semibold">Need help?</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-blue-100">
              Check the documentation or contact support.
            </p>
            <button className="mt-3 w-full rounded-lg bg-white/15 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
              View Docs
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
