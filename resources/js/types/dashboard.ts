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
    string_date: string;
}

export interface PaginationLink {
    label: string;
    url: string | null;
    active: boolean;
}

export interface StudentPagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

export interface TeacherPagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

export interface Pagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

export interface ClassOption {
    id: number;
    name: string;
}

export interface TeacherOption {
    id: number;
    name: string;
    nip: string | null;
    homeroom_class_id?: number | null;
}

export interface ClassPreviewRow {
    id: number;
    name: string;
    grade_level: string;
    homeroom_teacher: string | null;
    homeroom_teacher_id: number | null;
    students_count: number;
}

export interface ClassPagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

export interface DashboardPageProps {
    attendanceSummary: AttendanceSummaryProps;
    attendanceOverview: AttendanceOverviewProps;
    recentAttendance: RecentAttendanceRecord[];
    announcements: AnnouncementItem[];
    weeklyTrend: WeeklyTrendDay[];
}
