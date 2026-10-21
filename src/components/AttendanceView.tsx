import { useState } from 'react';
import { Search, Check, X, Clock, FileText, CalendarDays } from 'lucide-react';
import type { AttendanceRecord } from '@/types';

interface AttendanceViewProps {
  records: AttendanceRecord[];
}

const statusConfig = {
  Present: { icon: Check, class: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  Absent: { icon: X, class: 'bg-rose-50 text-rose-600', badge: 'bg-rose-100 text-rose-700' },
  Late: { icon: Clock, class: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  Excused: { icon: FileText, class: 'bg-blue-50 text-blue-600', badge: 'bg-blue-100 text-blue-700' },
};

export default function AttendanceView({ records }: AttendanceViewProps) {
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All');

  const dates = Array.from(new Set(records.map((r) => r.date))).sort().reverse();

  const filtered = records.filter((r) => {
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q) || r.course.toLowerCase().includes(q);
    const matchesDate = dateFilter === 'All' || r.date === dateFilter;
    return matchesQuery && matchesDate;
  });

  const stats = {
    present: records.filter((r) => r.status === 'Present').length,
    absent: records.filter((r) => r.status === 'Absent').length,
    late: records.filter((r) => r.status === 'Late').length,
    excused: records.filter((r) => r.status === 'Excused').length,
  };
  const rate = records.length > 0 ? Math.round((stats.present / records.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Attendance</h2>
        <p className="mt-1 text-sm text-slate-500">Track student attendance across all courses.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {([
          { label: 'Present', value: stats.present, key: 'Present' as const },
          { label: 'Absent', value: stats.absent, key: 'Absent' as const },
          { label: 'Late', value: stats.late, key: 'Late' as const },
          { label: 'Excused', value: stats.excused, key: 'Excused' as const },
        ]).map(({ label, value, key }) => {
          const cfg = statusConfig[key];
          const Icon = cfg.icon;
          return (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.class}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall rate banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white shadow-lg shadow-blue-600/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100">Overall Attendance Rate</p>
            <p className="mt-1 text-3xl font-bold">{rate}%</p>
          </div>
          <CalendarDays className="h-12 w-12 text-white/30" />
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${rate}%` }} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student or course…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="All">All Dates</option>
          {dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => {
                const cfg = statusConfig[r.status];
                const Icon = cfg.icon;
                return (
                  <tr key={r.id} className="transition hover:bg-blue-50/30">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{r.studentName}</p>
                      <p className="text-xs text-slate-400">{r.studentId}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{r.course}</td>
                    <td className="px-6 py-4 text-slate-500">{r.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
                        <Icon className="h-3.5 w-3.5" /> {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
