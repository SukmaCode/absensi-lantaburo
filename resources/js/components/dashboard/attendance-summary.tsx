import { FaUser, FaUserCheck } from 'react-icons/fa';
import { PiClockCountdownFill } from 'react-icons/pi';
import { TbClockExclamation } from 'react-icons/tb';
import { cn } from '@/lib/utils';
import type { AttendanceSummaryProps } from '@/types/dashboard';

type Stat = {
    label: string;
    value: number;
    detail: string;
    icon?: React.ReactNode;
    iconClassName: string;
    emphasized?: boolean;
};

export function AttendanceSummary({
    totalStudents,
    totalClasses,
    hadir,
    terlambat,
    belumAbsen,
    attendanceRate,
}: AttendanceSummaryProps) {
    const stats: Stat[] = [
        {
            label: 'Total Siswa',
            value: totalStudents,
            detail: `${totalClasses} kelas aktif`,
            icon: <FaUser />,
            iconClassName: 'bg-brand-soft text-brand-dark',
            emphasized: true,
        },
        {
            label: 'Hadir Hari Ini',
            value: hadir,
            detail: `${attendanceRate}% kehadiran`,
            icon: <FaUserCheck />,
            iconClassName: 'bg-[#e7f6e0] text-brand',
        },
        {
            label: 'Terlambat',
            value: terlambat,
            detail: 'Perlu perhatian',
            icon: <TbClockExclamation />,
            iconClassName: 'bg-amber-100 text-amber-500',
        },
        {
            label: 'Belum Absen',
            value: belumAbsen,
            detail: 'Belum melakukan absen',
            icon: <PiClockCountdownFill />,
            iconClassName: 'bg-neutral-100 text-brand-muted',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(
                ({ label, value, detail, icon, iconClassName, emphasized }) => (
                    <div
                        key={label}
                        className={cn(
                            'flex items-start gap-4 rounded-2xl border border-neutral-100 bg-white p-5',
                            emphasized &&
                                'border-brand/30 bg-brand-bg/60 lg:row-span-1',
                        )}
                    >
                        <div
                            className={cn(
                                'flex size-11 shrink-0 items-center justify-center rounded-xl',
                                iconClassName,
                            )}
                        >
                            {icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-brand-muted">{label}</p>
                            <p className="mt-1 font-bold text-3xl text-brand-text tabular-nums">
                                {value}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-brand-muted">
                                {detail}
                            </p>
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}
