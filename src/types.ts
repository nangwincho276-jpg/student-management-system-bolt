export type StudentStatus = 'Active' | 'Inactive' | 'Graduated' | 'Suspended';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  course: string;
  year: number;
  status: StudentStatus;
  attendanceRate: number;
  enrolledDate: string;
  avatarColor: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  students: number;
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export type ViewKey =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'courses'
  | 'settings';
