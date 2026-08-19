import { cn } from '@/lib/utils';
import type { WeeklyTrendDay } from '@/types/dashboard';

const maxValue = 100;

export function WeeklyTrend({ days }: { days: WeeklyTrendDay[] }) {
    return (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-semibold text-base text-brand-text">
                        Tren Kehadiran Mingguan
                    </h2>
                    <p className="mt-0.5 text-sm text-brand-muted">
                        Jumlah siswa hadir per hari (7 hari terakhir)
                    </p>
                </div>
            </div>

            <div className="mt-6 flex h-40 items-end justify-between gap-3">
                {days.map(({ day, value, today }) => (
                    <div
                        key={day}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                        <span className="text-xs text-brand-muted tabular-nums">
                            {value}
                        </span>
                        <div
                            className={cn(
                                'w-full max-w-10 rounded-md',
                                today ? 'bg-brand' : 'bg-brand-soft',
                            )}
                            style={{
                                height: `${Math.round((value / maxValue) * 100)}%`,
                            }}
                        />
                        <span
                            className={cn(
                                'text-xs',
                                today
                                    ? 'font-semibold text-brand'
                                    : 'text-brand-muted',
                            )}
                        >
                            {day}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
