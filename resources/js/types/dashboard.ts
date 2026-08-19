export interface AttendanceSummaryProps {
    totalStudents: number;
    totalClasses: number;
    hadir: number;
    terlambat: number;
    belumAbsen: number;
    attendanceRate: number;
}

export interface AttendanceOverviewProps {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    belumAbsen: number;
    alpha: number;
    totalStudents: number;
}

export interface RecentAttendanceRecord {
    name: string;
    role: 'Siswa' | 'Guru';
    status: 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit';
    time: string;
}

export interface AnnouncementItem {
    title: string;
    description: string;
    date: string;
    category: 'Umum' | 'Guru' | 'Siswa';
}

export interface WeeklyTrendDay {
    day: string;
    value: number;
    today?: boolean;
}

export interface StudentPreviewRow {
    name: string;
    nis: string;
    class: string | null;
    status: 'Aktif' | 'Nonaktif';
    avatar: string | null;
}

export interface DashboardPageProps {
    attendanceSummary: AttendanceSummaryProps;
    attendanceOverview: AttendanceOverviewProps;
    recentAttendance: RecentAttendanceRecord[];
    announcements: AnnouncementItem[];
    weeklyTrend: WeeklyTrendDay[];
    students: StudentPreviewRow[];
}
