import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { absensi } from '@/routes/admin';
import { Pagination } from '@/types/dashboard';

interface AttendanceRow {
    name: string;
    date: string;
    time: string;
    status: string;
}

interface AttendanceData {
    data: AttendanceRow[];
    pagination: Pagination;
}

type Tab = 'siswa' | 'guru';

const statusStyles: Record<string, string> = {
    Hadir: 'bg-[#e7f6e0] text-brand',
    Terlambat: 'bg-[#fdf0d5] text-[#b9770e]',
    Izin: 'bg-[#e0eefe] text-[#1d6fb8]',
    Sakit: 'bg-[#f1e7fe] text-[#7a3cc0]',
    'Tanpa Keterangan': 'bg-neutral-100 text-brand-muted',
};

export default function Absensi({
    studentAttendances,
    teacherAttendances,
}: {
    studentAttendances: AttendanceData;
    teacherAttendances: AttendanceData;
}) {
    const [tab, setTab] = useState<Tab>('siswa');

    const current = tab === 'siswa' ? studentAttendances : teacherAttendances;
    const { data: rows, pagination } = current;

    const goToPage = (page: number) => {
        router.get(
            absensi(),
            { page, tab },
            { preserveState: true, preserveScroll: true },
        );
    };

    const switchTab = (next: Tab) => {
        setTab(next);
        router.get(
            absensi(),
            { tab: next, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    const maxButtons = 10;
    const startPage =
        Math.floor((pagination.current_page - 1) / maxButtons) * maxButtons + 1;
    const endPage = Math.min(startPage + maxButtons - 1, pagination.last_page);
    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i,
    );

    return (
        <>
            <Head title="Rekap Kehadiran" />
            <div className="h-full border border-neutral-100 bg-white p-6">
                <div>
                    <h2 className="font-semibold text-base text-brand-text">
                        Rekap Kehadiran
                    </h2>
                    <p className="mt-0.5 text-sm text-brand-muted">
                        Rekap kehadiran siswa dan guru berdasarkan absen masuk
                    </p>
                </div>

                <div className="mt-5 inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
                    <button
                        type="button"
                        onClick={() => switchTab('siswa')}
                        className={cn(
                            'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                            tab === 'siswa'
                                ? 'bg-white text-brand shadow-sm'
                                : 'text-brand-muted hover:text-brand-text',
                        )}
                    >
                        Siswa
                    </button>
                    <button
                        type="button"
                        onClick={() => switchTab('guru')}
                        className={cn(
                            'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                            tab === 'guru'
                                ? 'bg-white text-brand shadow-sm'
                                : 'text-brand-muted hover:text-brand-text',
                        )}
                    >
                        Guru
                    </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-130 text-left text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                                <th className="pb-3 font-medium">No</th>
                                <th className="pb-3 font-medium">Nama</th>
                                <th className="pb-3 font-medium">Tanggal</th>
                                <th className="pb-3 font-medium">
                                    Waktu Absen
                                </th>
                                <th className="pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft">
                                                <ClipboardList className="size-6 text-brand-dark" />
                                            </div>
                                            <p className="text-sm text-brand-muted">
                                                Belum ada data rekap kehadiran
                                                untuk{' '}
                                                {tab === 'siswa'
                                                    ? 'siswa'
                                                    : 'guru'}
                                                .
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, index) => (
                                    <tr
                                        key={`${row.name}-${index}`}
                                        className="border-b border-neutral-50 last:border-0"
                                    >
                                        <td className="py-3 text-brand-muted tabular-nums">
                                            {(pagination.current_page - 1) *
                                                pagination.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td className="py-3 font-medium text-brand-text">
                                            {row.name}
                                        </td>
                                        <td className="py-3 text-brand-muted tabular-nums">
                                            {row.date}
                                        </td>
                                        <td className="py-3 text-brand-muted tabular-nums">
                                            {row.time}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center rounded-md px-2 py-0.5 font-medium text-xs',
                                                    statusStyles[row.status] ??
                                                    'bg-neutral-100 text-brand-muted',
                                                )}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-brand-muted">
                        Menampilkan {pagination.total}{' '}
                        {tab === 'siswa' ? 'siswa' : 'guru'}
                    </p>
                    {pagination.last_page > 1 && (
                        <div className="flex flex-wrap items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    goToPage(pagination.current_page - 1)
                                }
                                disabled={pagination.current_page === 1}
                                className="border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            {pages.map((pageNumber) => (
                                <Button
                                    key={pageNumber}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(pageNumber)}
                                    className={cn(
                                        'border-neutral-200 bg-white text-brand-text hover:bg-brand-soft',
                                        pageNumber === pagination.current_page &&
                                        'border-brand bg-brand text-white hover:bg-brand-dark',
                                    )}
                                >
                                    {pageNumber}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    goToPage(pagination.current_page + 1)
                                }
                                disabled={
                                    pagination.current_page ===
                                    pagination.last_page
                                }
                                className="border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Absensi.layout = {
    breadcrumbs: [
        {
            title: 'Rekap Kehadiran',
            href: absensi(),
        },
    ],
};
