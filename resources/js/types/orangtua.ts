export interface ChildTodayAttendance {
    hasAttended: boolean;
    status?: string | null;
    statusLabel?: string | null;
    checkInTime?: string | null;
    photoUrl?: string | null;
    notes?: string | null;
}

export interface ChildMonthlyStats {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    attendanceRate: number;
    month: string;
}

export interface RecentHistoryItem {
    date: string;
    dayName: string;
    status: string;
    statusLabel: string;
    checkInTime: string;
    notes?: string | null;
    photoUrl?: string | null;
}

export interface ChildDashboardData {
    id: number;
    name: string;
    nis: string;
    className: string;
    gradeLevel: string;
    homeroomTeacher: string;
    todayAttendance: ChildTodayAttendance;
    monthlyStats: ChildMonthlyStats;
    recentHistory: RecentHistoryItem[];
}

export interface AnnouncementItem {
    title: string;
    description: string;
    date: string;
    category: string;
}

export interface OrangTuaDashboardProps {
    children: ChildDashboardData[];
    hasChildren: boolean;
    announcements: AnnouncementItem[];
}

export interface ChildSimpleInfo {
    id: number;
    name: string;
    nis: string;
}

export interface DayColumn {
    date: string;
    dayNumber: string;
    dayName: string;
    fullDayName: string;
    isWeekend: boolean;
    isToday: boolean;
}

export interface DailySummaryItem {
    date: string;
    dayNumber: string;
    dayName: string;
    fullDayName: string;
    isWeekend: boolean;
    isToday: boolean;
    status?: 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha' | null;
    statusLabel?: string | null;
    checkInTime?: string | null;
    notes?: string | null;
    photoUrl?: string | null;
}

export interface MonthlySummaryStats {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    totalHadir: number;
    attendancePercentage: number;
}

export interface AbsenAnakPageProps {
    hasChildren: boolean;
    children: ChildSimpleInfo[];
    selectedStudent: ChildSimpleInfo | null;
    selectedMonth: string;
    monthLabel: string;
    daysInMonth: DayColumn[];
    dailySummary: DailySummaryItem[];
    summary: MonthlySummaryStats;
}

export interface OrangTuaUserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    avatar: string | null;
}

export interface PengaturanOrangTuaPageProps {
    user: OrangTuaUserData;
    status?: string | null;
}
