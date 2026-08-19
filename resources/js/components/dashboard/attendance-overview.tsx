import { cn } from '@/lib/utils';
import type { AttendanceOverviewProps } from '@/types/dashboard';

type AttendanceBucket = {
    label: string;
    value: number;
    barClassName: string;
    badgeClassName: string;
};

export function AttendanceOverview({
    hadir,
    terlambat,
    izin,
    sakit,
    belumAbsen,
    alpha,
    totalStudents,
}: AttendanceOverviewProps) {
    const buckets: AttendanceBucket[] = [
        {
            label: 'Hadir',
            value: hadir,
            barClassName: 'bg-brand',
            badgeClassName: 'bg-[#e7f6e0] text-brand',
        },
        {
            label: 'Terlambat',
            value: terlambat,
            barClassName: 'bg-brand-warm',
            badgeClassName: 'bg-amber-50 text-amber-600',
        },
        {
            label: 'Izin',
            value: izin,
            barClassName: 'bg-sky-400',
            badgeClassName: 'bg-sky-50 text-sky-600',
        },
        {
            label: 'Sakit',
            value: sakit,
            barClassName: 'bg-brand-muted',
            badgeClassName: 'bg-neutral-100 text-brand-muted',
        },
        {
            label: 'Belum Absen',
            value: belumAbsen,
            barClassName: 'bg-neutral-300',
            badgeClassName: 'bg-neutral-100 text-brand-muted',
        },
        {
            label: 'Tanpa Keterangan',
            value: alpha,
            barClassName: 'bg-red-500',
            badgeClassName: 'bg-red-50 text-red-600',
        },
    ];

    const maxValue = totalStudents;

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-semibold text-base text-brand-text">
                        Overview Kehadiran Hari Ini
                    </h2>
                    <p className="mt-0.5 text-sm text-brand-muted">
                        Distribusi status kehadiran seluruh siswa
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                {buckets.map(
                    ({ label, value, barClassName, badgeClassName }) => (
                        <div
                            key={label}
                            className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3"
                        >
                            <span className="text-sm text-brand-muted">
                                {label}
                            </span>
                            <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                                <div
                                    className={cn(
                                        'h-full rounded-full',
                                        barClassName,
                                    )}
                                    style={{
                                        width: `${Math.round((value / maxValue) * 100)}%`,
                                    }}
                                />
                            </div>
                            <span
                                className={cn(
                                    'justify-self-end rounded-md px-2 py-0.5 font-medium text-xs tabular-nums',
                                    badgeClassName,
                                )}
                            >
                                {value}
                            </span>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}
