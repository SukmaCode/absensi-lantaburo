import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    GraduationCap,
    History,
    Megaphone,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { absenAnak, dashboard } from '@/routes/orangtua';
import type { Auth } from '@/types';
import type { OrangTuaDashboardProps } from '@/types/orangtua';

const statusStyles: Record<string, string> = {
    hadir: 'bg-[#e7f6e0] text-brand border-[#c5eec2]',
    terlambat: 'bg-[#fdf0d5] text-[#b9770e] border-[#fae1af]',
    izin: 'bg-[#e0eefe] text-[#1d6fb8] border-[#bedcfc]',
    sakit: 'bg-[#f1e7fe] text-[#7a3cc0] border-[#e0cbfa]',
    alpha: 'bg-neutral-100 text-neutral-600 border-neutral-200',
};

export default function OrangTuaDashboard({
    children: childrenData,
    hasChildren,
    announcements,
}: OrangTuaDashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const parentName = auth.user?.name ?? 'Orang Tua';
    const [selectedChildIndex, setSelectedChildIndex] = useState(0);

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const currentChild = hasChildren && childrenData.length > 0
        ? childrenData[selectedChildIndex] ?? childrenData[0]
        : null;

    return (
        <>
            <Head title="Dashboard Orang Tua" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                            Selamat Datang, {parentName}
                        </h1>
                        <p className="mt-1 text-sm text-brand-muted">
                            Pantau kehadiran dan aktivitas sekolah anak Anda secara real-time.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2 text-xs font-medium text-brand-muted shadow-xs">
                        <Calendar className="size-4 text-brand" />
                        <span>{today}</span>
                    </div>
                </div>

                {!hasChildren || !currentChild ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-xs">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <Users className="size-8" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg text-brand-text">Belum Ada Data Anak Terhubung</h2>
                            <p className="mt-1 max-w-md text-sm text-brand-muted">
                                Akun Anda belum terhubung dengan data siswa manapun. Silakan hubungi pihak sekolah / admin untuk mengaitkan akun Anda dengan siswa.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Multiple Children Tabs (if more than 1 child) */}
                        {childrenData.length > 1 && (
                            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-100 bg-white p-2 shadow-xs">
                                <span className="px-3 text-xs font-semibold text-brand-muted">Pilih Anak:</span>
                                {childrenData.map((child, idx) => (
                                    <button
                                        key={child.id}
                                        type="button"
                                        onClick={() => setSelectedChildIndex(idx)}
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                                            selectedChildIndex === idx
                                                ? 'bg-brand text-white shadow-xs'
                                                : 'bg-neutral-50 text-brand-muted hover:bg-neutral-100 hover:text-brand-text'
                                        )}
                                    >
                                        <GraduationCap className="size-4" />
                                        <span>{child.name}</span>
                                        <span className="opacity-75 font-normal">({child.className})</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Child Profile Banner */}
                        <div className="flex flex-col gap-4 rounded-2xl border border-brand-soft/50 bg-gradient-to-r from-brand/5 via-brand/10 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-xs">
                                    <GraduationCap className="size-6" />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-bold text-lg text-brand-text">{currentChild.name}</h2>
                                        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
                                            Kelas {currentChild.className}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-brand-muted">
                                        NIS: <span className="font-mono font-medium text-brand-text">{currentChild.nis}</span> &bull; Tingkat: {currentChild.gradeLevel} &bull; Wali Kelas: {currentChild.homeroomTeacher}
                                    </p>
                                </div>
                            </div>
                            <Button asChild size="sm" className="gap-2 rounded-xl bg-brand text-white hover:bg-brand-dark shadow-xs">
                                <Link href={absenAnak.url({ query: { student_id: currentChild.id } })}>
                                    <UserCheck className="size-4" />
                                    Lihat Rekap Absensi Lengkap
                                </Link>
                            </Button>
                        </div>

                        {/* Today's Attendance Card */}
                        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            'flex size-13 shrink-0 items-center justify-center rounded-2xl',
                                            currentChild.todayAttendance.hasAttended
                                                ? 'bg-[#e7f6e0] text-brand'
                                                : 'bg-amber-100 text-amber-600',
                                        )}
                                    >
                                        {currentChild.todayAttendance.hasAttended ? (
                                            <CheckCircle2 className="size-7" />
                                        ) : (
                                            <Clock className="size-7" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-lg text-brand-text">Absensi Hari Ini</h3>
                                            {currentChild.todayAttendance.hasAttended ? (
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium text-xs',
                                                        currentChild.todayAttendance.status
                                                            ? statusStyles[currentChild.todayAttendance.status]
                                                            : 'border-green-200 bg-green-50 text-green-700',
                                                    )}
                                                >
                                                    {currentChild.todayAttendance.statusLabel ?? 'Tercatat'}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-medium text-amber-700 text-xs">
                                                    Belum Ada Catatan Kehadiran
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-brand-muted">
                                            {currentChild.todayAttendance.hasAttended
                                                ? `Anak Anda tercatat hadir pada jam ${currentChild.todayAttendance.checkInTime} WIB.`
                                                : 'Siswa belum melakukan presensi atau belum dikonfirmasi oleh guru hari ini.'}
                                        </p>
                                        {currentChild.todayAttendance.notes && (
                                            <p className="mt-1 text-xs italic text-brand-muted">
                                                Catatan: "{currentChild.todayAttendance.notes}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {currentChild.todayAttendance.hasAttended && currentChild.todayAttendance.photoUrl && (
                                    <div className="flex shrink-0 items-center gap-3">
                                        <img
                                            src={currentChild.todayAttendance.photoUrl}
                                            alt="Foto Selfie Kehadiran"
                                            className="size-16 rounded-xl border border-neutral-200 object-cover shadow-xs"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Monthly Stats Grid */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="size-4.5 text-brand" />
                                    <h3 className="font-bold text-base text-brand-text">
                                        Statistik Kehadiran Bulanan &mdash; {currentChild.monthlyStats.month}
                                    </h3>
                                </div>
                                <span className="text-xs text-brand-muted">
                                    {currentChild.name}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                    <p className="text-xs text-brand-muted">% Kehadiran</p>
                                    <p className="mt-1 font-bold text-2xl text-brand">{currentChild.monthlyStats.attendanceRate}%</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Bulan ini</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                    <p className="text-xs text-brand-muted">Hadir</p>
                                    <p className="mt-1 font-bold text-2xl text-brand">{currentChild.monthlyStats.hadir}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Tepat waktu</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                    <p className="text-xs text-brand-muted">Terlambat</p>
                                    <p className="mt-1 font-bold text-2xl text-amber-500">{currentChild.monthlyStats.terlambat}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Masuk telat</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                    <p className="text-xs text-brand-muted">Izin</p>
                                    <p className="mt-1 font-bold text-2xl text-blue-500">{currentChild.monthlyStats.izin}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Dengan surat</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                    <p className="text-xs text-brand-muted">Sakit</p>
                                    <p className="mt-1 font-bold text-2xl text-purple-500">{currentChild.monthlyStats.sakit}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Surat dokter</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                    <p className="text-xs text-brand-muted">Tanpa Ket.</p>
                                    <p className="mt-1 font-bold text-2xl text-rose-500">{currentChild.monthlyStats.alpha}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Alpha / bolos</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Recent History + Announcements */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Recent History */}
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                                            <History className="size-4.5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-base text-brand-text">Riwayat Presensi Terbaru</h3>
                                            <p className="text-xs text-brand-muted">Catatan kehadiran terkini {currentChild.name}</p>
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="rounded-sm border-neutral-200 bg-white text-xs text-brand hover:bg-black/5">
                                        <Link href={absenAnak.url({ query: { student_id: currentChild.id } })}>
                                            <UserCheck className="mr-1.5 size-3.5" />
                                            Lihat Rekap
                                        </Link>
                                    </Button>
                                </div>

                                <div className="mt-4 flex flex-col divide-y divide-neutral-50">
                                    {currentChild.recentHistory.length === 0 ? (
                                        <div className="flex items-center gap-3 py-6 text-brand-muted">
                                            <AlertCircle className="size-5 text-neutral-300" />
                                            <p className="text-sm">Belum ada riwayat presensi yang tercatat.</p>
                                        </div>
                                    ) : (
                                        currentChild.recentHistory.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    {item.photoUrl ? (
                                                        <img
                                                            src={item.photoUrl}
                                                            alt="Foto"
                                                            className="size-9 rounded-lg border border-neutral-100 object-cover shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-brand-muted">
                                                            <Calendar className="size-4 text-neutral-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm text-brand-text">{item.dayName}, {item.date}</p>
                                                        <p className="text-xs text-brand-muted">Masuk: {item.checkInTime} WIB</p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={cn(
                                                        'shrink-0 rounded-full border px-2.5 py-0.5 font-medium text-xs',
                                                        item.status ? statusStyles[item.status] : 'border-neutral-200 bg-neutral-100 text-neutral-500',
                                                    )}
                                                >
                                                    {item.statusLabel}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Announcements */}
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                                            <Megaphone className="size-4.5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-base text-brand-text">Pengumuman Sekolah</h3>
                                            <p className="text-xs text-brand-muted">Informasi terbaru untuk orang tua dan wali murid</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col divide-y divide-neutral-50">
                                    {announcements.length === 0 ? (
                                        <p className="py-6 text-center text-sm text-brand-muted">Belum ada pengumuman terbaru.</p>
                                    ) : (
                                        announcements.map((item, idx) => (
                                            <div key={idx} className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-medium text-sm text-brand-text">{item.title}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand-dark">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-xs text-brand-muted">{item.date}</span>
                                                    </div>
                                                </div>
                                                <p className="line-clamp-2 text-xs leading-relaxed text-brand-muted">{item.description}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

OrangTuaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
