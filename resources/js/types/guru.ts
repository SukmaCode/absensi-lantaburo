export interface TeacherInfo {
    nip: string;
    subject: string;
}

export interface SelfAttendanceStatus {
    hasAttended: boolean;
    checkInTime?: string;
    date?: string;
    status?: string;
    rawStatus?: 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha';
    photoUrl?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    notes?: string | null;
}

export interface HomeroomClassInfo {
    id: number;
    name: string;
    gradeLevel: string;
    totalStudents: number;
}

export interface StudentAttendanceSummary {
    totalStudents: number;
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    belumAbsen: number;
    attendanceRate: number;
}

export interface AnnouncementItem {
    title: string;
    description: string;
    date: string;
    category: string;
}

export interface GuruDashboardProps {
    teacherInfo: TeacherInfo;
    todaySelfAttendance: SelfAttendanceStatus;
    homeroomClass: HomeroomClassInfo | null;
    studentSummary: StudentAttendanceSummary | null;
    announcements: AnnouncementItem[];
}

export interface AbsenGuruPageProps {
    todayAttendance: SelfAttendanceStatus;
    currentTime: string;
    currentDate: string;
}

export interface StudentAttendanceRow {
    id: number;
    nis: string;
    name: string;
    gender: 'L' | 'P';
    currentStatus: 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha';
    hasAttended: boolean;
    checkInTime: string | null;
    notes: string;
}

export interface AbsenMuridPageProps {
    hasHomeroomClass: boolean;
    classInfo: HomeroomClassInfo | null;
    students: StudentAttendanceRow[];
    date: string;
    formattedDate: string;
}

export interface DayColumn {
    date: string;
    dayNumber: string;
    dayName: string;
    isWeekend: boolean;
    isToday: boolean;
}

export interface StudentRecapRow {
    id: number;
    nis: string;
    name: string;
    gender: 'L' | 'P';
    dailyStatus: Record<string, 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha'>;
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    totalHadir: number;
    attendancePercentage: number;
}

export interface MonthlyRecapSummary {
    totalHadir: number;
    totalTerlambat: number;
    totalIzin: number;
    totalSakit: number;
    totalAlpha: number;
}

export interface RekapMuridPageProps {
    hasHomeroomClass: boolean;
    classInfo: HomeroomClassInfo | null;
    selectedMonth: string;
    monthLabel: string;
    daysInMonth: DayColumn[];
    students: StudentRecapRow[];
    summary: MonthlyRecapSummary;
}

export interface TeacherProfileData {
    id: number;
    user_id: number;
    nip: string;
    subject: string;
    homeroomClass: HomeroomClassInfo | null;
}

export interface TeacherUserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    avatar: string | null;
    status: string;
}

export interface PengaturanGuruPageProps {
    teacher: TeacherProfileData;
    user: TeacherUserData;
    status?: string | null;
}

