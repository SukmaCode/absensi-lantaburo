export interface AdminUserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    avatar: string | null;
    status: string;
    role: string;
    created_at: string;
    email_verified_at: string | null;
}

export interface AdminSystemStats {
    totalTeachers: number;
    totalStudents: number;
    totalClasses: number;
    schoolName: string;
}

export interface PengaturanAdminPageProps {
    user: AdminUserData;
    systemStats: AdminSystemStats;
    status?: string | null;
}
