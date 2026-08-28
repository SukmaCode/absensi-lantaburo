import { useEffect, useState } from 'react';
import { Camera, ExternalLink, ImageOff, X } from 'lucide-react';
import { FaCalendar, FaClock } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PhotoModalProps {
    photoUrl: string;
    teacherName?: string;
    date?: string;
    time?: string;
    status?: string;
    onClose: () => void;
}

const statusStyles: Record<string, string> = {
    Hadir: 'bg-[#e7f6e0] text-brand',
    Terlambat: 'bg-[#fdf0d5] text-[#b9770e]',
    Izin: 'bg-[#e0eefe] text-[#1d6fb8]',
    Sakit: 'bg-[#f1e7fe] text-[#7a3cc0]',
    'Tanpa Keterangan': 'bg-neutral-100 text-brand-muted',
};

export const PhotoModal = ({
    photoUrl,
    teacherName,
    date,
    time,
    status,
    onClose,
}: PhotoModalProps) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-neutral-100">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Camera className="size-4.5 text-brand" />
                            <h3 className="font-semibold text-base text-neutral-900">
                                {teacherName ?? 'Foto Absensi Guru'}
                            </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                            {date && (
                                <span className="flex items-center gap-1">
                                    <FaCalendar className="size-3 text-brand" />
                                    {date}
                                </span>
                            )}
                            {time && (
                                <span className="flex items-center gap-1">
                                    <FaClock className="size-3 text-brand" />
                                    {time} WIB
                                </span>
                            )}
                            {status && (
                                <span
                                    className={cn(
                                        'inline-flex items-center rounded-md px-2 py-0.5 font-medium text-[11px]',
                                        statusStyles[status] ?? 'bg-neutral-100 text-brand-muted',
                                    )}
                                >
                                    {status}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label="Tutup modal"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Photo Content */}
                <div className="relative flex min-h-60 max-h-[60vh] items-center justify-center bg-neutral-950/5 p-4 overflow-hidden">
                    {isLoading && !imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 animate-pulse">
                            <div className="size-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                        </div>
                    )}

                    {imageError ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-neutral-500">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-neutral-200">
                                <ImageOff className="size-6 text-neutral-400" />
                            </div>
                            <p className="text-sm font-medium text-neutral-700">
                                Gambar tidak dapat dimuat
                            </p>
                            <p className="text-xs text-neutral-400">
                                File gambar mungkin telah dipindahkan atau dihapus.
                            </p>
                        </div>
                    ) : (
                        <img
                            src={photoUrl}
                            alt={teacherName ? `Foto absen ${teacherName}` : 'Foto Absen'}
                            className={cn(
                                'max-h-[55vh] w-auto max-w-full rounded-lg object-contain shadow-sm transition-opacity duration-200',
                                isLoading ? 'opacity-0' : 'opacity-100',
                            )}
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIsLoading(false);
                                setImageError(true);
                            }}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-neutral-100 bg-neutral-50">
                    <p className="text-xs text-neutral-500">
                        Foto selfie kehadiran guru saat absensi
                    </p>
                    <div className="flex items-center gap-2">
                        {!imageError && (
                            <a
                                href={photoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-text transition-colors hover:bg-neutral-50 hover:text-brand"
                            >
                                <ExternalLink className="size-3.5" />
                                Buka Ukuran Penuh
                            </a>
                        )}
                        <Button
                            type="button"
                            size="sm"
                            onClick={onClose}
                            className="bg-brand text-white hover:bg-brand-dark px-3 py-1.5 text-xs h-auto"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
