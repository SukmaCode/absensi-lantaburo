import type { PaginationLink } from './dashboard';

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

export interface StudentRelationItem {
    id: number;
    name: string;
    nis: string;
    class?: string | null;
}

export interface ParentPreviewRow {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'Aktif' | 'Nonaktif';
    raw_status?: string;
    avatar: string | null;
    students: StudentRelationItem[];
    student_ids: number[];
}

export interface ParentPagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

export interface AvailableStudentOption {
    id: number;
    name: string;
    nis: string;
    class?: string | null;
    parent_id?: number | null;
}
