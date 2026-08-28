import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    FileSpreadsheet,
    GraduationCap,
    Printer,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { rekapMurid } from '@/routes/guru';
import { exportMethod as exportRekapMurid } from '@/routes/guru/rekap-murid';
import type { RekapMuridPageProps } from '@/types/guru';

const statusBadgeStyles: Record<string, string> = {
    hadir: 'bg-[#e7f6e0] text-brand font-bold',
    terlambat: 'bg-[#fdf0d5] text-[#b9770e] font-bold',
    izin: 'bg-[#e0eefe] text-[#1d6fb8] font-bold',
    sakit: 'bg-[#f1e7fe] text-[#7a3cc0] font-bold',
    alpha: 'bg-rose-100 text-rose-700 font-bold',
};

const statusInitial: Record<string, string> = {
    hadir: 'H',
    terlambat: 'T',
    izin: 'I',
    sakit: 'S',
    alpha: 'A',
};

export default function RekapMuridPage({
    hasHomeroomClass,
    classInfo,
    selectedMonth,
    monthLabel,
    daysInMonth,
    students,
    summary,
}: RekapMuridPageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Handle Month Change
    const handleMonthChange = (newMonth: string) => {
        router.get(
            rekapMurid.url({ query: { month: newMonth } }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    // Previous & Next Month Navigation
    const navigateMonth = (direction: -1 | 1) => {
        const [year, month] = selectedMonth.split('-').map(Number);
        const date = new Date(year, month - 1 + direction, 1);
        const nextMonthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        handleMonthChange(nextMonthStr);
    };

    // Filter Students
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return students;
        const q = searchQuery.toLowerCase();
        return students.filter(
            (s) => s.name.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
        );
    }, [students, searchQuery]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = () => {
        window.location.href = exportRekapMurid.url({ query: { month: selectedMonth } });
    };

    return (
        <>
            <Head title="Rekap Kehadiran Murid" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8 print:p-0 print:bg-white">
                {/* Header Section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="size-6 text-brand" />
                            <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                                Rekap Kehadiran Murid
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-brand-muted">
                            {classInfo
                                ? `Rekap presensi bulanan siswa kelas ${classInfo.name} (${classInfo.gradeLevel})`
                                : 'Rekap kehadiran siswa perbulan'}
                        </p>
                    </div>

                    {/* Month Picker & Navigation */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center justify-center rounded-sm border border-neutral-200 bg-white p-1 shadow-xs">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateMonth(-1)}
                                className="size-8 p-0 text-brand-muted hover:text-brand-text"
                            >
                                <ChevronLeft className="size-4" />
                            </Button>

                            <div className="flex items-center justify-center gap-1.5">
                                <Calendar className="size-4 text-brand" />
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => handleMonthChange(e.target.value)}
                                    className="border-0 bg-transparent text-xs text-center font-semibold text-brand-text outline-none"
                                />
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateMonth(1)}
                                className="size-8 p-0 text-brand-muted hover:text-brand-text"
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportExcel}
                            disabled={!hasHomeroomClass}
                            className="rounded-sm border-emerald-600 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors shadow-2xs"
                        >
                            <Download className="mr-1.5 size-3.5 text-emerald-700" />
                            Export Excel
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="rounded-sm border-neutral-200 bg-white text-xs font-medium text-brand-text hover:bg-brand-soft"
                        >
                            <Printer className="mr-1.5 size-3.5 text-brand" />
                            Cetak Rekap
                        </Button>
                    </div>
                </div>

                {/* Print Only Header */}
                <div className="hidden print:block mb-4 border-b pb-3">
                    <h1 className="text-xl font-bold text-black">Rekapitulasi Kehadiran Siswa</h1>
                    <p className="text-xs text-neutral-600">
                        Kelas: {classInfo?.name} &bull; Periode: {monthLabel} &bull; Total: {students.length} Siswa
                    </p>
                </div>

                {!hasHomeroomClass ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-xs">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <AlertCircle className="size-8" />
                        </div>
                        <h2 className="font-semibold text-lg text-brand-text">Anda Belum Ditugaskan Sebagai Wali Kelas</h2>
                        <p className="max-w-md text-xs text-brand-muted">
                            Rekap kehadiran murid hanya tersedia untuk guru yang bertugas sebagai wali kelas.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Summary Metrics Bar */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 print:hidden">
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                <span className="text-xs text-brand-muted">Total Kehadiran</span>
                                <p className="mt-1 font-bold text-2xl text-brand">{summary.totalHadir}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Siswa hadir tepat waktu</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                <span className="text-xs text-brand-muted">Total Terlambat</span>
                                <p className="mt-1 font-bold text-2xl text-[#b9770e]">{summary.totalTerlambat}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Siswa masuk telat</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                <span className="text-xs text-brand-muted">Total Izin</span>
                                <p className="mt-1 font-bold text-2xl text-[#1d6fb8]">{summary.totalIzin}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Dengan surat izin</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                <span className="text-xs text-brand-muted">Total Sakit</span>
                                <p className="mt-1 font-bold text-2xl text-[#7a3cc0]">{summary.totalSakit}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Dengan surat dokter</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4">
                                <span className="text-xs text-brand-muted">Total Alpha</span>
                                <p className="mt-1 font-bold text-2xl text-rose-600">{summary.totalAlpha}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Tanpa keterangan</p>
                            </div>
                        </div>

                        {/* Search & Month Filter Title */}
                        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs print:border-0 print:p-0 print:shadow-none">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden mb-4">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="size-5 text-brand" />
                                    <h2 className="font-semibold text-base text-brand-text">
                                        Matriks Kehadiran: {monthLabel}
                                    </h2>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari nama atau NIS..."
                                        className="h-9 rounded-sm pl-9 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Pivot Table Matrix */}
                            <div className="overflow-x-auto rounded-sm border border-neutral-100 print:border-neutral-300">
                                <table className="w-full text-center text-xs border-collapse custom-scrollbar">
                                    <thead>
                                        <tr className="bg-neutral-50/80 text-brand-muted border-b border-neutral-100">
                                            <th className="sticky left-0 z-10 bg-neutral-50 p-2 font-semibold text-left w-8">No</th>
                                            <th className="sticky left-8 z-10 bg-neutral-50 p-2 font-semibold text-left min-w-44">Nama Siswa</th>
                                            <th className="bg-neutral-50 p-2 font-semibold text-left w-24">NIS</th>
                                            <th className="bg-neutral-50 p-2 font-semibold w-8">L/P</th>

                                            {/* Date Columns */}
                                            {daysInMonth.map((day) => (
                                                <th
                                                    key={day.date}
                                                    className={cn(
                                                        'p-1.5 font-semibold text-[11px] min-w-7 border-l border-neutral-100',
                                                        day.isWeekend && 'bg-neutral-100/70 text-neutral-400',
                                                        day.isToday && 'bg-brand-soft text-brand-dark font-bold',
                                                    )}
                                                >
                                                    <div>{day.dayNumber}</div>
                                                    <div className="text-[9px] font-normal">{day.dayName.slice(0, 3)}</div>
                                                </th>
                                            ))}

                                            {/* Summary Headers */}
                                            <th className="p-2 font-bold text-brand bg-emerald-50/70 border-l border-neutral-200 w-8">H</th>
                                            <th className="p-2 font-bold text-[#b9770e] bg-amber-50/70 w-8">T</th>
                                            <th className="p-2 font-bold text-[#1d6fb8] bg-blue-50/70 w-8">I</th>
                                            <th className="p-2 font-bold text-[#7a3cc0] bg-purple-50/70 w-8">S</th>
                                            <th className="p-2 font-bold text-rose-600 bg-rose-50/70 w-8">A</th>
                                            <th className="p-2 font-bold text-brand-text bg-neutral-100/70 w-12">%</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {filteredStudents.length === 0 ? (
                                            <tr>
                                                <td colSpan={daysInMonth.length + 10} className="py-12 text-center text-brand-muted">
                                                    Tidak ada data siswa ditemukan.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStudents.map((student, idx) => (
                                                <tr key={student.id} className="hover:bg-neutral-50/60 transition-colors">
                                                    <td className="sticky left-0 z-10 bg-white p-2 text-left text-brand-muted tabular-nums">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="sticky left-8 z-10 bg-white p-2 text-left font-medium text-brand-text truncate">
                                                        {student.name}
                                                    </td>
                                                    <td className="bg-white p-2 text-left font-mono text-[11px] text-brand-muted">
                                                        {student.nis}
                                                    </td>
                                                    <td className="bg-white p-2 text-brand-muted">
                                                        <span
                                                            className={cn(
                                                                'inline-flex size-5 items-center justify-center rounded text-[10px] font-semibold',
                                                                student.gender === 'L'
                                                                    ? 'bg-blue-50 text-blue-600'
                                                                    : 'bg-pink-50 text-pink-600',
                                                            )}
                                                        >
                                                            {student.gender}
                                                        </span>
                                                    </td>

                                                    {/* Day Cells */}
                                                    {daysInMonth.map((day) => {
                                                        const status = student.dailyStatus[day.date];
                                                        return (
                                                            <td
                                                                key={day.date}
                                                                className={cn(
                                                                    'p-0.5 border-l border-neutral-100',
                                                                    day.isWeekend && 'bg-neutral-50/50',
                                                                )}
                                                            >
                                                                {status ? (
                                                                    <span
                                                                        className={cn(
                                                                            'inline-flex size-6 items-center justify-center rounded text-[10px]',
                                                                            statusBadgeStyles[status],
                                                                        )}
                                                                        title={`${day.date}: ${status}`}
                                                                    >
                                                                        {statusInitial[status]}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-neutral-300">-</span>
                                                                )}
                                                            </td>
                                                        );
                                                    })}

                                                    {/* Summary Counts Per Student */}
                                                    <td className="p-1.5 font-bold text-brand bg-emerald-50/30 border-l border-neutral-200 tabular-nums">
                                                        {student.hadir}
                                                    </td>
                                                    <td className="p-1.5 font-bold text-[#b9770e] bg-amber-50/30 tabular-nums">
                                                        {student.terlambat}
                                                    </td>
                                                    <td className="p-1.5 font-bold text-[#1d6fb8] bg-blue-50/30 tabular-nums">
                                                        {student.izin}
                                                    </td>
                                                    <td className="p-1.5 font-bold text-[#7a3cc0] bg-purple-50/30 tabular-nums">
                                                        {student.sakit}
                                                    </td>
                                                    <td className="p-1.5 font-bold text-rose-600 bg-rose-50/30 tabular-nums">
                                                        {student.alpha}
                                                    </td>
                                                    <td className="p-1.5 font-bold text-brand-text bg-neutral-50/50 tabular-nums">
                                                        <span
                                                            className={cn(
                                                                'inline-flex rounded px-1.5 py-0.5 text-[10px]',
                                                                student.attendancePercentage >= 85
                                                                    ? 'bg-[#e7f6e0] text-brand'
                                                                    : student.attendancePercentage >= 70
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-rose-100 text-rose-700',
                                                            )}
                                                        >
                                                            {student.attendancePercentage}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Legend / Keterangan Status */}
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-brand-muted border-t border-neutral-100 pt-3">
                                <span className="font-semibold text-brand-text">Keterangan:</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-flex size-5 items-center justify-center rounded bg-[#e7f6e0] text-[10px] font-bold text-brand">H</span>
                                    <span>Hadir</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-flex size-5 items-center justify-center rounded bg-[#fdf0d5] text-[10px] font-bold text-[#b9770e]">T</span>
                                    <span>Terlambat</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-flex size-5 items-center justify-center rounded bg-[#e0eefe] text-[10px] font-bold text-[#1d6fb8]">I</span>
                                    <span>Izin</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-flex size-5 items-center justify-center rounded bg-[#f1e7fe] text-[10px] font-bold text-[#7a3cc0]">S</span>
                                    <span>Sakit</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-flex size-5 items-center justify-center rounded bg-rose-100 text-[10px] font-bold text-rose-700">A</span>
                                    <span>Alpha (Tanpa Keterangan)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

RekapMuridPage.layout = {
    breadcrumbs: [
        {
            title: 'Rekap Kehadiran',
            href: rekapMurid(),
        },
    ],
};
