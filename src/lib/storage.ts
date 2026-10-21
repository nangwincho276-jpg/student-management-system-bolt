import type { Student, Course, AttendanceRecord } from '@/types';
import {
  sampleStudents,
  sampleCourses,
  sampleAttendance,
} from '@/data/sampleData';

const KEYS = {
  students: 'sms_students',
  courses: 'sms_courses',
  attendance: 'sms_attendance',
  seeded: 'sms_seeded',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function loadStudents(): Student[] {
  if (!localStorage.getItem(KEYS.seeded)) {
    write(KEYS.students, sampleStudents);
    write(KEYS.courses, sampleCourses);
    write(KEYS.attendance, sampleAttendance);
    localStorage.setItem(KEYS.seeded, '1');
  }
  return read<Student[]>(KEYS.students, sampleStudents);
}

export function saveStudents(students: Student[]): void {
  write(KEYS.students, students);
}

export function loadCourses(): Course[] {
  return read<Course[]>(KEYS.courses, sampleCourses);
}

export function saveCourses(courses: Course[]): void {
  write(KEYS.courses, courses);
}

export function loadAttendance(): AttendanceRecord[] {
  return read<AttendanceRecord[]>(KEYS.attendance, sampleAttendance);
}

export function saveAttendance(records: AttendanceRecord[]): void {
  write(KEYS.attendance, records);
}

export function resetAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
