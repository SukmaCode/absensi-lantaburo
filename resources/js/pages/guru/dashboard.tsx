import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    GraduationCap,
    MapPin,
    Megaphone,
    UserCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { absen, absenMurid, dashboard, rekapMurid } from '@/routes/guru';
import type { Auth } from '@/types';
import type { GuruDashboardProps } from '@/types/guru';

const statusStyles: Record<string, string> = {
    Hadir: 'bg-[#e7f6e0] text-brand border-[#c5eec2]',
    Terlambat: 'bg-[#fdf0d5] text-[#b9770e] border-[#fae1af]',
    Izin: 'bg-[#e0eefe] text-[#1d6fb8] border-[#bedcfc]',
    Sakit: 'bg-[#f1e7fe] text-[#7a3cc0] border-[#e0cbfa]',
    'Tanpa Keterangan': 'bg-neutral-100 text-brand-muted border-neutral-200',
};

export default function GuruDashboard({
    teacherInfo,
    todaySelfAttendance,
    homeroomClass,
    studentSummary,
    announcements,
}: GuruDashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const teacherName = auth.user?.name ?? 'Guru';
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <Head title="Dashboard Guru" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header Welcome */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                            Selamat Datang, {teacherName}
                        </h1>
                        <p className="mt-1 text-sm text-brand-muted">
                            NIP: {teacherInfo.nip} &bull; Mata Pelajaran: {teacherInfo.subject}
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2 text-xs font-medium text-brand-muted shadow-xs">
                        <Calendar className="size-4 text-brand" />
                        <span>{today}</span>
                    </div>
                </div>

                {/* Top Section: Teacher Self Attendance Status Card */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div
                                className={cn(
                                    'flex size-13 shrink-0 items-center justify-center rounded-2xl',
                                    todaySelfAttendance.hasAttended
                                        ? 'bg-[#e7f6e0] text-brand'
                                        : 'bg-amber-100 text-amber-600',
                                )}
                            >
                                {todaySelfAttendance.hasAttended ? (
                                    <CheckCircle2 className="size-7" />
                                ) : (
                                    <Clock className="size-7" />
                                )}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-semibold text-lg text-brand-text">
                                        Absensi Guru Hari Ini
                                    </h2>
                                    <span
                                        className={cn(
                                            'inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium text-xs',
                                            todaySelfAttendance.hasAttended
                                                ? statusStyles[todaySelfAttendance.status ?? 'Hadir']
                                                : 'border-amber-200 bg-amber-50 text-amber-700',
                                        )}
                                    >
                                        {todaySelfAttendance.hasAttended
                                            ? `Sudah Absen (${todaySelfAttendance.status})`
                                            : 'Belum Melakukan Absen'}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-brand-muted">
                                    {todaySelfAttendance.hasAttended
                                        ? `Tercatat pada jam ${todaySelfAttendance.checkInTime} WIB dengan foto selfie & koordinat GPS.`
                                        : 'Wajib melakukan absen masuk setiap hari kerja dengan melampirkan foto selfie dan lokasi GPS.'}
                                </p>
                                {todaySelfAttendance.hasAttended && todaySelfAttendance.latitude && (
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-muted">
                                        <MapPin className="size-3.5 text-brand" />
                                        <a href={`https://www.google.com/maps?q=${todaySelfAttendance.latitude},${todaySelfAttendance.longitude}`} target="_blank" className="text-brand hover:text-brand-dark underline">
                                            GPS: {todaySelfAttendance.latitude.toFixed(6)}, {todaySelfAttendance.longitude?.toFixed(6)}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            {todaySelfAttendance.hasAttended && todaySelfAttendance.photoUrl && (
                                <img
                                    src={todaySelfAttendance.photoUrl}
                                    alt="Foto Absen"
                                    className="size-14 rounded-xl border border-neutral-200 object-cover shadow-xs"
                                />
                            )}
                            <Button
                                asChild
                                className={cn(
                                    'gap-2 rounded-xl px-5 font-semibold text-sm shadow-xs transition-all',
                                    todaySelfAttendance.hasAttended
                                        ? 'border border-neutral-200 bg-neutral-50 text-brand-text hover:bg-neutral-100'
                                        : 'bg-brand text-white hover:bg-brand-dark',
                                )}
                            >
                                <Link href={absen()}>
                                    <Camera className="size-4" />
                                    {todaySelfAttendance.hasAttended ? 'Lihat Detail Absen' : 'Ambil Absen Sekarang'}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Homeroom Class Overview */}
                {homeroomClass ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="size-5 text-brand" />
                                    <h2 className="font-bold text-xl text-brand-text">
                                        Wali Kelas: {homeroomClass.name}
                                    </h2>
                                </div>
                                <p className="mt-0.5 text-xs text-brand-muted">
                                    Tingkat: {homeroomClass.gradeLevel} &bull; Total {homeroomClass.totalStudents} Siswa
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button asChild variant="outline" size="sm" className="rounded-sm border-neutral-200 bg-white hover:bg-black/10">
                                    <Link href={rekapMurid()}>
                                        <Calendar className="mr-1.5 size-4 text-brand" />
                                        <p className="text-xs text-brand">Rekap Bulanan</p>
                                    </Link>
                                </Button>
                                <Button asChild size="sm" className="rounded-sm bg-brand text-white hover:bg-brand-dark">
                                    <Link href={absenMurid()}>
                                        <UserCheck className="mr-1.5 size-4" />
                                        Input Absen Murid
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {studentSummary && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                    <p className="text-xs text-brand-muted">Total Murid</p>
                                    <p className="mt-1 font-bold text-2xl text-brand-text">{studentSummary.totalStudents}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Terdaftar di kelas</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                    <p className="text-xs text-brand-muted">Hadir</p>
                                    <p className="mt-1 font-bold text-2xl text-brand">{studentSummary.hadir}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">{studentSummary.attendanceRate}% tingkat hadir</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                    <p className="text-xs text-brand-muted">Terlambat</p>
                                    <p className="mt-1 font-bold text-2xl text-amber-500">{studentSummary.terlambat}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Masuk lewat jam</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                    <p className="text-xs text-brand-muted">Izin / Sakit</p>
                                    <p className="mt-1 font-bold text-2xl text-blue-500">{studentSummary.izin + studentSummary.sakit}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Izin: {studentSummary.izin}, Sakit: {studentSummary.sakit}</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                    <p className="text-xs text-brand-muted">Tanpa Keterangan</p>
                                    <p className="mt-1 font-bold text-2xl text-rose-500">{studentSummary.alpha}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Alpha / bolos</p>
                                </div>
                                <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                    <p className="text-xs text-brand-muted">Belum Diabsen</p>
                                    <p className="mt-1 font-bold text-2xl text-neutral-400">{studentSummary.belumAbsen}</p>
                                    <p className="mt-0.5 text-[11px] text-brand-muted">Perlu diisi guru</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-brand-muted">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                            <AlertCircle className="size-6 text-neutral-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-brand-text">Bukan Wali Kelas</h3>
                            <p className="text-xs">
                                Anda belum ditugaskan sebagai wali kelas. Fitur absensi murid dan rekap kelas hanya tersedia untuk guru yang bertugas sebagai wali kelas. Hubungi admin sekolah jika ada kekeliruan.
                            </p>
                        </div>
                    </div>
                )}

                {/* Bottom Section: Announcements */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                                <Megaphone className="size-4.5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base text-brand-text">Pengumuman Sekolah</h3>
                                <p className="text-xs text-brand-muted">Informasi terbaru untuk guru dan staf</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col divide-y divide-neutral-50">
                        {announcements.length === 0 ? (
                            <p className="py-6 text-center text-sm text-brand-muted">
                                Belum ada pengumuman terbaru.
                            </p>
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
                                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

GuruDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
