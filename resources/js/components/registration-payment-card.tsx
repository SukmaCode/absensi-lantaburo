import { router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    CreditCard,
    ExternalLink,
    Loader2,
    QrCode,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RegistrationPaymentInfo } from '@/types/siswa';

declare global {
    interface Window {
        snap?: {
            pay: (
                token: string,
                callbacks?: {
                    onSuccess?: (result: unknown) => void;
                    onPending?: (result: unknown) => void;
                    onError?: (result: unknown) => void;
                    onClose?: () => void;
                }
            ) => void;
        };
    }
}

interface Props {
    payment: RegistrationPaymentInfo;
    onPaymentSuccess?: () => void;
}

export default function RegistrationPaymentCard({
    payment,
    onPaymentSuccess,
}: Props) {
    const [isChecking, setIsChecking] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const handlePay = () => {
        if (!payment.snapToken) {
            // Request or refresh token
            fetch('/siswa/payment/snap-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.snap_token && window.snap) {
                        openSnap(data.snap_token);
                    } else {
                        setStatusMessage('Gagal memuat token pembayaran.');
                        setIsError(true);
                    }
                })
                .catch(() => {
                    setStatusMessage('Terjadi kesalahan saat memuat pembayaran.');
                    setIsError(true);
                });
            return;
        }

        if (window.snap) {
            openSnap(payment.snapToken);
        } else {
            setStatusMessage('Library Midtrans Snap sedang dimuat, silakan coba lagi beberapa saat.');
            setIsError(true);
        }
    };

    const openSnap = (token: string) => {
        if (!window.snap) return;

        window.snap.pay(token, {
            onSuccess: () => {
                setStatusMessage('Pembayaran berhasil dikonfirmasi! Memperbarui halaman...');
                setIsError(false);
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                } else {
                    router.reload({ only: ['registrationPayment'] });
                }
            },
            onPending: () => {
                setStatusMessage('Pembayaran sedang diproses / menunggu scan QR / transfer.');
                setIsError(false);
                router.reload({ only: ['registrationPayment'] });
            },
            onError: () => {
                setStatusMessage('Pembayaran gagal atau dibatalkan.');
                setIsError(true);
            },
            onClose: () => {
                setStatusMessage('Jendela pembayaran ditutup. Anda dapat melanjutkan pembayaran kapan saja.');
                setIsError(false);
            },
        });
    };

    const handleCheckStatus = async () => {
        setIsChecking(true);
        setStatusMessage(null);
        setIsError(false);

        try {
            const response = await fetch('/siswa/payment/check-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ order_id: payment.orderId }),
            });

            const data = await response.json();
            setStatusMessage(data.message || 'Status pembayaran diperiksa.');

            if (data.is_paid) {
                setIsError(false);
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                } else {
                    router.reload({ only: ['registrationPayment'] });
                }
            } else {
                router.reload({ only: ['registrationPayment'] });
            }
        } catch {
            setStatusMessage('Gagal memeriksa status pembayaran.');
            setIsError(true);
        } finally {
            setIsChecking(false);
        }
    };

    if (payment.isPaid) {
        return (
            <div className="flex items-center justify-between rounded-sm border border-emerald-200 bg-emerald-400 p-4 text-white shadow-xs dark:border-emerald-500 dark:bg-emerald-500">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Biaya Pendaftaran Lunas</p>
                        <p className="text-xs text-white">
                            Order ID: <span className="font-mono">{payment.orderId}</span> ({payment.formattedAmount})
                        </p>
                    </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-medium text-xs text-emerald-800 dark:bg-white">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Terverifikasi</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 p-5 shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:via-neutral-900 dark:to-neutral-950">
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-700/10" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-800">
                        <QrCode className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                                Pembayaran Pendaftaran Akun
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-semibold text-xs text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                                <Clock className="h-3 w-3" />
                                Menunggu Pembayaran
                            </span>
                        </div>

                        <p className="text-neutral-600 text-sm dark:text-neutral-400">
                            Silakan lakukan pembayaran pendaftaran sebesar{' '}
                            <span className="font-bold text-amber-900 dark:text-amber-200">
                                {payment.formattedAmount}
                            </span>{' '}
                            melalui QRIS / Transfer Bank untuk mengaktifkan akun Anda.
                        </p>

                        <p className="font-mono text-neutral-500 text-xs dark:text-neutral-500">
                            Order ID: {payment.orderId}
                            {payment.createdAt && ` • Dibuat: ${payment.createdAt}`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
                    <Button
                        type="button"
                        onClick={handleCheckStatus}
                        disabled={isChecking}
                        variant="outline"
                        size="sm"
                        className="h-10 border-amber-300 bg-white/80 text-amber-900 hover:bg-amber-100/80 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                        {isChecking ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-1.5 h-4 w-4" />
                        )}
                        Cek Status
                    </Button>

                    <Button
                        type="button"
                        onClick={handlePay}
                        size="sm"
                        className="h-10 bg-gradient-to-r from-amber-600 to-amber-700 font-semibold text-white shadow-xs hover:from-amber-700 hover:to-amber-800 dark:from-amber-600 dark:to-amber-700"
                    >
                        <CreditCard className="mr-1.5 h-4 w-4" />
                        Bayar Sekarang / Buka QR
                        <ExternalLink className="ml-1 h-3.5 w-3.5 opacity-70" />
                    </Button>
                </div>
            </div>

            {statusMessage && (
                <div
                    className={cn(
                        'mt-3.5 flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium transition-all',
                        isError
                            ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-amber-100/70 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300'
                    )}
                >
                    {isError ? (
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    ) : (
                        <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>{statusMessage}</span>
                </div>
            )}
        </div>
    );
}
