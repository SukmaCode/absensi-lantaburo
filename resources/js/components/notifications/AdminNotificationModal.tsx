import { use, useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { FaBell, FaGraduationCap } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { AdminNotificationItem, AdminNotificationsResponse, AvailableStudentOption } from '@/types/admin';
import NotificationDetailModal from './NotificationDetailModal';

interface Props {
    open: boolean;
    onClose: () => void;
}

function formatRelativeTime(dateStr: string | null): string {
    if (!dateStr) return '-';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} hari lalu`;
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminNotificationModal({ open, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<AdminNotificationItem | null>(null);
    const [availableStudents, setAvailableStudents] = useState<AvailableStudentOption[]>([]);

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        setError(null);

        fetch('/admin/notifications', {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Gagal memuat notifikasi');
                return res.json() as Promise<AdminNotificationsResponse>;
            })
            .then((data) => setNotifications(data.notifications))
            .catch(() => setError('Terjadi kesalahan saat memuat notifikasi.'))
            .finally(() => setLoading(false));

        fetch('/admin/available-students', {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })
            .then((res) => res.json() as Promise<AvailableStudentOption[]>)
            .then((data) => setAvailableStudents(data))
            .catch(() => { /* silent fail */ });
    }, [open]);

    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
                <DialogContent className="min-h-[90vh] p-0 flex gap-0 flex-col overflow-y-auto sm:max-w-lg bg-white text-black custom-scrollbar">
                    <DialogHeader className='h-fit p-6'>
                        <DialogTitle className="flex items-center gap-2 text-black">
                            <FaBell className="size-5 text-brand-dark" />
                            Notifikasi Admin
                        </DialogTitle>
                        <DialogDescription>
                            Daftar siswa yang telah menyelesaikan pembayaran registrasi
                        </DialogDescription>
                    </DialogHeader>

                    <div className="">
                        {loading && (
                            <div className="flex flex-col items-center justify-center gap-2 py-10 text-brand-muted">
                                <Loader2 className="size-6 animate-spin text-brand" />
                                <p className="text-sm">Memuat notifikasi...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {!loading && !error && notifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                <div className="flex size-14 items-center justify-center rounded-full bg-brand-soft/50">
                                    <CheckCircle2 className="size-7 text-brand" />
                                </div>
                                <p className="text-sm font-medium text-brand-text">
                                    Tidak ada notifikasi
                                </p>
                                <p className="text-xs text-brand-muted">
                                    Belum ada siswa yang menyelesaikan pembayaran registrasi.
                                </p>
                            </div>
                        )}

                        {!loading && !error && notifications.length > 0 && (
                            <ul className="divide-y divide-neutral-100">
                                {notifications.map((item, index) => (
                                    <li key={`${item.user_id}-${index}`} className='relative border-t border-neutral-200'>
                                        <Button
                                            variant="ghost"
                                            className="h-auto w-full justify-start rounded-none px-3 py-3 text-left hover:bg-brand-soft/40 cursor-pointer transition-colors"
                                            onClick={() => {
                                                onClose();
                                                setSelectedItem(item);
                                            }}
                                        >
                                            <div className="flex w-full items-start gap-3">
                                                {/* Ikon */}
                                                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft/60">
                                                    <FaGraduationCap className="size-4 text-brand" />
                                                </div>

                                                {/* Konten */}
                                                <div className="min-w-0 flex-1">
                                                    <div className='flex flex-row gap-2 justify-content items-center'>
                                                        <p className="truncate text-sm font-semibold text-brand-text">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-brand-muted">
                                                            {item.nis}
                                                        </p>
                                                    </div>
                                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                        <span className="inline-flex items-center rounded-md bg-[#e7f6e0] px-2 py-0.5 text-[11px] font-medium text-brand">
                                                            Lunas {item.payment.formatted_amount}
                                                        </span>
                                                        <span className="text-[11px] text-brand-muted">
                                                            {formatRelativeTime(item.payment.settlement_time)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Detail Modal – muncul setelah list modal ditutup */}
            <NotificationDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                availableStudents={availableStudents}
            />
        </>
    );
}
