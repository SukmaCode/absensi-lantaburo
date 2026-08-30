import { FaCalendarDays } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import type { AnnouncementItem } from '@/types/dashboard';

const categoryClasses: Record<AnnouncementItem['category'], string> = {
    Umum: 'bg-brand-soft text-brand-dark',
    Guru: 'bg-sky-50 text-sky-600',
    Siswa: 'bg-amber-50 text-amber-600',
};

export function Announcements({ items }: { items: AnnouncementItem[] }) {
    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-base text-brand-text">
                    Pengumuman Terbaru
                </h2>
                <span className="text-xs text-brand-muted">Lihat semua</span>
            </div>

            <div className="mt-4 divide-y divide-neutral-100">
                {items.map(({ title, description, date, category }) => (
                    <div
                        key={title}
                        className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span
                                className={cn(
                                    'rounded-md px-2 py-0.5 font-medium text-[11px]',
                                    categoryClasses[category],
                                )}
                            >
                                {category}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-brand-muted">
                                <FaCalendarDays className="size-3.5" />
                                {date}
                            </span>
                        </div>
                        <p className="font-medium text-sm text-brand-text">
                            {title}
                        </p>
                        <p className="line-clamp-2 text-sm text-brand-muted">
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
