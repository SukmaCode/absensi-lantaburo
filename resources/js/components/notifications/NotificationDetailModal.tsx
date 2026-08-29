import { useState } from 'react';
import {
    Hash,
    UserPlus,
} from 'lucide-react';
import {
    FaGraduationCap,
    FaReceipt,
    FaAddressBook,
    FaUser,
    FaCalendar,
    FaPhone,
    FaHome,
    FaCreditCard
} from "react-icons/fa";
import { IoMdMale, IoMdFemale, IoMdMail } from "react-icons/io";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FormAddParent from '@/components/data-orangtua/FormAddParent';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AdminNotificationItem, AvailableStudentOption } from '@/types/admin';

interface Props {
    item: AdminNotificationItem | null;
    onClose: () => void;
    availableStudents?: AvailableStudentOption[];
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatBirthDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function PaymentStatusBadge({ status }: { status: string }) {
    const isPaid = ['success', 'settlement', 'capture'].includes(status);
    return (
        <Badge
            className={
                isPaid
                    ? 'bg-[#e7f6e0] text-brand hover:bg-[#e7f6e0]'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-50'
            }
        >
            {isPaid ? 'Lunas' : status}
        </Badge>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft/60">
                <Icon className="size-4 text-brand" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-brand-muted">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-brand-text break-words">{value}</p>
            </div>
        </div>
    );
}

export default function NotificationDetailModal({ item, onClose, availableStudents = [] }: Props) {
    const [openAddParent, setOpenAddParent] = useState(false);

    if (!item) return null;

    const genderLabel =
        item.gender === 'male' || item.gender === 'L'
            ? 'Laki-laki'
            : item.gender === 'female' || item.gender === 'P'
                ? 'Perempuan'
                : item.gender ?? '-';

    return (
        <>
            <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl bg-white text-black custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-black">
                            <FaGraduationCap className="size-5 text-brand" />
                            {item.name}
                        </DialogTitle>
                        <DialogDescription>
                            Detail pembayaran dan data siswa · NIS: {item.nis}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="payment" className="mt-2">
                        <TabsList className="w-full bg-neutral-100">
                            <TabsTrigger
                                value="payment"
                                className="flex-1 text-black data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm"
                            >
                                <FaReceipt className="size-3.5 mr-1.5" />
                                History Pembayaran
                            </TabsTrigger>
                            <TabsTrigger
                                value="student"
                                className="flex-1 text-black data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:shadow-sm"
                            >
                                <FaAddressBook className="size-3.5 mr-1.5" />
                                Data Siswa
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab 1 – History Pembayaran */}
                        <TabsContent value="payment" className="mt-4">
                            <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                        Pembayaran Registrasi
                                    </span>
                                    <PaymentStatusBadge status={item.payment.status} />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InfoRow
                                        icon={Hash}
                                        label="Order ID"
                                        value={item.payment.order_id}
                                    />
                                    <InfoRow
                                        icon={FaCreditCard}
                                        label="Jumlah"
                                        value={
                                            <span className="text-brand font-semibold">
                                                {item.payment.formatted_amount}
                                            </span>
                                        }
                                    />
                                    <InfoRow
                                        icon={FaCreditCard}
                                        label="Metode Pembayaran"
                                        value={
                                            item.payment.payment_type
                                                ? item.payment.payment_type
                                                    .replace(/_/g, ' ')
                                                    .replace(/\b\w/g, (c) => c.toUpperCase())
                                                : '-'
                                        }
                                    />
                                    <InfoRow
                                        icon={FaCalendar}
                                        label="Tanggal Bayar"
                                        value={formatDate(item.payment.settlement_time)}
                                    />
                                    <InfoRow
                                        icon={FaCalendar}
                                        label="Tanggal Daftar"
                                        value={formatDate(item.payment.created_at)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Tab 2 – Data Siswa */}
                        <TabsContent value="student" className="mt-4 space-y-4">
                            {/* Data Pribadi Siswa */}
                            <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                                    Data Pribadi Siswa
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InfoRow icon={FaUser} label="Nama Lengkap" value={item.name} />
                                    <InfoRow icon={Hash} label="NIS" value={item.nis} />
                                    <InfoRow
                                        icon={FaGraduationCap}
                                        label="Kelas"
                                        value={item.class ?? '-'}
                                    />
                                    <InfoRow icon={item.gender === 'male' || item.gender === 'L' ? IoMdMale : IoMdFemale} label="Jenis Kelamin" value={genderLabel} />
                                    <InfoRow
                                        icon={FaCalendar}
                                        label="Tanggal Lahir"
                                        value={formatBirthDate(item.birth_date)}
                                    />
                                    <InfoRow
                                        icon={IoMdMail}
                                        label="Email Akun"
                                        value={item.email}
                                    />
                                    <InfoRow
                                        icon={FaPhone}
                                        label="No. HP Siswa"
                                        value={item.phone ?? '-'}
                                    />
                                    <InfoRow
                                        icon={FaHome}
                                        label="Alamat"
                                        value={item.address ?? '-'}
                                    />
                                </div>
                            </div>

                            {/* Data Orang Tua */}
                            <div className="rounded-xl border border-brand-soft bg-brand-soft/20 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                                        Data Orang Tua
                                    </p>
                                    {item.parent_name && item.parent_phone && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => setOpenAddParent(true)}
                                            className="h-8 bg-brand px-3 text-white hover:bg-brand-dark cursor-pointer text-xs gap-1.5"
                                        >
                                            <UserPlus className="size-3.5" />
                                            Tambah Orang Tua
                                        </Button>
                                    )}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InfoRow
                                        icon={FaUser}
                                        label="Nama Orang Tua"
                                        value={
                                            item.parent_name ? (
                                                <span className="font-semibold text-brand-dark">
                                                    {item.parent_name}
                                                </span>
                                            ) : (
                                                <span className="italic text-brand-muted">Belum diisi</span>
                                            )
                                        }
                                    />
                                    <InfoRow
                                        icon={FaPhone}
                                        label="No. HP / WA Orang Tua"
                                        value={
                                            item.parent_phone ? (
                                                <a
                                                    href={`https://wa.me/${item.parent_phone.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark"
                                                >
                                                    {item.parent_phone}
                                                </a>
                                            ) : (
                                                <span className="italic text-brand-muted">Belum diisi</span>
                                            )
                                        }
                                    />
                                </div>

                                {(!item.parent_name || !item.parent_phone) && (
                                    <p className="mt-3 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                                        ⚠️ Data orang tua belum lengkap. Harap lengkapi sebelum membuat akun orang tua.
                                    </p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Dialog Tambah Orang Tua dari Notifikasi */}
            <Dialog open={openAddParent} onOpenChange={setOpenAddParent}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-white text-black custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="text-black">
                            Tambah Orang Tua
                        </DialogTitle>
                        <DialogDescription>
                            Data orang tua diisi otomatis dari formulir pendaftaran siswa.
                        </DialogDescription>
                    </DialogHeader>
                    <FormAddParent
                        availableStudents={availableStudents}
                        onSuccess={() => setOpenAddParent(false)}
                        initialValues={{
                            name: item.parent_name ?? '',
                            phone: item.parent_phone ?? '',
                            email: item.parent_name
                                ? item.parent_name.toLowerCase().replace(/\s+/g, '') + '@gmail.com'
                                : '',
                            password: 'password',
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
