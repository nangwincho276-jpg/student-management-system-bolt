import { BookOpen, Users, Clock, Award } from 'lucide-react';
import type { Course } from '@/types';

interface CoursesViewProps {
  courses: Course[];
}

const accents = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-indigo-500 to-indigo-600',
];

export default function CoursesView({ courses }: CoursesViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Courses</h2>
        <p className="mt-1 text-sm text-slate-500">All courses offered by your institution.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((c, i) => (
          <div
            key={c.id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`h-2 bg-gradient-to-r ${accents[i % accents.length]}`} />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    {c.code}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-800">{c.name}</h3>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accents[i % accents.length]} shadow-lg`}>
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="mt-1 text-sm text-slate-500">Instructor: {c.instructor}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium">Students</span>
                  </div>
                  <p className="mt-1 text-xl font-bold text-slate-800">{c.students}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Award className="h-4 w-4" />
                    <span className="text-xs font-medium">Credits</span>
                  </div>
                  <p className="mt-1 text-xl font-bold text-slate-800">{c.credits}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                <Clock className="h-4 w-4 text-slate-400" />
                {c.schedule}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
