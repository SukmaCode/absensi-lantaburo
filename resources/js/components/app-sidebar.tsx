import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Camera,
    ClipboardList,
    GraduationCap,
    LayoutGrid,
    Megaphone,
    School,
    Settings,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    absensi,
    dashboard as adminDashboard,
    dataGuru,
    dataKelas,
    dataSiswa,
    pengumuman,
    schoolProfile,
} from '@/routes/admin';
import {
    absen as guruAbsen,
    absenMurid as guruAbsenMurid,
    dashboard as guruDashboard,
    rekapMurid as guruRekapMurid,
} from '@/routes/guru';
import {
    absen as siswaAbsen,
    dashboard as siswaDashboard,
    pengaturan as siswaPengaturan,
    riwayat as siswaRiwayat,
} from '@/routes/siswa';
import { dashboard as calonSiswaDashboard } from '@/routes/calon-siswa';
import { edit } from '@/routes/profile';
import type { Auth, NavItem } from '@/types';

const calonSiswaNavItems: NavItem[] = [
    {
        title: 'Status Pendaftaran',
        href: calonSiswaDashboard(),
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Absensi',
        href: absensi(),
        icon: ClipboardList,
    },
    {
        title: 'Data Siswa',
        href: dataSiswa(),
        icon: Users,
    },
    {
        title: 'Data Guru',
        href: dataGuru(),
        icon: GraduationCap,
    },
    {
        title: 'Data Kelas',
        href: dataKelas(),
        icon: School,
    },
    {
        title: 'Pengumuman',
        href: pengumuman(),
        icon: Megaphone,
    },
    {
        title: 'Pengaturan Sekolah',
        href: schoolProfile(),
        icon: Settings,
    },
    {
        title: 'Pengaturan',
        href: edit(),
        icon: Settings,
    },
];

const guruNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: guruDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Absen Saya',
        href: guruAbsen(),
        icon: Camera,
    },
    {
        title: 'Absen Murid',
        href: guruAbsenMurid(),
        icon: Users,
    },
    {
        title: 'Rekap Kehadiran',
        href: guruRekapMurid(),
        icon: CalendarDays,
    },
    {
        title: 'Pengaturan',
        href: edit(),
        icon: Settings,
    },
];

const siswaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: siswaDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Absen Saya',
        href: siswaAbsen(),
        icon: Camera,
    },
    {
        title: 'Riwayat Kehadiran',
        href: siswaRiwayat(),
        icon: CalendarDays,
    },
    {
        title: 'Pengaturan Akun',
        href: siswaPengaturan(),
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth.user?.role;
    const isCalonSiswa = role === 'calon_siswa';
    const isSiswa = role === 'siswa' || role === 'student';
    const isGuru = role === 'guru' || role === 'teacher';

    const mainNavItems = isCalonSiswa
        ? calonSiswaNavItems
        : isSiswa
          ? siswaNavItems
          : isGuru
            ? guruNavItems
            : adminNavItems;
    const homeUrl = isCalonSiswa
        ? calonSiswaDashboard()
        : isSiswa
          ? siswaDashboard()
          : isGuru
            ? guruDashboard()
            : adminDashboard();
    const panelLabel = isCalonSiswa
        ? 'Calon Siswa'
        : isSiswa
          ? 'Panel Siswa'
          : isGuru
            ? 'Panel Guru'
            : 'Admin Panel';

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="flex items-center gap-2 px-2 font-semibold text-[10px] tracking-[0.2em] text-white/50 uppercase group-data-[collapsible=icon]:hidden">
                    <span className="h-px flex-1 bg-white/10" />
                    {panelLabel}
                    <span className="h-px flex-1 bg-white/10" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
