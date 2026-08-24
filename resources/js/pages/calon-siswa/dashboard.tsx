import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    ExternalLink,
    GraduationCap,
    HelpCircle,
    Loader2,
    Mail,
    Phone,
    QrCode,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    User,
    Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard as calonSiswaDashboard } from '@/routes/calon-siswa';
import { dashboard as siswaDashboard } from '@/routes/siswa';
import type { Auth } from '@/types';
import type { CalonSiswaDashboardProps } from '@/types/calon-siswa';

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

export default function CalonSiswaDashboard({
    user,
    studentInfo,
    registrationPayment,
    registrationFee,
    formattedRegistrationFee,
    schoolContact,
    autoOpenSnap,
}: CalonSiswaDashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [isChecking, setIsChecking] = useState(false);
    const [isRequestingToken, setIsRequestingToken] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
    const [copiedOrderId, setCopiedOrderId] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const userName = user.name || auth.user?.name || 'Calon Siswa';
    const isPaid = registrationPayment?.isPaid || false;

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // Auto open Snap if flagged from registration
    useEffect(() => {
        if (autoOpenSnap && registrationPayment?.snapToken && !isPaid) {
            const timer = setTimeout(() => {
                if (window.snap) {
                    openSnap(registrationPayment.snapToken!);
                }
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [autoOpenSnap, registrationPayment, isPaid]);

    const openSnap = (token: string) => {
        if (!window.snap) {
            setStatusMessage('Library pembayaran sedang dimuat, silakan coba sesaat lagi.');
            setMessageType('error');
            return;
        }

        window.snap.pay(token, {
            onSuccess: () => {
                setStatusMessage('Pembayaran berhasil! Mengalihkan ke halaman siswa...');
                setMessageType('success');
                router.reload();
            },
            onPending: () => {
                setStatusMessage('Pembayaran sedang diproses / menunggu scan QRIS atau transfer.');
                setMessageType('info');
                router.reload({ only: ['registrationPayment', 'user'] });
            },
            onError: () => {
                setStatusMessage('Pembayaran gagal atau dibatalkan.');
                setMessageType('error');
            },
            onClose: () => {
                setStatusMessage('Jendela pembayaran ditutup. Anda dapat melanjutkan pembayaran kapan saja.');
                setMessageType('info');
            },
        });
    };

    const handlePay = async () => {
        if (registrationPayment?.snapToken) {
            openSnap(registrationPayment.snapToken);
            return;
        }

        setIsRequestingToken(true);
        setStatusMessage(null);

        try {
            const response = await fetch('/calon-siswa/payment/snap-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            const data = await response.json();
            if (data.snap_token) {
                openSnap(data.snap_token);
            } else {
                setStatusMessage('Gagal membuat tagihan pembayaran. Silakan hubungi admin sekolah.');
                setMessageType('error');
            }
        } catch {
            setStatusMessage('Terjadi kesalahan jaringan saat memuat pembayaran.');
            setMessageType('error');
        } finally {
            setIsRequestingToken(false);
        }
    };

    const handleCheckStatus = async () => {
        setIsChecking(true);
        setStatusMessage(null);

        try {
            const response = await fetch('/calon-siswa/payment/check-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    order_id: registrationPayment?.orderId,
                }),
            });

            const data = await response.json();
            setStatusMessage(data.message || 'Status pembayaran berhasil diperiksa.');

            if (data.is_paid) {
                setMessageType('success');
                setTimeout(() => {
                    router.visit(siswaDashboard());
                }, 1200);
            } else {
                setMessageType('info');
                router.reload({ only: ['registrationPayment', 'user'] });
            }
        } catch {
            setStatusMessage('Gagal memeriksa status pembayaran ke payment gateway.');
            setMessageType('error');
        } finally {
            setIsChecking(false);
        }
    };

    const handleCopyOrderId = () => {
        if (!registrationPayment?.orderId) return;
        navigator.clipboard.writeText(registrationPayment.orderId);
        setCopiedOrderId(true);
        setTimeout(() => setCopiedOrderId(false), 2000);
    };

    return (
        <>
            <Head title="Dashboard Calon Siswa - Pembayaran Registrasi" />

            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Welcome Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-semibold text-xs text-brand-dark">
                                <Sparkles className="size-3.5 text-brand" />
                                Panel Pendaftaran Siswa
                            </span>
                            {isPaid ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#c5eec2] bg-[#e7f6e0] px-2.5 py-0.5 font-semibold text-xs text-brand">
                                    <CheckCircle2 className="size-3" />
                                    Akun Aktif
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#fae1af] bg-[#fdf0d5] px-2.5 py-0.5 font-semibold text-xs text-[#b9770e]">
                                    <Clock className="size-3" />
                                    Menunggu Pembayaran
                                </span>
                            )}
                        </div>
                        <h1 className="mt-2 font-bold text-2xl text-brand-text sm:text-3xl">
                            Selamat Datang, {userName}
                        </h1>
                        <p className="mt-1 text-sm text-brand-muted">
                            Selesaikan pembayaran administrasi pendaftaran untuk mengaktifkan status siswa dan mengakses seluruh fasilitas belajar.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 self-start rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2 text-xs font-medium text-brand-muted shadow-xs sm:self-center">
                        <Calendar className="size-4 text-brand" />
                        <span>{today}</span>
                    </div>
                </div>

                {/* 4-Step Registration Stepper */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs">
                    <h3 className="font-semibold text-sm text-brand-text">
                        Alur Registrasi Siswa Baru
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Step 1 */}
                        <div className="flex items-center gap-3 rounded-xl border border-[#c5eec2] bg-[#e7f6e0]/70 p-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand font-bold text-white shadow-xs">
                                <Check className="size-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-xs text-brand-dark">1. Daftar Akun</p>
                                <p className="text-[11px] text-brand">Selesai terdaftar</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div
                            className={cn(
                                'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                                isPaid
                                    ? 'border-[#c5eec2] bg-[#e7f6e0]/70'
                                    : 'border-[#fae1af] bg-[#fdf0d5]/80'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex size-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs shadow-xs',
                                    isPaid
                                        ? 'bg-brand text-white'
                                        : 'bg-[#b9770e] text-white'
                                )}
                            >
                                {isPaid ? <Check className="size-5" /> : <CreditCard className="size-4.5" />}
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        'font-semibold text-xs',
                                        isPaid ? 'text-brand-dark' : 'text-[#b9770e]'
                                    )}
                                >
                                    2. Pembayaran Midtrans
                                </p>
                                <p
                                    className={cn(
                                        'text-[11px]',
                                        isPaid ? 'text-brand' : 'text-amber-700'
                                    )}
                                >
                                    {isPaid ? 'Pembayaran lunas' : 'Scan QRIS / Transfer'}
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div
                            className={cn(
                                'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                                isPaid
                                    ? 'border-[#c5eec2] bg-[#e7f6e0]/70'
                                    : 'border-neutral-200/70 bg-neutral-50/70'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex size-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs shadow-xs',
                                    isPaid
                                        ? 'bg-brand text-white'
                                        : 'bg-neutral-200 text-neutral-500'
                                )}
                            >
                                {isPaid ? <Check className="size-5" /> : <ShieldCheck className="size-4.5" />}
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        'font-semibold text-xs',
                                        isPaid ? 'text-brand-dark' : 'text-neutral-700'
                                    )}
                                >
                                    3. Verifikasi & Role Siswa
                                </p>
                                <p
                                    className={cn(
                                        'text-[11px]',
                                        isPaid ? 'text-brand' : 'text-neutral-500'
                                    )}
                                >
                                    {isPaid ? 'Role otomatis aktif' : 'Otomatis oleh sistem'}
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div
                            className={cn(
                                'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                                isPaid
                                    ? 'border-[#c5eec2] bg-[#e7f6e0]/70'
                                    : 'border-neutral-200/70 bg-neutral-50/70'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex size-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs shadow-xs',
                                    isPaid
                                        ? 'bg-brand text-white'
                                        : 'bg-neutral-200 text-neutral-500'
                                )}
                            >
                                {isPaid ? <Check className="size-5" /> : <GraduationCap className="size-4.5" />}
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        'font-semibold text-xs',
                                        isPaid ? 'text-brand-dark' : 'text-neutral-700'
                                    )}
                                >
                                    4. Dashboard & Absensi
                                </p>
                                <p
                                    className={cn(
                                        'text-[11px]',
                                        isPaid ? 'text-brand' : 'text-neutral-500'
                                    )}
                                >
                                    {isPaid ? 'Siap digunakan' : 'Terkunci'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Banner if paid */}
                {isPaid ? (
                    <div className="relative overflow-hidden rounded-2xl border border-[#c5eec2] bg-gradient-to-br from-[#e7f6e0] via-white to-[#e7f6e0]/60 p-6 shadow-xs">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#e7f6e0] text-brand ring-1 ring-[#c5eec2]">
                                    <CheckCircle2 className="size-8 text-brand" />
                                </div>
                                <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#c5eec2] bg-[#e7f6e0] px-3 py-0.5 font-semibold text-xs text-brand">
                                        <Sparkles className="size-3.5" />
                                        Pembayaran Lunas & Terverifikasi
                                    </span>
                                    <h2 className="font-bold text-xl text-brand-text sm:text-2xl">
                                        Selamat! Akun Anda Telah Aktif Sebagai Siswa
                                    </h2>
                                    <p className="max-w-2xl text-sm text-brand-muted">
                                        Pembayaran pendaftaran telah berhasil. Anda sekarang dapat mengakses dashboard siswa, melakukan absensi selfie harian, dan melihat rekap kehadiran.
                                    </p>
                                    <p className="pt-1 font-mono text-xs text-brand-muted">
                                        Order ID: {registrationPayment?.orderId} &bull; Tanggal Lunas: {registrationPayment?.settlementTime || 'Baru saja'}
                                    </p>
                                </div>
                            </div>

                            <Button
                                asChild
                                size="lg"
                                className="h-11 shrink-0 rounded-xl bg-brand px-6 font-semibold text-white shadow-xs transition-transform hover:bg-brand-dark"
                            >
                                <Link href={siswaDashboard()}>
                                    Masuk Dashboard Siswa
                                    <ArrowRight className="ml-2 size-4.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Main Payment Card (Active Action Area) */
                    <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 p-6 shadow-xs">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4 sm:gap-5">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-[#b9770e] shadow-xs ring-1 ring-amber-200">
                                    <QrCode className="size-7" />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-bold text-xl text-brand-text">
                                            Tagihan Biaya Pendaftaran Siswa
                                        </h2>
                                        <span className="inline-flex items-center gap-1 rounded-full border border-[#fae1af] bg-[#fdf0d5] px-3 py-0.5 font-semibold text-xs text-[#b9770e]">
                                            <Clock className="size-3.5" />
                                            Menunggu Pembayaran
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-2 pt-1">
                                        <span className="font-extrabold text-3xl text-brand-text tracking-tight">
                                            {registrationPayment?.formattedAmount || formattedRegistrationFee}
                                        </span>
                                        <span className="text-xs text-brand-muted">
                                            (Biaya Pendaftaran & Administrasi)
                                        </span>
                                    </div>

                                    <p className="max-w-2xl text-sm leading-relaxed text-brand-muted">
                                        Gunakan QRIS (GoPay, OVO, ShopeePay, BCA, Dana) atau Transfer Bank (Virtual Account) melalui jendela pembayaran Midtrans.
                                    </p>

                                    {registrationPayment?.orderId && (
                                        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                                            <span className="text-brand-muted">Order ID:</span>
                                            <code className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 font-mono font-semibold text-brand-text">
                                                {registrationPayment.orderId}
                                            </code>
                                            <button
                                                type="button"
                                                onClick={handleCopyOrderId}
                                                className="inline-flex items-center gap-1 text-[#b9770e] hover:text-amber-800"
                                                title="Salin Order ID"
                                            >
                                                {copiedOrderId ? (
                                                    <Check className="size-3.5 text-brand" />
                                                ) : (
                                                    <Copy className="size-3.5" />
                                                )}
                                                <span className="text-[11px]">{copiedOrderId ? 'Tersalin!' : 'Salin'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                                <Button
                                    type="button"
                                    onClick={handlePay}
                                    disabled={isRequestingToken}
                                    size="lg"
                                    className="h-11 rounded-xl bg-brand font-semibold text-white shadow-xs hover:bg-brand-dark"
                                >
                                    {isRequestingToken ? (
                                        <Loader2 className="mr-2 size-4.5 animate-spin" />
                                    ) : (
                                        <CreditCard className="mr-2 size-4.5" />
                                    )}
                                    Bayar Sekarang / Buka QRIS
                                    <ExternalLink className="ml-1.5 size-4 opacity-80" />
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleCheckStatus}
                                    disabled={isChecking}
                                    variant="outline"
                                    size="lg"
                                    className="h-11 rounded-xl border-neutral-200 bg-white font-medium text-brand-text hover:bg-neutral-50 shadow-xs"
                                >
                                    {isChecking ? (
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 size-4 text-brand" />
                                    )}
                                    Cek Status Pembayaran
                                </Button>
                            </div>
                        </div>

                        {/* Status Message / Notification */}
                        {statusMessage && (
                            <div
                                className={cn(
                                    'mt-5 flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-medium transition-all',
                                    messageType === 'success'
                                        ? 'border-[#c5eec2] bg-[#e7f6e0] text-brand-dark'
                                        : messageType === 'error'
                                          ? 'border-rose-200 bg-rose-50 text-rose-800'
                                          : 'border-[#fae1af] bg-[#fdf0d5] text-[#b9770e]'
                                )}
                            >
                                {messageType === 'success' ? (
                                    <CheckCircle2 className="size-4.5 shrink-0 text-brand" />
                                ) : messageType === 'error' ? (
                                    <AlertCircle className="size-4.5 shrink-0 text-rose-600" />
                                ) : (
                                    <Clock className="size-4.5 shrink-0 text-[#b9770e]" />
                                )}
                                <span className="flex-1">{statusMessage}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Grid: Detail Calon Siswa & Panduan Pembayaran */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left 1: Data Calon Siswa */}
                    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                                <User className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-brand-text">
                                    Data Calon Siswa
                                </h3>
                                <p className="text-xs text-brand-muted">
                                    Informasi akun pendaftaran Anda
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3.5 text-sm">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-xs text-brand-muted">Nama Lengkap</span>
                                <span className="text-right font-semibold text-brand-text">
                                    {user.name}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-2">
                                <span className="text-xs text-brand-muted">Email</span>
                                <span className="text-right font-medium text-brand-text">
                                    {user.email}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-2">
                                <span className="text-xs text-brand-muted">No. WhatsApp / HP</span>
                                <span className="text-right font-medium text-brand-text">
                                    {user.phone || '-'}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-2">
                                <span className="text-xs text-brand-muted">NIS Sementara</span>
                                <span className="text-right font-mono font-bold text-brand">
                                    {studentInfo.nis}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-2">
                                <span className="text-xs text-brand-muted">Tanggal Daftar</span>
                                <span className="text-right text-xs text-brand-text">
                                    {user.createdAt}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-2">
                                <span className="text-xs text-brand-muted">Status Akun</span>
                                <span
                                    className={cn(
                                        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs',
                                        isPaid
                                            ? 'border-[#c5eec2] bg-[#e7f6e0] text-brand'
                                            : 'border-[#fae1af] bg-[#fdf0d5] text-[#b9770e]'
                                    )}
                                >
                                    {isPaid ? 'Aktif (Siswa)' : 'Calon Siswa (Belum Aktif)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Middle 2: Metode Pembayaran yang Didukung & Panduan */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
                            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                                    <Wallet className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-brand-text">
                                        Panduan Pembayaran Midtrans
                                    </h3>
                                    <p className="text-xs text-brand-muted">
                                        Pilihan metode pembayaran yang praktis dan otomatis terverifikasi
                                    </p>
                                </div>
                            </div>

                            {/* Payment Methods Cards */}
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5">
                                    <div className="flex items-center gap-2">
                                        <QrCode className="size-4 text-brand" />
                                        <span className="font-bold text-xs text-brand-text">
                                            QRIS (Instan)
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-[11px] leading-relaxed text-brand-muted">
                                        Scan menggunakan GoPay, OVO, Dana, ShopeePay, BCA Mobile, atau mobile banking lainnya.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="size-4 text-blue-600" />
                                        <span className="font-bold text-xs text-brand-text">
                                            Virtual Account
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-[11px] leading-relaxed text-brand-muted">
                                        Transfer VA bank otomatis untuk BCA, Mandiri, BNI, BRI, Permata Bank tanpa perlu konfirmasi manual.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="size-4 text-purple-600" />
                                        <span className="font-bold text-xs text-brand-text">
                                            E-Wallet & Minimarket
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-[11px] leading-relaxed text-brand-muted">
                                        Pembayaran lewat ShopeePay, GoPay App, atau gerai Indomaret & Alfamart.
                                    </p>
                                </div>
                            </div>

                            {/* FAQ Collapsible */}
                            <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
                                <div
                                    className="cursor-pointer rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 text-xs transition-colors hover:bg-neutral-100/60"
                                    onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                                >
                                    <div className="flex items-center justify-between font-semibold text-brand-text">
                                        <span className="flex items-center gap-2">
                                            <HelpCircle className="size-3.5 text-brand" />
                                            Bagaimana jika saya menutup popup sebelum bayar?
                                        </span>
                                        <span className="font-bold text-brand-muted">{activeFaq === 1 ? '−' : '+'}</span>
                                    </div>
                                    {activeFaq === 1 && (
                                        <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                                            Tidak masalah! Anda cukup login kembali ke akun Anda kapan saja, lalu klik tombol <strong>"Bayar Sekarang / Buka QRIS"</strong> di dashboard ini untuk melanjutkan proses scan atau transfer pembayaran.
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="cursor-pointer rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 text-xs transition-colors hover:bg-neutral-100/60"
                                    onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                                >
                                    <div className="flex items-center justify-between font-semibold text-brand-text">
                                        <span className="flex items-center gap-2">
                                            <HelpCircle className="size-3.5 text-brand" />
                                            Kapan akun saya resmi menjadi Siswa?
                                        </span>
                                        <span className="font-bold text-brand-muted">{activeFaq === 2 ? '−' : '+'}</span>
                                    </div>
                                    {activeFaq === 2 && (
                                        <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                                            Segera setelah transaksi berhasil dikonfirmasi oleh sistem Midtrans (dalam hitungan detik), role akun Anda otomatis diperbarui menjadi <strong>'siswa'</strong> dan status akun menjadi <strong>'active'</strong>. Anda dapat langsung membuka dashboard siswa dan absen.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Support / Helpdesk Box */}
                        <div className="flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-brand-text">
                                    Butuh Bantuan Pembayaran?
                                </h4>
                                <p className="text-xs text-brand-muted">
                                    Hubungi tim administrasi {schoolContact.name} jika Anda mengalami kendala saat melakukan pembayaran.
                                </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2.5">
                                {schoolContact.phone && (
                                    <Button
                                        asChild
                                        size="sm"
                                        className="gap-1.5 rounded-xl bg-brand font-semibold text-white shadow-xs hover:bg-brand-dark"
                                    >
                                        <a
                                            href={`https://wa.me/${schoolContact.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Phone className="size-3.5" />
                                            WhatsApp Admin
                                        </a>
                                    </Button>
                                )}
                                {schoolContact.email && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 rounded-xl border-brand/30 bg-white text-brand-dark hover:bg-brand-soft"
                                    >
                                        <a href={`mailto:${schoolContact.email}`}>
                                            <Mail className="size-3.5" />
                                            Email
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

CalonSiswaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Calon Siswa',
            href: calonSiswaDashboard(),
        },
    ],
};
