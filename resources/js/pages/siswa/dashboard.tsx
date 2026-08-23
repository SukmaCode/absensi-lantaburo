import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    History,
    Megaphone,
    TrendingUp,
    UserCheck,
} from 'lucide-react';
import { useEffect } from 'react';
import RegistrationPaymentCard from '@/components/registration-payment-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { absen, dashboard, riwayat } from '@/routes/siswa';
import type { Auth } from '@/types';
import type { SiswaDashboardProps } from '@/types/siswa';

const statusStyles: Record<string, string> = {
    hadir: 'bg-[#e7f6e0] text-brand border-[#c5eec2]',
    terlambat: 'bg-[#fdf0d5] text-[#b9770e] border-[#fae1af]',
    izin: 'bg-[#e0eefe] text-[#1d6fb8] border-[#bedcfc]',
    sakit: 'bg-[#f1e7fe] text-[#7a3cc0] border-[#e0cbfa]',
    alpha: 'bg-neutral-100 text-neutral-600 border-neutral-200',
};

const statusColors: Record<string, string> = {
    hadir: 'text-brand',
    terlambat: 'text-amber-500',
    izin: 'text-blue-500',
    sakit: 'text-purple-500',
    alpha: 'text-rose-500',
};

export default function SiswaDashboard({
    studentInfo,
    todaySelfie,
    monthlyStats,
    recentHistory,
    announcements,
    registrationPayment,
    autoOpenSnap,
}: SiswaDashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const studentName = auth.user?.name ?? 'Siswa';
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    useEffect(() => {
        if (autoOpenSnap && registrationPayment?.snapToken && registrationPayment.isPending) {
            const timer = setTimeout(() => {
                if (window.snap) {
                    window.snap.pay(registrationPayment.snapToken!, {
                        onSuccess: () => {
                            router.reload({ only: ['registrationPayment'] });
                        },
                        onPending: () => {
                            router.reload({ only: ['registrationPayment'] });
                        },
                        onError: () => {
                            router.reload({ only: ['registrationPayment'] });
                        },
                        onClose: () => {
                            router.reload({ only: ['registrationPayment'] });
                        },
                    });
                }
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [autoOpenSnap, registrationPayment]);

    return (
        <>
            <Head title="Dashboard Siswa" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                            Selamat Datang, {studentName}
                        </h1>
                        <p className="mt-1 text-sm text-brand-muted">
                            NIS: {studentInfo.nis} &bull; Kelas: {studentInfo.className} &bull; Wali Kelas:{' '}
                            {studentInfo.homeroomTeacher}
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2 text-xs font-medium text-brand-muted shadow-xs">
                        <Calendar className="size-4 text-brand" />
                        <span>{today}</span>
                    </div>
                </div>

                {/* Registration Payment Banner / Card */}
                {registrationPayment && (
                    <RegistrationPaymentCard
                        payment={registrationPayment}
                        onPaymentSuccess={() => {
                            router.reload({ only: ['registrationPayment'] });
                        }}
                    />
                )}

                {/* Selfie Status Card */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div
                                className={cn(
                                    'flex size-13 shrink-0 items-center justify-center rounded-2xl',
                                    todaySelfie.hasUploaded
                                        ? 'bg-[#e7f6e0] text-brand'
                                        : 'bg-amber-100 text-amber-600',
                                )}
                            >
                                {todaySelfie.hasUploaded ? (
                                    <CheckCircle2 className="size-7" />
                                ) : (
                                    <Clock className="size-7" />
                                )}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-semibold text-lg text-brand-text">Absensi Hari Ini</h2>
                                    {todaySelfie.hasUploaded ? (
                                        <span
                                            className={cn(
                                                'inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium text-xs',
                                                todaySelfie.status
                                                    ? statusStyles[todaySelfie.status]
                                                    : 'border-green-200 bg-green-50 text-green-700',
                                            )}
                                        >
                                            {todaySelfie.statusLabel
                                                ? `Dikonfirmasi: ${todaySelfie.statusLabel}`
                                                : 'Foto Terkirim — Menunggu Konfirmasi Guru'}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-medium text-amber-700 text-xs">
                                            Belum Upload Selfie
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-brand-muted">
                                    {todaySelfie.hasUploaded
                                        ? `Foto dikirim jam ${todaySelfie.checkInTime} WIB. Status kehadiran ditentukan oleh guru wali kelas.`
                                        : 'Upload foto selfie sebagai bukti kehadiran Anda. Status akan dikonfirmasi oleh guru.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            {todaySelfie.hasUploaded && todaySelfie.photoUrl && (
                                <img
                                    src={todaySelfie.photoUrl}
                                    alt="Foto Selfie"
                                    className="size-14 rounded-xl border border-neutral-200 object-cover shadow-xs"
                                />
                            )}
                            <Button
                                asChild
                                className={cn(
                                    'gap-2 rounded-xl px-5 font-semibold text-sm shadow-xs transition-all',
                                    todaySelfie.hasUploaded
                                        ? 'border border-neutral-200 bg-neutral-50 text-brand-text hover:bg-neutral-100'
                                        : 'bg-brand text-white hover:bg-brand-dark',
                                )}
                            >
                                <Link href={absen()}>
                                    <Camera className="size-4" />
                                    {todaySelfie.hasUploaded ? 'Lihat Absen' : 'Upload Selfie Sekarang'}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Monthly Stats Grid */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <TrendingUp className="size-4.5 text-brand" />
                        <h2 className="font-bold text-base text-brand-text">
                            Statistik Kehadiran &mdash; {monthlyStats.month}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                            <p className="text-xs text-brand-muted">% Kehadiran</p>
                            <p className="mt-1 font-bold text-2xl text-brand">{monthlyStats.attendanceRate}%</p>
                            <p className="mt-0.5 text-[11px] text-brand-muted">Bulan ini</p>
                        </div>
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                            <p className="text-xs text-brand-muted">Hadir</p>
                            <p className="mt-1 font-bold text-2xl text-brand">{monthlyStats.hadir}</p>
                            <p className="mt-0.5 text-[11px] text-brand-muted">Hari tepat waktu</p>
                        </div>
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                            <p className="text-xs text-brand-muted">Terlambat</p>
                            <p className="mt-1 font-bold text-2xl text-amber-500">{monthlyStats.terlambat}</p>
                            <p className="mt-0.5 text-[11px] text-brand-muted">Masuk lewat jam</p>
                        </div>
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                            <p className="text-xs text-brand-muted">Izin</p>
                            <p className="mt-1 font-bold text-2xl text-blue-500">{monthlyStats.izin}</p>
                            <p className="mt-0.5 text-[11px] text-brand-muted">Izin resmi</p>
                        </div>
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                            <p className="text-xs text-brand-muted">Sakit</p>
                            <p className="mt-1 font-bold text-2xl text-purple-500">{monthlyStats.sakit}</p>
                            <p className="mt-0.5 text-[11px] text-brand-muted">Dengan keterangan</p>
                        </div>
                        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                            <p className="text-xs text-brand-muted">Tanpa Ket.</p>
                            <p className="mt-1 font-bold text-2xl text-rose-500">{monthlyStats.alpha}</p>
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
                                    <h3 className="font-semibold text-base text-brand-text">Riwayat Terkini</h3>
                                    <p className="text-xs text-brand-muted">7 catatan terakhir</p>
                                </div>
                            </div>
                            <Button asChild variant="outline" size="sm" className="rounded-sm border-neutral-200 bg-white text-xs text-brand hover:bg-black/10">
                                <Link href={riwayat()}>
                                    <UserCheck className="mr-1.5 size-3.5" />
                                    Lihat Semua
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-4 flex flex-col divide-y divide-neutral-50">
                            {recentHistory.length === 0 ? (
                                <div className="flex items-center gap-3 py-6 text-brand-muted">
                                    <AlertCircle className="size-5 text-neutral-300" />
                                    <p className="text-sm">Belum ada riwayat kehadiran yang dikonfirmasi.</p>
                                </div>
                            ) : (
                                recentHistory.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            {item.photoUrl ? (
                                                <img
                                                    src={item.photoUrl}
                                                    alt="selfie"
                                                    className="size-9 rounded-lg border border-neutral-100 object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                                                    <BookOpen className="size-4 text-neutral-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-sm text-brand-text">{item.dayName}, {item.date}</p>
                                                <p className="text-xs text-brand-muted">Masuk: {item.checkInTime}</p>
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
                                    <p className="text-xs text-brand-muted">Informasi terbaru untuk siswa</p>
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
            </div>
        </>
    );
}

SiswaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
