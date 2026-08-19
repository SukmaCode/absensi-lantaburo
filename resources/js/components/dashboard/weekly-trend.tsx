import { cn } from '@/lib/utils';
import type { WeeklyTrendDay } from '@/types/dashboard';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    TooltipContentProps,
    TooltipIndex,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({
    active,
    payload,
}: TooltipContentProps<ValueType, NameType>) => {
    if (!active || !payload?.length) {
        return null;
    }

    const chartData = payload[0].payload as WeeklyTrendDay;

    return (
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-lg">
            <p className="font-semibold text-brand-text">{chartData.day}</p>
            <p className='font-regular text-xs text-brand-muted'>{chartData.string_date}</p>
            <p className="text-sm text-brand-muted">
                Jumlah siswa hadir:{' '}
                <span className="font-semibold text-brand">
                    {chartData.value}
                </span>
            </p>

            {chartData.today && (
                <p className="mt-1 font-semibold text-xs text-brand">
                    Hari ini
                </p>
            )}
        </div>
    );
};

const CustomContentOfTooltip = ({
    isAnimationActive,
    defaultIndex,
    data,
}: {
    isAnimationActive?: boolean;
    defaultIndex?: TooltipIndex;
    data: WeeklyTrendDay[];
}) => {
    return (
        <BarChart
            style={{
                width: '100%',
                maxHeight: '80%',
                aspectRatio: 1.618,
            }}
            responsive
            data={data}
            margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 0,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" niceTicks="snap125" />
            <YAxis width="auto" niceTicks="snap125" />
            <Tooltip
                content={CustomTooltip}
                isAnimationActive={isAnimationActive}
                defaultIndex={defaultIndex}
            />
            <Bar
                dataKey="value"
                barSize={20}
                fill="green"
                isAnimationActive={isAnimationActive}
            />
        </BarChart>
    );
};

export function WeeklyTrend({ days }: { days: WeeklyTrendDay[] }) {
    return (
        <div className="w-full rounded-2xl border border-neutral-100 bg-white p-6">
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

            <CustomContentOfTooltip data={days} isAnimationActive={true} />
        </div>
    );
}
