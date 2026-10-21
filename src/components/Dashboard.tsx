import { Users, UserCheck, BookOpen, CalendarCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Student, Course } from '@/types';

interface DashboardProps {
  students: Student[];
  courses: Course[];
  attendanceRecords: { status: string }[];
  onNavigate: (view: 'students' | 'attendance' | 'courses') => void;
}

function StatCard({
  label,
  subtitle,
  value,
  delta,
  deltaUp,
  icon: Icon,
  accent,
  accentSoft,
}: {
  label: string;
  subtitle: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  icon: LucideIcon;
  accent: string;
  accentSoft: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accentSoft}`}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-800">{value}</p>
          <p className="mt-1 truncate text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-lg ${accent} sm:flex`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            deltaUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {deltaUp ? '↑' : '↓'} {delta}
        </span>
        <span className="text-xs text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

export default function Dashboard({ students, courses, attendanceRecords, onNavigate }: DashboardProps) {
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const totalCourses = courses.length;
  const present = attendanceRecords.filter((r) => r.status === 'Present').length;
  const attendanceRate =
    attendanceRecords.length > 0
      ? Math.round((present / attendanceRecords.length) * 100)
      : 0;

  const recent = [...students].slice(0, 5);
  const courseCounts = courses.map((c) => ({
    name: c.name,
    count: students.filter((s) => s.course === c.name).length,
  }));
  const maxCount = Math.max(...courseCounts.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-600/20 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Welcome back, Admin</h2>
            <p className="mt-1 text-sm text-blue-100">
              Here's what's happening across your institution today.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('students')}
              className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
            >
              View Students
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Mark Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          subtitle="All enrolled records"
          value={totalStudents.toString()}
          delta="8.2%"
          deltaUp
          icon={Users}
          accent="bg-blue-600 shadow-blue-600/30"
          accentSoft="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Active Students"
          subtitle={`${Math.round((activeStudents / Math.max(totalStudents, 1)) * 100)}% of total`}
          value={activeStudents.toString()}
          delta="5.1%"
          deltaUp
          icon={UserCheck}
          accent="bg-emerald-600 shadow-emerald-600/30"
          accentSoft="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Total Courses"
          subtitle="Across all departments"
          value={totalCourses.toString()}
          delta="2 new"
          deltaUp
          icon={BookOpen}
          accent="bg-amber-500 shadow-amber-500/30"
          accentSoft="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Attendance Rate"
          subtitle="Present this period"
          value={`${attendanceRate}%`}
          delta="1.4%"
          deltaUp={attendanceRate >= 80}
          icon={CalendarCheck}
          accent="bg-indigo-600 shadow-indigo-600/30"
          accentSoft="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent students */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Recent Students</h3>
            <button
              onClick={() => onNavigate('students')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all →
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {recent.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${s.avatarColor}`}
                >
                  {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{s.name}</p>
                  <p className="truncate text-xs text-slate-400">{s.studentId} · {s.course}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    s.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600'
                      : s.status === 'Graduated'
                      ? 'bg-blue-50 text-blue-600'
                      : s.status === 'Suspended'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment by course */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Enrollment by Course</h3>
          <div className="mt-5 space-y-4">
            {courseCounts.map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{c.name}</span>
                  <span className="font-semibold text-slate-800">{c.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${(c.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
