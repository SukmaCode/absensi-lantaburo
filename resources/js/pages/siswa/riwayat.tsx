import { Head, Link, router } from '@inertiajs/react';
import {
    FaArrowLeft,
    FaArrowTrendUp,
    FaBookOpen,
    FaCalendarDays,
    FaChevronLeft,
    FaChevronRight,
    FaCircleExclamation,
} from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard, riwayat } from '@/routes/siswa';
import type { RiwayatSiswaPageProps } from '@/types/siswa';

const statusStyles: Record<string, string> = {
    hadir: 'bg-[#e7f6e0] text-brand border-[#c5eec2]',
    terlambat: 'bg-[#fdf0d5] text-[#b9770e] border-[#fae1af]',
    izin: 'bg-[#e0eefe] text-[#1d6fb8] border-[#bedcfc]',
    sakit: 'bg-[#f1e7fe] text-[#7a3cc0] border-[#e0cbfa]',
    alpha: 'bg-neutral-100 text-neutral-600 border-neutral-200',
};

const statCards = (stats: RiwayatSiswaPageProps['stats']) => [
    { label: '% Kehadiran', value: `${stats.attendanceRate}%`, color: 'text-brand', sub: 'Dari total tercatat' },
    { label: 'Hadir', value: stats.hadir, color: 'text-brand', sub: 'Tepat waktu' },
    { label: 'Terlambat', value: stats.terlambat, color: 'text-amber-500', sub: 'Masuk lewat jam' },
    { label: 'Izin', value: stats.izin, color: 'text-blue-500', sub: 'Izin resmi' },
    { label: 'Sakit', value: stats.sakit, color: 'text-purple-500', sub: 'Dengan keterangan' },
    { label: 'Alpha', value: stats.alpha, color: 'text-rose-500', sub: 'Tanpa keterangan' },
];

export default function RiwayatSiswaPage({
    selectedMonth,
    selectedMonthLabel,
    prevMonth,
    nextMonth,
    isCurrentMonth,
    stats,
    history,
}: RiwayatSiswaPageProps) {
    const navigateMonth = (month: string) => {
        router.get(riwayat.url({ query: { month } }), {}, { preserveScroll: true, preserveState: false });
    };

    return (
        <>
            <Head title="Riwayat Kehadiran" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 px-2 text-brand-muted hover:text-brand-text">
                                <Link href={dashboard()}>
                                    <FaArrowLeft className="mr-1 size-4" />
                                    Kembali ke Dashboard
                                </Link>
                            </Button>
                        </div>
                        <h1 className="mt-1 font-bold text-2xl text-brand-text sm:text-3xl">Riwayat Kehadiran</h1>
                        <p className="mt-0.5 text-sm text-brand-muted">Data kehadiran yang telah dikonfirmasi oleh guru wali kelas</p>
                    </div>

                    {/* Month Navigation */}
                    <div className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-2 py-1.5 shadow-xs">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateMonth(prevMonth)}
                            className="size-7 rounded-lg text-brand-muted hover:text-brand-text"
                        >
                            <FaChevronLeft className="size-4" />
                        </Button>
                        <div className="flex items-center gap-2 px-2">
                            <FaCalendarDays className="size-4 text-brand" />
                            <span className="min-w-32 text-center font-semibold text-sm text-brand-text">{selectedMonthLabel}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateMonth(nextMonth)}
                            disabled={isCurrentMonth}
                            className="size-7 rounded-lg text-brand-muted hover:text-brand-text disabled:opacity-30"
                        >
                            <FaChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <FaArrowTrendUp className="size-4.5 text-brand" />
                        <h2 className="font-bold text-base text-brand-text">Ringkasan {selectedMonthLabel}</h2>
                        {stats.totalRecorded === 0 && (
                            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                                Belum ada data
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {statCards(stats).map((card) => (
                            <div key={card.label} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                <p className="text-xs text-brand-muted">{card.label}</p>
                                <p className={cn('mt-1 font-bold text-2xl', card.color)}>{card.value}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">{card.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History Timeline */}
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-xs">
                    <div className="flex items-center gap-2 border-b border-neutral-100 p-5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                            <FaCalendarDays className="size-4.5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base text-brand-text">Detail Absensi</h3>
                            <p className="text-xs text-brand-muted">{selectedMonthLabel} &bull; {history.length} catatan</p>
                        </div>
                    </div>

                    <div className="divide-y divide-neutral-50">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-brand-muted">
                                <FaCircleExclamation className="size-10 text-neutral-200" />
                                <div>
                                    <p className="font-medium text-sm text-brand-text">Belum ada data untuk {selectedMonthLabel}</p>
                                    <p className="mt-1 text-xs">Data akan tampil setelah guru wali kelas mengisi status kehadiran Anda.</p>
                                </div>
                            </div>
                        ) : (
                            history.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 px-5 py-4">
                                    {/* Selfie Thumbnail */}
                                    {item.photoUrl ? (
                                        <img
                                            src={item.photoUrl}
                                            alt="selfie"
                                            className="size-12 shrink-0 rounded-xl border border-neutral-100 object-cover shadow-xs"
                                        />
                                    ) : (
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                                            <FaBookOpen className="size-5 text-neutral-400" />
                                        </div>
                                    )}

                                    {/* Date Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold text-sm text-brand-text">{item.dayName}, {item.date}</p>
                                            <span
                                                className={cn(
                                                    'shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-xs',
                                                    item.status ? statusStyles[item.status] : 'border-neutral-200 bg-neutral-100 text-neutral-500',
                                                )}
                                            >
                                                {item.statusLabel}
                                            </span>
                                        </div>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-brand-muted">
                                            <span>Masuk: {item.checkInTime} WIB</span>
                                            {item.notes && (
                                                <span className="truncate max-w-xs" title={item.notes}>
                                                    Catatan: {item.notes}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

RiwayatSiswaPage.layout = {
    breadcrumbs: [
        {
            title: 'Riwayat Kehadiran',
            href: riwayat(),
        },
    ],
};
