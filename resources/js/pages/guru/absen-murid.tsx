import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCheck,
    CheckCircle2,
    GraduationCap,
    Loader2,
    Save,
    Search,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { absenMurid } from '@/routes/guru';
import type { AbsenMuridPageProps, StudentAttendanceRow } from '@/types/guru';

type StatusType = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha';

export default function AbsenMuridPage({
    hasHomeroomClass,
    classInfo,
    students,
    date,
    formattedDate,
}: AbsenMuridPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(date);

    // Prepare state for batch attendance items
    const { data, setData, post, processing } = useForm<{
        date: string;
        attendances: Array<{
            student_id: number;
            status: StatusType;
            notes: string;
        }>;
    }>({
        date: date,
        attendances: students.map((s) => ({
            student_id: s.id,
            status: s.currentStatus,
            notes: s.notes || '',
        })),
    });

    // Update single student status
    const updateStudentStatus = (studentId: number, status: StatusType) => {
        setData('attendances', data.attendances.map((item) =>
            item.student_id === studentId ? { ...item, status } : item
        ));
    };

    // Update single student notes
    const updateStudentNotes = (studentId: number, notes: string) => {
        setData('attendances', data.attendances.map((item) =>
            item.student_id === studentId ? { ...item, notes } : item
        ));
    };

    // Quick action: Set all students to Hadir
    const setAllHadir = () => {
        setData('attendances', data.attendances.map((item) => ({
            ...item,
            status: 'hadir' as StatusType,
        })));
        toast.success('Semua murid diset Hadir');
    };

    // Handle date change navigation
    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);
        router.get(
            absenMurid.url({ query: { date: newDate } }),
            {},
            { preserveState: false, preserveScroll: true }
        );
    };

    // Filter students by name or NIS search
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return students;
        const q = searchQuery.toLowerCase();
        return students.filter(
            (s) => s.name.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
        );
    }, [students, searchQuery]);

    // Live summary counts from current form state
    const summaryCounts = useMemo(() => {
        const counts = { hadir: 0, terlambat: 0, izin: 0, sakit: 0, alpha: 0 };
        data.attendances.forEach((item) => {
            if (counts[item.status] !== undefined) {
                counts[item.status]++;
            }
        });
        return counts;
    }, [data.attendances]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(absenMurid.url(), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Absensi kelas berhasil disimpan!');
            },
            onError: (err) => {
                console.error(err);
                toast.error('Gagal menyimpan absensi. Periksa kembali form isian.');
            },
        });
    };

    return (
        <>
            <Head title="Absen Murid" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header Title & Date Picker */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Users className="size-6 text-brand" />
                            <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                                Absensi Murid
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-brand-muted">
                            {classInfo
                                ? `Presensi harian siswa kelas ${classInfo.name} (${classInfo.gradeLevel})`
                                : 'Presensi harian murid'}
                        </p>
                    </div>

                    {/* Date Picker Filter */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 shadow-xs">
                            <Calendar className="size-4 text-brand shrink-0" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="border-0 bg-transparent text-xs font-medium text-brand-text outline-none"
                            />
                        </div>
                    </div>
                </div>

                {!hasHomeroomClass ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-xs">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <AlertCircle className="size-8" />
                        </div>
                        <h2 className="font-semibold text-lg text-brand-text">Anda Belum Ditugaskan Sebagai Wali Kelas</h2>
                        <p className="max-w-md text-xs text-brand-muted">
                            Fitur absensi murid hanya dapat diakses oleh guru yang menjabat sebagai wali kelas. Silakan hubungi admin sekolah untuk pengaturan penugasan kelas.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Summary Bar & Quick Actions */}
                        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                                <span className="font-semibold text-brand-text">Ringkasan:</span>
                                <span className="rounded-lg bg-[#e7f6e0] px-2.5 py-1 font-semibold text-brand">
                                    Hadir: {summaryCounts.hadir}
                                </span>
                                <span className="rounded-lg bg-[#fdf0d5] px-2.5 py-1 font-semibold text-[#b9770e]">
                                    Terlambat: {summaryCounts.terlambat}
                                </span>
                                <span className="rounded-lg bg-[#e0eefe] px-2.5 py-1 font-semibold text-[#1d6fb8]">
                                    Izin: {summaryCounts.izin}
                                </span>
                                <span className="rounded-lg bg-[#f1e7fe] px-2.5 py-1 font-semibold text-[#7a3cc0]">
                                    Sakit: {summaryCounts.sakit}
                                </span>
                                <span className="rounded-lg bg-rose-50 px-2.5 py-1 font-semibold text-rose-600">
                                    Alpha: {summaryCounts.alpha}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={setAllHadir}
                                    className="rounded-xl border-neutral-200 text-xs font-medium text-brand hover:bg-brand-soft"
                                >
                                    <CheckCheck className="mr-1.5 size-3.5" />
                                    Set Semua Hadir
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    size="sm"
                                    className="gap-1.5 rounded-xl bg-brand text-xs font-semibold text-white shadow-xs hover:bg-brand-dark"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="size-3.5 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="size-3.5" />
                                            Simpan Absensi
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Search & Filter Header */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="size-5 text-brand" />
                                    <h2 className="font-semibold text-base text-brand-text">
                                        Daftar Siswa ({filteredStudents.length} Siswa)
                                    </h2>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari nama atau NIS..."
                                        className="h-9 rounded-xl pl-9 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Table of Students */}
                            <div className="mt-2 overflow-x-auto">
                                <table className="w-full min-w-160 text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                                            <th className="w-12 pb-3 font-medium">No</th>
                                            <th className="w-28 pb-3 font-medium">NIS</th>
                                            <th className="pb-3 font-medium">Nama Siswa</th>
                                            <th className="w-16 pb-3 font-medium">L/P</th>
                                            <th className="w-44 pb-3 font-medium">Status Kehadiran</th>
                                            <th className="pb-3 font-medium">Keterangan / Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {filteredStudents.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-10 text-center text-xs text-brand-muted">
                                                    Tidak ada data siswa yang cocok dengan pencarian.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStudents.map((student, idx) => {
                                                const currentFormItem = data.attendances.find(
                                                    (item) => item.student_id === student.id
                                                );
                                                const currentStatus = currentFormItem?.status ?? student.currentStatus;
                                                const currentNotes = currentFormItem?.notes ?? student.notes;

                                                return (
                                                    <tr key={student.id} className="hover:bg-neutral-50/50 transition-colors">
                                                        <td className="py-3 text-xs text-brand-muted tabular-nums">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="py-3 text-xs font-mono text-brand-muted">
                                                            {student.nis}
                                                        </td>
                                                        <td className="py-3 font-medium text-brand-text text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <span>{student.name}</span>
                                                                {student.hasAttended && (
                                                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] text-emerald-600">
                                                                        <CheckCircle2 className="size-2.5" />
                                                                        Tercatat
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-xs text-brand-muted">
                                                            <span
                                                                className={cn(
                                                                    'inline-flex size-6 items-center justify-center rounded-md text-[11px] font-semibold',
                                                                    student.gender === 'L'
                                                                        ? 'bg-blue-50 text-blue-600'
                                                                        : 'bg-pink-50 text-pink-600',
                                                                )}
                                                            >
                                                                {student.gender}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5">
                                                            <Select
                                                                value={currentStatus}
                                                                onValueChange={(val: StatusType) =>
                                                                    updateStudentStatus(student.id, val)
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    className={cn(
                                                                        'h-8 w-36 rounded-lg text-xs font-semibold',
                                                                        currentStatus === 'hadir' && 'bg-[#e7f6e0] text-brand border-[#c5eec2]',
                                                                        currentStatus === 'terlambat' && 'bg-[#fdf0d5] text-[#b9770e] border-[#fae1af]',
                                                                        currentStatus === 'izin' && 'bg-[#e0eefe] text-[#1d6fb8] border-[#bedcfc]',
                                                                        currentStatus === 'sakit' && 'bg-[#f1e7fe] text-[#7a3cc0] border-[#e0cbfa]',
                                                                        currentStatus === 'alpha' && 'bg-rose-50 text-rose-600 border-rose-200',
                                                                    )}
                                                                >
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="hadir" className="text-xs font-medium text-brand">
                                                                        Hadir
                                                                    </SelectItem>
                                                                    <SelectItem value="terlambat" className="text-xs font-medium text-[#b9770e]">
                                                                        Terlambat
                                                                    </SelectItem>
                                                                    <SelectItem value="izin" className="text-xs font-medium text-[#1d6fb8]">
                                                                        Izin
                                                                    </SelectItem>
                                                                    <SelectItem value="sakit" className="text-xs font-medium text-[#7a3cc0]">
                                                                        Sakit
                                                                    </SelectItem>
                                                                    <SelectItem value="alpha" className="text-xs font-medium text-rose-600">
                                                                        Alpha
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="py-2.5">
                                                            <Input
                                                                value={currentNotes}
                                                                onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                                                                placeholder="Catatan surat sakit / alasan..."
                                                                className="h-8 rounded-lg text-xs"
                                                                maxLength={255}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Bottom Submission Action */}
                            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                                <p className="text-xs text-brand-muted">
                                    Presensi tanggal: <strong className="text-brand-text">{formattedDate}</strong>
                                </p>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2 rounded-xl bg-brand font-semibold text-white shadow-xs hover:bg-brand-dark px-6"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Menyimpan Presensi...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="size-4" />
                                            Simpan Semua Presensi
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

AbsenMuridPage.layout = {
    breadcrumbs: [
        {
            title: 'Absen Murid',
            href: absenMurid(),
        },
    ],
};
