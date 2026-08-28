import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Camera,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Filter,
    GraduationCap,
    LayoutGrid,
    List,
    Printer,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { PhotoModal } from '@/components/absensi/PhotoModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { absenAnak } from '@/routes/orangtua';
import type { AbsenAnakPageProps, DailySummaryItem } from '@/types/orangtua';

const statusBadgeStyles: Record<string, string> = {
    hadir: 'bg-[#e7f6e0] text-brand border-[#c5eec2]',
    terlambat: 'bg-[#fdf0d5] text-[#b9770e] border-[#fae1af]',
    izin: 'bg-[#e0eefe] text-[#1d6fb8] border-[#bedcfc]',
    sakit: 'bg-[#f1e7fe] text-[#7a3cc0] border-[#e0cbfa]',
    alpha: 'bg-rose-100 text-rose-700 border-rose-200',
};

const statusInitial: Record<string, string> = {
    hadir: 'H',
    terlambat: 'T',
    izin: 'I',
    sakit: 'S',
    alpha: 'A',
};

export default function AbsenAnakPage({
    hasChildren,
    children: childrenList,
    selectedStudent,
    selectedMonth,
    monthLabel,
    daysInMonth,
    dailySummary,
    summary,
}: AbsenAnakPageProps) {
    const [viewMode, setViewMode] = useState<'daily' | 'matrix'>('daily');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedPhoto, setSelectedPhoto] = useState<{
        photoUrl: string;
        date: string;
        time?: string;
        status?: string;
    } | null>(null);

    // Handle Month Change
    const handleMonthChange = (newMonth: string) => {
        router.get(
            absenAnak.url({
                query: {
                    month: newMonth,
                    student_id: selectedStudent?.id,
                },
            }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    // Handle Child Change
    const handleChildChange = (studentId: number) => {
        router.get(
            absenAnak.url({
                query: {
                    month: selectedMonth,
                    student_id: studentId,
                },
            }),
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

    const handlePrint = () => {
        window.print();
    };

    // Filter daily records
    const filteredDailySummary = useMemo(() => {
        if (statusFilter === 'all') return dailySummary;
        if (statusFilter === 'recorded') return dailySummary.filter((d) => d.status !== null && d.status !== undefined);
        return dailySummary.filter((d) => d.status === statusFilter);
    }, [dailySummary, statusFilter]);

    return (
        <>
            <Head title={`Rekap Absensi ${selectedStudent?.name ?? 'Anak'}`} />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8 print:bg-white print:p-0">
                {/* Header Section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <div className="flex items-center gap-2">
                            <FileText className="size-6 text-brand" />
                            <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                                Rekap Kehadiran Anak
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-brand-muted">
                            {selectedStudent
                                ? `Catatan absensi lengkap untuk ${selectedStudent.name} (${selectedStudent.nis})`
                                : 'Pantau rekap kehadiran harian dan bulanan anak Anda'}
                        </p>
                    </div>

                    {/* Month Picker & Navigation */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-1 shadow-xs">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateMonth(-1)}
                                className="size-8 p-0 text-brand-muted hover:text-brand-text"
                            >
                                <ChevronLeft className="size-4" />
                            </Button>

                            <div className="flex items-center justify-center gap-1.5 px-2">
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
                            onClick={handlePrint}
                            className="rounded-xl border-neutral-200 bg-white text-xs font-medium text-brand-text hover:bg-brand-soft shadow-xs"
                        >
                            <Printer className="mr-1.5 size-3.5 text-brand" />
                            Cetak Rekap
                        </Button>
                    </div>
                </div>

                {!hasChildren || !selectedStudent ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-xs">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <Users className="size-8" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg text-brand-text">Belum Ada Data Anak Terhubung</h2>
                            <p className="mt-1 max-w-md text-sm text-brand-muted">
                                Akun Anda belum memiliki data siswa yang terhubung.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Multiple Children Tabs */}
                        {childrenList.length > 1 && (
                            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-100 bg-white p-2 shadow-xs print:hidden">
                                <span className="px-3 text-xs font-semibold text-brand-muted">Pilih Anak:</span>
                                {childrenList.map((child) => (
                                    <button
                                        key={child.id}
                                        type="button"
                                        onClick={() => handleChildChange(child.id)}
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all',
                                            selectedStudent.id === child.id
                                                ? 'bg-brand text-white shadow-xs'
                                                : 'bg-neutral-50 text-brand-muted hover:bg-neutral-100 hover:text-brand-text'
                                        )}
                                    >
                                        <GraduationCap className="size-4" />
                                        <span>{child.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Print Header */}
                        <div className="hidden print:block mb-4 border-b pb-3">
                            <h1 className="text-xl font-bold text-black">Rekap Kehadiran Siswa</h1>
                            <p className="text-xs text-neutral-600">
                                Nama: {selectedStudent.name} &bull; NIS: {selectedStudent.nis} &bull; Periode: {monthLabel}
                            </p>
                        </div>

                        {/* Summary Metrics Cards */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 print:hidden">
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                <span className="text-xs text-brand-muted">% Kehadiran</span>
                                <p className="mt-1 font-bold text-2xl text-brand">{summary.attendancePercentage}%</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Bulan {monthLabel}</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                <span className="text-xs text-brand-muted">Total Hadir</span>
                                <p className="mt-1 font-bold text-2xl text-brand">{summary.hadir}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Tepat waktu</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                <span className="text-xs text-brand-muted">Total Terlambat</span>
                                <p className="mt-1 font-bold text-2xl text-[#b9770e]">{summary.terlambat}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Masuk telat</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                <span className="text-xs text-brand-muted">Total Izin</span>
                                <p className="mt-1 font-bold text-2xl text-[#1d6fb8]">{summary.izin}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Dengan surat</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                <span className="text-xs text-brand-muted">Total Sakit</span>
                                <p className="mt-1 font-bold text-2xl text-[#7a3cc0]">{summary.sakit}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Surat dokter</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
                                <span className="text-xs text-brand-muted">Total Alpha</span>
                                <p className="mt-1 font-bold text-2xl text-rose-600">{summary.alpha}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">Tanpa keterangan</p>
                            </div>
                        </div>

                        {/* View Switcher & Filter Bar */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between print:hidden">
                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-1 rounded-xl bg-neutral-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('daily')}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                                        viewMode === 'daily'
                                            ? 'bg-white text-brand shadow-xs'
                                            : 'text-brand-muted hover:text-brand-text'
                                    )}
                                >
                                    <List className="size-3.5" />
                                    Daftar Harian
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('matrix')}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                                        viewMode === 'matrix'
                                            ? 'bg-white text-brand shadow-xs'
                                            : 'text-brand-muted hover:text-brand-text'
                                    )}
                                >
                                    <LayoutGrid className="size-3.5" />
                                    Matriks Kalender
                                </button>
                            </div>

                            {/* Status Filter for Daily View */}
                            {viewMode === 'daily' && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="flex items-center gap-1 text-xs text-brand-muted">
                                        <Filter className="size-3.5" /> Filter:
                                    </span>
                                    {[
                                        { id: 'all', label: 'Semua Hari' },
                                        { id: 'recorded', label: 'Ada Absen' },
                                        { id: 'hadir', label: 'Hadir' },
                                        { id: 'terlambat', label: 'Terlambat' },
                                        { id: 'izin', label: 'Izin' },
                                        { id: 'sakit', label: 'Sakit' },
                                        { id: 'alpha', label: 'Alpha' },
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            type="button"
                                            onClick={() => setStatusFilter(f.id)}
                                            className={cn(
                                                'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                                statusFilter === f.id
                                                    ? 'bg-brand text-white'
                                                    : 'bg-neutral-50 text-brand-muted hover:bg-neutral-100 hover:text-brand-text'
                                            )}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content: View Mode 1 - Daily List (Daftar Harian) */}
                        {viewMode === 'daily' && (
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs print:border-0 print:p-0 print:shadow-none">
                                <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3 print:hidden">
                                    <h2 className="font-semibold text-base text-brand-text">
                                        Catatan Presensi Harian: {monthLabel}
                                    </h2>
                                    <span className="text-xs text-brand-muted">
                                        Menampilkan {filteredDailySummary.length} hari
                                    </span>
                                </div>

                                <div className="flex flex-col divide-y divide-neutral-100">
                                    {filteredDailySummary.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-brand-muted">
                                            <AlertCircle className="size-6 text-neutral-300" />
                                            <p className="text-sm">Tidak ada catatan presensi untuk filter ini.</p>
                                        </div>
                                    ) : (
                                        filteredDailySummary.map((day: DailySummaryItem) => (
                                            <div
                                                key={day.date}
                                                className={cn(
                                                    'flex flex-col gap-3 py-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0',
                                                    day.isToday && 'bg-brand-soft/20 -mx-3 px-3 rounded-xl'
                                                )}
                                            >
                                                {/* Left: Date & Status */}
                                                <div className="flex items-start gap-3.5">
                                                    <div
                                                        className={cn(
                                                            'flex size-11 shrink-0 flex-col items-center justify-center rounded-xl font-bold text-xs shadow-2xs',
                                                            day.isWeekend
                                                                ? 'bg-neutral-100 text-neutral-400'
                                                                : day.isToday
                                                                  ? 'bg-brand text-white'
                                                                  : 'bg-neutral-50 text-brand-text border border-neutral-200'
                                                        )}
                                                    >
                                                        <span className="text-sm leading-none">{day.dayNumber}</span>
                                                        <span className="text-[9px] font-normal uppercase">{day.dayName.slice(0, 3)}</span>
                                                    </div>

                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="font-semibold text-sm text-brand-text">
                                                                {day.fullDayName}, {day.date}
                                                            </h3>
                                                            {day.isToday && (
                                                                <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand-dark">
                                                                    Hari Ini
                                                                </span>
                                                            )}
                                                            {day.isWeekend && (
                                                                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                                                                    Akhir Pekan
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                                                            {day.checkInTime ? (
                                                                <span className="flex items-center gap-1 font-medium text-brand-text">
                                                                    <Clock className="size-3.5 text-brand" />
                                                                    Masuk: {day.checkInTime} WIB
                                                                </span>
                                                            ) : day.status ? (
                                                                <span>Tidak tercatat jam</span>
                                                            ) : day.isWeekend ? (
                                                                <span>Libur</span>
                                                            ) : (
                                                                <span className="text-neutral-400">Belum ada catatan</span>
                                                            )}

                                                            {day.notes && (
                                                                <span className="italic">
                                                                    &bull; "{day.notes}"
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Photo Preview Button + Status Badge */}
                                                <div className="flex items-center gap-3 self-end sm:self-center">
                                                    {day.photoUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedPhoto({
                                                                    photoUrl: day.photoUrl!,
                                                                    date: `${day.fullDayName}, ${day.date}`,
                                                                    time: day.checkInTime ?? undefined,
                                                                    status: day.statusLabel ?? undefined,
                                                                })
                                                            }
                                                            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand-soft transition-colors shadow-2xs"
                                                            title="Lihat foto selfie kehadiran"
                                                        >
                                                            <Camera className="size-3.5" />
                                                            <span className="hidden sm:inline">Foto Selfie</span>
                                                        </button>
                                                    )}

                                                    {day.status ? (
                                                        <span
                                                            className={cn(
                                                                'inline-flex min-w-20 items-center justify-center rounded-full border px-3 py-1 font-semibold text-xs shadow-2xs',
                                                                statusBadgeStyles[day.status] ?? 'bg-neutral-100 text-neutral-600'
                                                            )}
                                                        >
                                                            {day.statusLabel}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex min-w-20 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50 px-3 py-1 text-xs text-neutral-400">
                                                            {day.isWeekend ? 'Libur' : '-'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content: View Mode 2 - Matrix Grid (Matriks Kalender Bulanan) */}
                        {viewMode === 'matrix' && (
                            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs print:border-0 print:p-0 print:shadow-none">
                                <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3 print:hidden">
                                    <h2 className="font-semibold text-base text-brand-text">
                                        Matriks Kehadiran: {monthLabel}
                                    </h2>
                                    <span className="text-xs text-brand-muted">
                                        {selectedStudent.name}
                                    </span>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-neutral-100">
                                    <table className="w-full text-center text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-neutral-50/80 text-brand-muted border-b border-neutral-100">
                                                <th className="p-2 font-semibold text-left min-w-36">Nama Siswa</th>
                                                {daysInMonth.map((day) => (
                                                    <th
                                                        key={day.date}
                                                        className={cn(
                                                            'p-1.5 font-semibold text-[11px] min-w-7 border-l border-neutral-100',
                                                            day.isWeekend && 'bg-neutral-100/70 text-neutral-400',
                                                            day.isToday && 'bg-brand-soft text-brand-dark font-bold'
                                                        )}
                                                    >
                                                        <div>{day.dayNumber}</div>
                                                        <div className="text-[9px] font-normal">{day.dayName.slice(0, 3)}</div>
                                                    </th>
                                                ))}
                                                <th className="p-2 font-bold text-brand bg-emerald-50/70 border-l border-neutral-200 w-8">H</th>
                                                <th className="p-2 font-bold text-[#b9770e] bg-amber-50/70 w-8">T</th>
                                                <th className="p-2 font-bold text-[#1d6fb8] bg-blue-50/70 w-8">I</th>
                                                <th className="p-2 font-bold text-[#7a3cc0] bg-purple-50/70 w-8">S</th>
                                                <th className="p-2 font-bold text-rose-600 bg-rose-50/70 w-8">A</th>
                                                <th className="p-2 font-bold text-brand-text bg-neutral-100/70 w-12">%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="hover:bg-neutral-50/60 transition-colors">
                                                <td className="p-2.5 text-left font-semibold text-brand-text truncate">
                                                    {selectedStudent.name}
                                                </td>
                                                {dailySummary.map((day) => (
                                                    <td
                                                        key={day.date}
                                                        className={cn(
                                                            'p-0.5 border-l border-neutral-100',
                                                            day.isWeekend && 'bg-neutral-50/50'
                                                        )}
                                                    >
                                                        {day.status ? (
                                                            <span
                                                                className={cn(
                                                                    'inline-flex size-6 items-center justify-center rounded text-[10px] font-bold shadow-2xs',
                                                                    statusBadgeStyles[day.status]
                                                                )}
                                                                title={`${day.date}: ${day.statusLabel}`}
                                                            >
                                                                {statusInitial[day.status]}
                                                            </span>
                                                        ) : (
                                                            <span className="text-neutral-300">-</span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="p-1.5 font-bold text-brand bg-emerald-50/30 border-l border-neutral-200 tabular-nums">
                                                    {summary.hadir}
                                                </td>
                                                <td className="p-1.5 font-bold text-[#b9770e] bg-amber-50/30 tabular-nums">
                                                    {summary.terlambat}
                                                </td>
                                                <td className="p-1.5 font-bold text-[#1d6fb8] bg-blue-50/30 tabular-nums">
                                                    {summary.izin}
                                                </td>
                                                <td className="p-1.5 font-bold text-[#7a3cc0] bg-purple-50/30 tabular-nums">
                                                    {summary.sakit}
                                                </td>
                                                <td className="p-1.5 font-bold text-rose-600 bg-rose-50/30 tabular-nums">
                                                    {summary.alpha}
                                                </td>
                                                <td className="p-1.5 font-bold text-brand-text bg-neutral-50/50 tabular-nums">
                                                    <span className="inline-flex rounded bg-[#e7f6e0] px-1.5 py-0.5 text-[10px] text-brand">
                                                        {summary.attendancePercentage}%
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Legend */}
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
                        )}
                    </div>
                )}

                {/* Photo Modal */}
                {selectedPhoto && (
                    <PhotoModal
                        photoUrl={selectedPhoto.photoUrl}
                        teacherName={`Presensi ${selectedStudent?.name ?? 'Siswa'}`}
                        date={selectedPhoto.date}
                        time={selectedPhoto.time}
                        status={selectedPhoto.status}
                        onClose={() => setSelectedPhoto(null)}
                    />
                )}
            </div>
        </>
    );
}

AbsenAnakPage.layout = {
    breadcrumbs: [
        {
            title: 'Rekap Absen Anak',
            href: absenAnak(),
        },
    ],
};
