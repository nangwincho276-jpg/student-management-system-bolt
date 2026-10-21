import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dashboard from '@/components/Dashboard';
import StudentsView from '@/components/StudentsView';
import AttendanceView from '@/components/AttendanceView';
import CoursesView from '@/components/CoursesView';
import SettingsView from '@/components/SettingsView';
import type { ViewKey, Student, Course, AttendanceRecord } from '@/types';
import {
  loadStudents,
  saveStudents,
  loadCourses,
  saveCourses,
  loadAttendance,
  saveAttendance,
  resetAllData,
} from '@/lib/storage';

const viewTitles: Record<ViewKey, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  attendance: 'Attendance',
  courses: 'Courses',
  settings: 'Settings',
};

export default function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    setStudents(loadStudents());
    setCourses(loadCourses());
    setAttendance(loadAttendance());
  }, []);

  // Keep course enrollment counts in sync with students
  useEffect(() => {
    if (students.length === 0) return;
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        students: students.filter((s) => s.course === c.name).length,
      }))
    );
  }, [students]);

  const navigate = (v: ViewKey) => {
    setView(v);
    setSidebarOpen(false);
  };

  const handleAddStudent = (s: Omit<Student, 'id'>) => {
    setStudents((prev) => {
      const next = [...prev, s as Student];
      saveStudents(next);
      return next;
    });
  };

  const handleUpdateStudent = (s: Student) => {
    setStudents((prev) => {
      const next = prev.map((p) => (p.id === s.id ? s : p));
      saveStudents(next);
      return next;
    });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveStudents(next);
      return next;
    });
  };

  const handleResetData = () => {
    resetAllData();
    const s = loadStudents();
    const c = loadCourses();
    const a = loadAttendance();
    setStudents(s);
    setCourses(c);
    setAttendance(a);
    setView('dashboard');
  };

  // Persist course counts when they change
  useEffect(() => {
    if (courses.length > 0) saveCourses(courses);
  }, [courses]);

  const filteredStudents = useMemo(() => {
    const q = quickSearch.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
    );
  }, [students, quickSearch]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar
        active={view}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={viewTitles[view]}
          onMenu={() => setSidebarOpen(true)}
          onQuickSearch={setQuickSearch}
          onNavigate={navigate}
        />

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {view === 'dashboard' && (
            <Dashboard
              students={students}
              courses={courses}
              attendanceRecords={attendance}
              onNavigate={navigate}
            />
          )}
          {view === 'students' && (
            <StudentsView
              students={quickSearch ? filteredStudents : students}
              onAdd={handleAddStudent}
              onUpdate={handleUpdateStudent}
              onDelete={handleDeleteStudent}
            />
          )}
          {view === 'attendance' && <AttendanceView records={attendance} />}
          {view === 'courses' && <CoursesView courses={courses} />}
          {view === 'settings' && <SettingsView onResetData={handleResetData} />}
        </main>
      </div>
    </div>
  );
}
