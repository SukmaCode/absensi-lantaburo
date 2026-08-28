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
import { MdDashboard, MdSettings } from "react-icons/md";
import { FaClipboardList, FaCamera, FaCalendarAlt } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { GiTeacher, GiMegaphone } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";
import { RiParentFill } from "react-icons/ri";
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
    useSidebar
} from '@/components/ui/sidebar';
import {
    absensi,
    dashboard as adminDashboard,
    dataGuru,
    dataKelas,
    dataSiswa,
    event as adminEvent,
    pengaturan as adminPengaturan,
    pengumuman,
    schoolProfile,
} from '@/routes/admin';
import {
    absen as guruAbsen,
    absenMurid as guruAbsenMurid,
    dashboard as guruDashboard,
    pengaturan as guruPengaturan,
    rekapMurid as guruRekapMurid,
} from '@/routes/guru';
import {
    absen as siswaAbsen,
    dashboard as siswaDashboard,
    pengaturan as siswaPengaturan,
    riwayat as siswaRiwayat,
} from '@/routes/siswa';
import {
    absenAnak as orangtuaAbsenAnak,
    dashboard as orangtuaDashboard,
    pengaturan as orangtuaPengaturan,
} from '@/routes/orangtua';
import { dashboard as calonSiswaDashboard } from '@/routes/calon-siswa';
import type { Auth, NavItem } from '@/types';

const calonSiswaNavItems: NavItem[] = [
    {
        title: 'Status Pendaftaran',
        href: calonSiswaDashboard(),
        icon: MdDashboard,
    },
];

const orangTuaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: orangtuaDashboard(),
        icon: MdDashboard,
    },
    {
        title: 'Rekap Absen Anak',
        href: orangtuaAbsenAnak(),
        icon: FaCalendarAlt,
    },
    {
        title: 'Pengaturan Akun',
        href: orangtuaPengaturan(),
        icon: MdSettings,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard(),
        icon: MdDashboard,
    },
    {
        title: 'Absensi',
        href: absensi(),
        icon: FaClipboardList,
    },
    {
        title: 'Data Siswa',
        href: dataSiswa(),
        icon: PiStudentFill,
    },
    {
        title: 'Data Guru',
        href: dataGuru(),
        icon: GiTeacher,
    },
    {
        title: 'Data Orang Tua',
        href: '/admin/data-orangtua',
        icon: RiParentFill,
    },
    {
        title: 'Data Kelas',
        href: dataKelas(),
        icon: SiGoogleclassroom,
    },
    {
        title: 'Pengumuman',
        href: pengumuman(),
        icon: GiMegaphone,
    },
    {
        title: 'Agenda Kegiatan',
        href: adminEvent(),
        icon: FaCalendarAlt,
    },
    {
        title: 'Pengaturan Sekolah',
        href: schoolProfile(),
        icon: MdSettings,
    },
    {
        title: 'Pengaturan Akun',
        href: adminPengaturan(),
        icon: MdSettings,
    },
];

const guruNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: guruDashboard(),
        icon: MdDashboard,
    },
    {
        title: 'Absen Saya',
        href: guruAbsen(),
        icon: FaCamera,
    },
    {
        title: 'Absen Murid',
        href: guruAbsenMurid(),
        icon: PiStudentFill,
    },
    {
        title: 'Rekap Kehadiran',
        href: guruRekapMurid(),
        icon: FaCalendarAlt,
    },
    {
        title: 'Pengaturan Akun',
        href: guruPengaturan(),
        icon: MdSettings,
    },
];

const siswaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: siswaDashboard(),
        icon: MdDashboard,
    },
    {
        title: 'Absen Saya',
        href: siswaAbsen(),
        icon: FaCamera,
    },
    {
        title: 'Riwayat Kehadiran',
        href: siswaRiwayat(),
        icon: FaCalendarAlt,
    },
    {
        title: 'Pengaturan Akun',
        href: siswaPengaturan(),
        icon: MdSettings,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { isMobile, setOpenMobile } = useSidebar();
    const role = auth.user?.role;
    const isCalonSiswa = role === 'calon_siswa';
    const isOrangTua = role === 'orang_tua' || role === 'parent';
    const isSiswa = role === 'siswa' || role === 'student';
    const isGuru = role === 'guru' || role === 'teacher';

    const mainNavItems = isCalonSiswa
        ? calonSiswaNavItems
        : isOrangTua
          ? orangTuaNavItems
          : isSiswa
            ? siswaNavItems
            : isGuru
              ? guruNavItems
              : adminNavItems;
    const homeUrl = isCalonSiswa
        ? calonSiswaDashboard()
        : isOrangTua
          ? orangtuaDashboard()
          : isSiswa
            ? siswaDashboard()
            : isGuru
              ? guruDashboard()
              : adminDashboard();
    const panelLabel = isCalonSiswa
        ? 'Calon Siswa'
        : isOrangTua
          ? 'Panel Orang Tua'
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
                            <Link
                                href={homeUrl}
                                prefetch
                                onClick={() => {
                                    if (isMobile) {
                                        setOpenMobile(false);
                                    }
                                }}
                            >
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
