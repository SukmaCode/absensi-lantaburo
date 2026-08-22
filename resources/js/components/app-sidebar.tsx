import { Link } from '@inertiajs/react';
import {
    ClipboardList,
    GraduationCap,
    LayoutGrid,
    Megaphone,
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
    dashboard,
    dataGuru,
    dataSiswa,
    pengumuman,
    schoolProfile,
} from '@/routes/admin';
import { edit } from '@/routes/profile';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
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

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="flex items-center gap-2 px-2 font-semibold text-[10px] tracking-[0.2em] text-white/50 uppercase group-data-[collapsible=icon]:hidden">
                    <span className="h-px flex-1 bg-white/10" />
                    Admin Panel
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
