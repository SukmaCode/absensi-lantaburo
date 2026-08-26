import { Head, usePage } from '@inertiajs/react';
import { Announcements } from '@/components/dashboard/announcements';
import { AttendanceOverview } from '@/components/dashboard/attendance-overview';
import { AttendanceSummary } from '@/components/dashboard/attendance-summary';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentAttendance } from '@/components/dashboard/recent-attendance';
import { WeeklyTrend } from '@/components/dashboard/weekly-trend';
import { dashboard } from '@/routes/admin';
import type { DashboardPageProps } from '@/types/dashboard';

export default function Dashboard({
    attendanceSummary,
    attendanceOverview,
    recentAttendance,
    announcements,
    weeklyTrend,
}: DashboardPageProps) {
    const { auth } = usePage().props;
    const firstName = auth.user?.name?.split(' ')[0] ?? 'Admin';
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 bg-brand-bg p-4 sm:gap-6 sm:p-6">
                <div className='flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                        <h1 className="font-bold text-xl text-brand-text sm:text-2xl lg:text-3xl">
                            Selamat Datang, {firstName}
                        </h1>
                        <p className="mt-1 text-sm text-brand-muted">
                            Berikut ringkasan aktivitas dan kehadiran hari ini.
                        </p>
                        <p className="mt-1.5 text-xs text-brand-muted">{today}</p>
                    </div>
                </div>

                <AttendanceSummary
                    totalStudents={attendanceSummary.totalStudents}
                    totalClasses={attendanceSummary.totalClasses}
                    hadir={attendanceSummary.hadir}
                    terlambat={attendanceSummary.terlambat}
                    belumAbsen={attendanceSummary.belumAbsen}
                    attendanceRate={attendanceSummary.attendanceRate}
                />

                <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[2fr_1fr]">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6">
                            <AttendanceOverview {...attendanceOverview} />
                        </div>
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6">
                            <RecentAttendance records={recentAttendance} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6">
                            <Announcements items={announcements} />
                        </div>
                    </div>
                </div>

                <WeeklyTrend days={weeklyTrend} />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
