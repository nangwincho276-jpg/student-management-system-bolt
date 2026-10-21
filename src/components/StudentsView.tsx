import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, Mail, Filter } from 'lucide-react';
import type { Student, StudentStatus } from '@/types';
import { courseOptions, avatarPalette } from '@/data/sampleData';

interface StudentsViewProps {
  students: Student[];
  onAdd: (student: Omit<Student, 'id'>) => void;
  onUpdate: (student: Student) => void;
  onDelete: (id: string) => void;
}

const statusOptions: StudentStatus[] = ['Active', 'Inactive', 'Graduated', 'Suspended'];

const statusClasses: Record<StudentStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-600',
  Inactive: 'bg-slate-100 text-slate-500',
  Graduated: 'bg-blue-50 text-blue-600',
  Suspended: 'bg-rose-50 text-rose-600',
};

interface FormState {
  name: string;
  email: string;
  course: string;
  year: number;
  status: StudentStatus;
  attendanceRate: number;
}

const emptyForm: FormState = {
  name: '',
  email: '',
  course: courseOptions[0],
  year: 1,
  status: 'Active',
  attendanceRate: 90,
};

export default function StudentsView({ students, onAdd, onUpdate, onDelete }: StudentsViewProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        email: editing.email,
        course: editing.course,
        year: editing.year,
        status: editing.status,
        attendanceRate: editing.attendanceRate,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const filtered = students.filter((s) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const openAdd = () => {
    setEditing(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setError('');
    setModalOpen(true);
  };

  const close = () => {
    setModalOpen(false);
    setEditing(null);
    setError('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setError('A valid email is required.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course,
      year: Number(form.year),
      status: form.status,
      attendanceRate: Number(form.attendanceRate),
      enrolledDate: editing?.enrolledDate ?? new Date().toISOString().split('T')[0],
      avatarColor: editing?.avatarColor ?? avatarPalette[Math.floor(Math.random() * avatarPalette.length)],
    };
    if (editing) {
      onUpdate({ ...editing, ...payload });
    } else {
      const nextId = (students.reduce((m, s) => Math.max(m, Number(s.id)), 0) + 1).toString();
      const nextStuId = `STU-2024-${String(students.length + 1).padStart(3, '0')}`;
      onAdd({ ...payload, id: nextId, studentId: nextStuId });
    }
    close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Students</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage student records — {students.length} total enrolled.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ID, email, or course…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StudentStatus | 'All')}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Student ID</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Course</th>
                <th className="px-6 py-3.5">Year</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="group transition hover:bg-blue-50/40">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-medium text-slate-500">{s.studentId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${s.avatarColor}`}>
                        {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{s.name}</p>
                        <p className="truncate text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{s.course}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">Year {s.year}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[s.status]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        s.status === 'Active' ? 'bg-emerald-500'
                        : s.status === 'Graduated' ? 'bg-blue-500'
                        : s.status === 'Suspended' ? 'bg-rose-500'
                        : 'bg-slate-400'
                      }`} />
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5 opacity-60 transition group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${s.name}`}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(s)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${s.name}`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-sm font-medium text-slate-500">No students found.</p>
                    <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
          <span>Showing {filtered.length} of {students.length} students</span>
          <span className="hidden sm:inline">Blue & white theme · EduManage</span>
        </div>
      </div>

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {editing ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button onClick={close} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4 px-6 py-5">
              {error && (
                <div className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Jane Cooper"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="student@university.edu"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Course</label>
                  <select
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {courseOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Year</label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as StudentStatus })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Attendance Rate ({form.attendanceRate}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.attendanceRate}
                    onChange={(e) => setForm({ ...form, attendanceRate: Number(e.target.value) })}
                    className="mt-3 w-full accent-blue-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95"
                >
                  {editing ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-50">
                <Trash2 className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Delete student?</h3>
                <p className="mt-1 text-sm text-slate-500">
                  This will permanently remove <strong>{confirmDelete.name}</strong> ({confirmDelete.studentId}) from your records.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
