export interface StudentInfo {
    nis: string;
    className: string;
    gradeLevel: string;
    homeroomTeacher: string;
}

export type AttendanceStatus = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha';

export interface TodaySelfieStatus {
    hasUploaded: boolean;
    checkInTime?: string;
    photoUrl?: string | null;
    status?: AttendanceStatus | null;
    statusLabel?: string | null;
}

export interface MonthlyStats {
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
    status: AttendanceStatus | null;
    statusLabel: string;
    checkInTime: string;
    notes: string | null;
    photoUrl: string | null;
}

export interface AnnouncementItem {
    title: string;
    description: string;
    date: string;
    category: string;
}

export interface RegistrationPaymentInfo {
    orderId: string;
    amount: number;
    formattedAmount: string;
    status: string;
    isPaid: boolean;
    isPending: boolean;
    paymentType: string | null;
    snapToken: string | null;
    createdAt: string | null;
}

export interface SiswaDashboardProps {
    studentInfo: StudentInfo;
    todaySelfie: TodaySelfieStatus;
    monthlyStats: MonthlyStats;
    recentHistory: RecentHistoryItem[];
    announcements: AnnouncementItem[];
    registrationPayment?: RegistrationPaymentInfo | null;
    autoOpenSnap?: boolean;
}

export interface TodayAttendanceForAbsen {
    hasUploaded: boolean;
    checkInTime?: string;
    date?: string;
    photoUrl?: string | null;
    status?: AttendanceStatus | null;
    statusLabel?: string | null;
    notes?: string | null;
}

export interface AbsenSiswaPageProps {
    todayAttendance: TodayAttendanceForAbsen;
    currentTime: string;
    currentDate: string;
}

export interface RiwayatStats {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    attendanceRate: number;
    totalRecorded: number;
}

export interface RiwayatItem {
    date: string;
    dayName: string;
    status: AttendanceStatus | null;
    statusLabel: string;
    checkInTime: string;
    notes: string | null;
    photoUrl: string | null;
}

export interface RiwayatSiswaPageProps {
    selectedMonth: string;
    selectedMonthLabel: string;
    prevMonth: string;
    nextMonth: string;
    isCurrentMonth: boolean;
    stats: RiwayatStats;
    history: RiwayatItem[];
}

export interface StudentProfileData {
    id: number;
    user_id: number;
    nis: string;
    class_id: number | null;
    className?: string | null;
    gender: 'L' | 'P';
    birth_date: string | null;
    address: string | null;
    parent_name: string | null;
    parent_phone: string | null;
}

export interface UserProfileData {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    photo: string | null;
    avatar: string | null;
}

export interface ClassOption {
    id: number;
    name: string;
    grade_level: string;
}

export interface PengaturanSiswaPageProps {
    student: StudentProfileData;
    user: UserProfileData;
    classes: ClassOption[];
    status?: string | null;
}

