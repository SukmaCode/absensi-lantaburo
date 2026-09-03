import { Head, router } from '@inertiajs/react';
import {
    FaCircleCheck,
    FaCircleExclamation,
    FaClock,
    FaCreditCard,
    FaGraduationCap,
    FaSpinner,
    FaUsers,
    FaWallet,
} from 'react-icons/fa6';
import { GoXCircleFill } from "react-icons/go";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";
import { TbClockX } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { sppPayment as sppPaymentRoute } from '@/routes/orangtua';
import { snapToken as snapTokenRoute, checkStatus as checkStatusRoute } from '@/routes/orangtua/spp-payment';
import type { SppMonthRecord, SppPaymentPageProps } from '@/types/orangtua';

const statusConfig: Record<
    string,
    { label: string; color: string; badgeClass: string; icon: React.ElementType }
> = {
    unpaid: {
        label: 'Belum Lunas',
        color: 'text-gray-400',
        badgeClass: 'bg-gray-50 text-gray-400 border-gray-200',
        icon: IoMdRemoveCircle,
    },
    pending: {
        label: 'Menunggu Bayar',
        color: 'text-amber-600',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: MdAccessTimeFilled,
    },
    success: {
        label: 'Lunas',
        color: 'text-brand',
        badgeClass: 'bg-[#e7f6e0] text-brand border-[#c5eec2]',
        icon: FaCircleCheck,
    },
    expired: {
        label: 'Kedaluwarsa',
        color: 'text-neutral-500',
        badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        icon: TbClockX,
    },
    failed: {
        label: 'Gagal',
        color: 'text-rose-600',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: GoXCircleFill,
    },
    cancelled: {
        label: 'Dibatalkan',
        color: 'text-neutral-500',
        badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        icon: TiCancel,
    },
};

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        amount
    );
}

export default function SppPaymentPage({
    hasChildren,
    children: childrenList,
    selectedStudent,
    sppHistory,
    hasSppSetting,
    sppAmount,
}: SppPaymentPageProps) {
    const [loadingMonth, setLoadingMonth] = useState<string | null>(null);
    const [checkingMonth, setCheckingMonth] = useState<string | null>(null);
    const [localHistory, setLocalHistory] = useState<SppMonthRecord[]>(sppHistory);

    const handleChildChange = (studentId: number) => {
        router.get(
            sppPaymentRoute.url({ query: { student_id: studentId } }),
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const loadSnapScript = (): Promise<void> => {
        return new Promise((resolve) => {
            if (window.snap) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY ?? '');
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    };

    const handlePaySpp = async (record: SppMonthRecord) => {
        if (!selectedStudent || loadingMonth) return;

        setLoadingMonth(record.month);

        try {
            const response = await fetch(snapTokenRoute.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    student_id: selectedStudent.id,
                    month: record.month,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message ?? 'Terjadi kesalahan. Silakan coba lagi.');
                setLoadingMonth(null);
                return;
            }

            setLoadingMonth(null);

            await loadSnapScript();

            if (!window.snap) {
                alert('Gagal memuat library pembayaran. Silakan coba lagi.');
                return;
            }

            window.snap.pay(data.snap_token, {
                onSuccess: () => {
                    syncStatus(record, data.order_id);
                },
                onPending: () => {
                    setLocalHistory((prev) =>
                        prev.map((m) =>
                            m.month === record.month
                                ? { ...m, status: 'pending', isPending: true, orderId: data.order_id }
                                : m
                        )
                    );
                },
                onError: () => {
                    setLocalHistory((prev) =>
                        prev.map((m) =>
                            m.month === record.month ? { ...m, status: 'failed' } : m
                        )
                    );
                },
                onClose: () => {
                    // Cek status saat popup ditutup
                    if (data.order_id) {
                        syncStatus(record, data.order_id);
                    }
                },
            });
        } catch {
            setLoadingMonth(null);
            alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
        }
    };

    const syncStatus = async (record: SppMonthRecord, orderId: string) => {
        setCheckingMonth(record.month);

        try {
            const response = await fetch(checkStatusRoute.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ order_id: orderId }),
            });

            const data = await response.json();

            setLocalHistory((prev) =>
                prev.map((m) =>
                    m.month === record.month
                        ? {
                              ...m,
                              status: data.status ?? m.status,
                              isPaid: data.isPaid ?? m.isPaid,
                              isPending: data.status === 'pending',
                              orderId,
                          }
                        : m
                )
            );
        } catch {
            // silent fail
        } finally {
            setCheckingMonth(null);
        }
    };

    const paidCount = localHistory.filter((m) => m.isPaid).length;
    const unpaidCount = localHistory.filter((m) => !m.isPaid && m.status !== 'pending').length;
    const pendingCount = localHistory.filter((m) => m.isPending).length;

    return (
        <>
            <Head title="Pembayaran SPP" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <FaCreditCard className="size-6 text-brand" />
                            <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">Pembayaran SPP</h1>
                        </div>
                        <p className="mt-1 text-sm text-brand-muted">
                            {selectedStudent
                                ? `Kelola pembayaran SPP bulanan untuk ${selectedStudent.name}`
                                : 'Kelola pembayaran SPP bulanan anak Anda'}
                        </p>
                    </div>

                    {/* Nominal Info */}
                    {hasSppSetting && sppAmount && (
                        <div className="flex items-center gap-2 rounded-sm border border-[#c5eec2] bg-[#e7f6e0] px-4 py-2.5">
                            <FaWallet className="size-4 text-brand" />
                            <div>
                                <p className="text-[11px] text-brand-muted">Nominal SPP / Bulan</p>
                                <p className="font-bold text-sm text-brand">{formatRupiah(sppAmount)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* No Children State */}
                {!hasChildren || !selectedStudent ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-200 bg-white p-12 text-center shadow-xs">
                        <div className="flex size-16 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                            <FaUsers className="size-8" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg text-brand-text">Belum Ada Data Anak Terhubung</h2>
                            <p className="mt-1 max-w-md text-sm text-brand-muted">
                                Akun Anda belum memiliki data siswa yang terhubung. Hubungi admin sekolah.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Child Tabs */}
                        {childrenList.length > 1 && (
                            <div className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-100 bg-white p-2 shadow-xs">
                                <span className="px-3 text-xs font-semibold text-brand-muted">Pilih Anak:</span>
                                {childrenList.map((child) => (
                                    <button
                                        key={child.id}
                                        type="button"
                                        onClick={() => handleChildChange(child.id)}
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-semibold transition-all',
                                            selectedStudent.id === child.id
                                                ? 'bg-brand text-white shadow-xs'
                                                : 'bg-neutral-50 text-brand-muted hover:bg-neutral-100 hover:text-brand-text'
                                        )}
                                    >
                                        <FaGraduationCap className="size-4" />
                                        <span>{child.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-md border border-[#c5eec2] bg-[#e7f6e0] p-4 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-brand">Lunas</span>
                                    <FaCircleCheck className="size-4 text-brand" />
                                </div>
                                <p className="mt-2 font-bold text-3xl text-brand">{paidCount}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">dari {localHistory.length} bulan</p>
                            </div>
                            <div className="rounded-md border border-rose-200 bg-rose-50 p-4 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-rose-600">Belum Lunas</span>
                                    <IoMdRemoveCircle className="size-4 text-rose-600" />
                                </div>
                                <p className="mt-2 font-bold text-3xl text-rose-600">{unpaidCount}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">bulan tertunggak</p>
                            </div>
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-amber-600">Menunggu</span>
                                    <MdAccessTimeFilled className="size-4 text-amber-600" />
                                </div>
                                <p className="mt-2 font-bold text-3xl text-amber-600">{pendingCount}</p>
                                <p className="mt-0.5 text-[11px] text-brand-muted">sedang diproses</p>
                            </div>
                        </div>

                        {/* No SPP Setting Warning */}
                        {!hasSppSetting && (
                            <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 shadow-xs">
                                <FaCircleExclamation className="mt-0.5 size-5 shrink-0 text-amber-600" />
                                <div>
                                    <p className="font-semibold text-sm text-amber-800">Nominal SPP Belum Diatur</p>
                                    <p className="mt-0.5 text-xs text-amber-700">
                                        Nominal SPP untuk <strong>{selectedStudent.name}</strong> belum diatur oleh admin.
                                        Silakan hubungi sekolah untuk informasi lebih lanjut.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Monthly SPP Grid */}
                        <div className="rounded-md border border-neutral-100 bg-white p-6 shadow-xs">
                            <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <FaCreditCard className="size-4 text-brand" />
                                    <h2 className="font-semibold text-base text-brand-text">Daftar Tagihan & Riwayat SPP</h2>
                                </div>
                                <span className="text-xs text-brand-muted">{selectedStudent.name}</span>
                            </div>

                            <div className="flex flex-col divide-y divide-neutral-100">
                                {localHistory.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-brand-muted">
                                        Belum ada tagihan SPP untuk periode ini.
                                    </div>
                                ) : (
                                    localHistory.map((record) => {
                                    const config = statusConfig[record.status] ?? statusConfig.unpaid;
                                    const StatusIcon = config.icon;
                                    const isPayable = !record.isPaid && hasSppSetting && sppAmount;
                                    const isLoadingThis = loadingMonth === record.month;
                                    const isCheckingThis = checkingMonth === record.month;

                                    return (
                                        <div
                                            key={record.month}
                                            className="flex flex-col gap-3 py-4 transition-colors first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            {/* Left: Month & Status */}
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        'flex size-11 shrink-0 items-center justify-center rounded-md',
                                                        record.isPaid
                                                            ? 'bg-[#e7f6e0]'
                                                            : record.isPending
                                                              ? 'bg-amber-50'
                                                              : 'bg-neutral-100'
                                                    )}
                                                >
                                                    <StatusIcon
                                                        className={cn('size-5', config.color)}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-brand-text">
                                                        {record.monthLabel}
                                                    </p>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-brand-muted">
                                                        {record.isPaid && record.paidAt && (
                                                            <span className="flex items-center gap-1">
                                                                <FaCircleCheck className="size-3 text-brand" />
                                                                Dibayar {record.paidAt}
                                                            </span>
                                                        )}
                                                        {record.isPaid && record.paymentType && (
                                                            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] uppercase font-medium text-neutral-600">
                                                                {record.paymentType}
                                                            </span>
                                                        )}
                                                        {record.isPending && (
                                                            <span className="flex items-center gap-1 text-amber-600">
                                                                <FaClock className="size-3" />
                                                                Menunggu konfirmasi pembayaran
                                                            </span>
                                                        )}
                                                        {record.status === 'unpaid' && (
                                                            <span className="text-rose-500">Belum ada pembayaran</span>
                                                        )}
                                                        {record.amount && !record.isPaid && (
                                                            <span className="font-medium text-brand-text">
                                                                {formatRupiah(record.amount)}
                                                            </span>
                                                        )}
                                                        {sppAmount && !record.amount && (
                                                            <span className="font-medium text-brand-text">
                                                                {formatRupiah(sppAmount)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Status Badge + Action */}
                                            <div className="flex items-center gap-2 self-end sm:self-center">
                                                {/* Check Status for pending */}
                                                {record.isPending && record.orderId && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => syncStatus(record, record.orderId!)}
                                                        disabled={isCheckingThis}
                                                        className="bg-white rounded-sm cursor-pointer border border-gray-400 h-8 gap-1.5 text-xs text-brand-muted hover:text-brand hover:bg-soft-background"
                                                    >
                                                        {isCheckingThis ? (
                                                            <FaSpinner className="size-3.5 animate-spin" />
                                                        ) : (
                                                            <FaClock className="size-3.5" />
                                                        )}
                                                        Cek Status
                                                    </Button>
                                                )}

                                                {/* Pay Button */}
                                                {isPayable && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handlePaySpp(record)}
                                                        disabled={!!loadingMonth || isLoadingThis}
                                                        className="h-8 rounded-sm gap-1.5 bg-brand text-white text-xs hover:bg-brand/90"
                                                    >
                                                        {isLoadingThis ? (
                                                            <>
                                                                <FaSpinner className="size-3.5 animate-spin" />
                                                                Memproses...
                                                            </>
                                                        ) : record.isPending ? (
                                                            <>
                                                                <FaCreditCard className="size-3.5" />
                                                                Lanjutkan Bayar
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaCreditCard className="size-3.5" />
                                                                Bayar SPP
                                                            </>
                                                        )}
                                                    </Button>
                                                )}

                                                {/* Status Badge */}
                                                <span
                                                    className={cn(
                                                        'inline-flex min-w-24 items-center justify-center gap-1 rounded-full border px-3 py-1 font-semibold text-xs shadow-2xs',
                                                        config.badgeClass
                                                    )}
                                                >
                                                    <StatusIcon className="size-3" />
                                                    {config.label}
                                                </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-4 rounded-md border border-neutral-100 bg-white px-4 py-3 text-xs text-brand-muted shadow-xs">
                            <span className="font-semibold text-brand-text">Keterangan:</span>
                            {Object.entries(statusConfig).map(([key, cfg]) => {
                                const Icon = cfg.icon;
                                return (
                                    <div key={key} className="flex items-center gap-1.5">
                                        <Icon className={cn('size-3.5', cfg.color)} />
                                        <span>{cfg.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

SppPaymentPage.layout = {
    breadcrumbs: [
        {
            title: 'Pembayaran SPP',
            href: sppPaymentRoute(),
        },
    ],
};
