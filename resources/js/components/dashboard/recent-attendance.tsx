import { cn } from '@/lib/utils';
import type { RecentAttendanceRecord } from '@/types/dashboard';

const statusClasses: Record<RecentAttendanceRecord['status'], string> = {
    Hadir: 'bg-[#e7f6e0] text-brand',
    Terlambat: 'bg-amber-50 text-amber-600',
    Izin: 'bg-sky-50 text-sky-600',
    Sakit: 'bg-neutral-100 text-brand-muted',
};

export function RecentAttendance({
    records,
}: {
    records: RecentAttendanceRecord[];
}) {
    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-semibold text-base text-brand-text">
                        Absensi Terbaru
                    </h2>
                    <p className="mt-0.5 text-sm text-brand-muted">
                        Aktivitas absen terakhir yang tercatat
                    </p>
                </div>
                <span className="text-xs text-brand-muted">Hari ini</span>
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-105 text-left text-sm">
                    <thead>
                        <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                            <th className="pb-3 font-medium">Nama</th>
                            <th className="pb-3 font-medium">Role</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 text-right font-medium">
                                Waktu
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(({ name, role, status, time }) => (
                            <tr
                                key={name}
                                className="border-b border-neutral-50 last:border-0"
                            >
                                <td className="py-3 font-medium text-brand-text">
                                    {name}
                                </td>
                                <td className="py-3 text-brand-muted">
                                    {role}
                                </td>
                                <td className="py-3">
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-xs',
                                            statusClasses[status],
                                        )}
                                    >
                                        <span className="size-1.5 rounded-full bg-current" />
                                        {status}
                                    </span>
                                </td>
                                <td className="py-3 text-right text-brand-muted tabular-nums">
                                    {time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
