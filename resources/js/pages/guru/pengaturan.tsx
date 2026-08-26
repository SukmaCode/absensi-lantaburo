import { Head, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Camera,
    CheckCircle2,
    GraduationCap,
    Info,
    KeyRound,
    Lock,
    Mail,
    Phone,
    Save,
    School,
    ShieldCheck,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, pengaturan } from '@/routes/guru';
import { password, update } from '@/routes/guru/pengaturan';
import type { PengaturanGuruPageProps } from '@/types/guru';

export default function GuruPengaturan({
    teacher,
    user,
    status,
}: PengaturanGuruPageProps) {
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [photoPreview, setPhotoPreview] = useState<string | null>(user.avatar || null);

    // Profile Form
    const profileForm = useForm<{
        name: string;
        email: string;
        phone: string;
        nip: string;
        subject: string;
        photo: File | string | null;
        remove_photo: boolean;
    }>({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nip: teacher.nip || '',
        subject: teacher.subject || '',
        photo: null,
        remove_photo: false,
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            profileForm.setData((prev) => ({
                ...prev,
                photo: file,
                remove_photo: false,
            }));

            const reader = new FileReader();
            reader.onload = (event) => {
                setPhotoPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        profileForm.setData((prev) => ({
            ...prev,
            photo: null,
            remove_photo: true,
        }));
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(update.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put(password.url(), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Pengaturan Akun Guru" />

            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-brand-soft/30 p-6 shadow-xs sm:p-8">
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative group">
                                <Avatar className="size-20 rounded-md border-2 border-brand/20 shadow-md sm:size-24">
                                    <AvatarImage
                                        src={photoPreview || undefined}
                                        alt={user.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="rounded-md bg-brand-soft font-bold text-2xl text-brand-dark">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-sm border border-white bg-brand text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                                    title="Ubah Foto Profil"
                                >
                                    <Camera className="size-4" />
                                </button>
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                                        {user.name || 'Profil Guru'}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700 text-xs">
                                        <GraduationCap className="size-3.5" />
                                        Tenaga Pendidik
                                    </span>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-muted">
                                    <span>
                                        NIP:{' '}
                                        <span className="font-medium text-brand-text">
                                            {teacher.nip || 'Belum diatur'}
                                        </span>
                                    </span>
                                    <span>&bull;</span>
                                    <span>
                                        Mata Pelajaran:{' '}
                                        <span className="font-medium text-brand-text">
                                            {teacher.subject || 'Belum diatur'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Homeroom Assignment Badge Card */}
                        <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-white/90 p-4 shadow-xs backdrop-blur-xs sm:min-w-[260px]">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-semibold text-brand-text">
                                    <School className="size-4 text-brand" />
                                    Penugasan Kelas
                                </span>
                                {teacher.homeroomClass ? (
                                    <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-[11px] text-brand-dark">
                                        Wali Kelas
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-[11px] text-neutral-600">
                                        Guru Pengajar
                                    </span>
                                )}
                            </div>
                            <div className="mt-1">
                                {teacher.homeroomClass ? (
                                    <p className="font-bold text-brand-text text-sm">
                                        {teacher.homeroomClass.name} (Tingkat {teacher.homeroomClass.gradeLevel})
                                    </p>
                                ) : (
                                    <p className="text-brand-muted text-xs">
                                        Tidak mengampu perwalian kelas saat ini.
                                    </p>
                                )}
                            </div>
                            <p className="text-[11px] text-brand-muted">
                                Status akun:{' '}
                                <span className="font-semibold text-emerald-600 capitalize">
                                    {user.status === 'active' ? 'Aktif' : user.status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Alerts */}
                {status === 'profile-updated' && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 shadow-xs">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                        <p className="font-medium text-sm">
                            Profil dan informasi data guru Anda berhasil diperbarui.
                        </p>
                    </div>
                )}

                {status === 'password-updated' && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 shadow-xs">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                        <p className="font-medium text-sm">Kata sandi akun Anda berhasil diperbarui.</p>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-neutral-200 border-b pb-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={cn(
                            'flex items-center gap-2 cursor-pointer rounded-sm px-4 py-2.5 font-semibold text-sm transition-all',
                            activeTab === 'profile'
                                ? 'bg-brand text-white shadow-xs'
                                : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-brand-text',
                        )}
                    >
                        <UserIcon className="size-4" />
                        Data Diri & Pengajar
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className={cn(
                            'flex items-center gap-2 cursor-pointer rounded-sm px-4 py-2.5 font-semibold text-sm transition-all',
                            activeTab === 'security'
                                ? 'bg-brand text-white shadow-xs'
                                : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-brand-text',
                        )}
                    >
                        <ShieldCheck className="size-4" />
                        Keamanan & Akun
                    </button>
                </div>

                {/* Hidden File Input for Avatar */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                />

                {/* TAB 1: DATA DIRI & PENGAJAR */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                            <div className="border-neutral-100 border-b pb-4">
                                <h2 className="font-bold text-brand-text text-lg sm:text-xl">
                                    Informasi Profil & Data Guru
                                </h2>
                                <p className="mt-0.5 text-brand-muted text-xs sm:text-sm">
                                    Perbarui identitas pendidik, NIP, serta mata pelajaran yang Anda ampu di sekolah.
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Photo Upload Section */}
                                <div className="sm:col-span-2">
                                    <Label className="font-semibold text-brand-text text-sm">Foto Profil</Label>
                                    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <Avatar className="size-16 rounded-sm border border-neutral-200 shadow-xs">
                                            <AvatarImage
                                                src={photoPreview || undefined}
                                                alt={user.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="rounded-sm bg-brand-soft font-semibold text-brand-dark">
                                                {getInitials(profileForm.data.name || 'Guru')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="rounded-sm bg-brand text-xs text-white cursor-pointer hover:bg-brand-dark"
                                            >
                                                <Camera className="mr-1.5 size-3.5 text-white" />
                                                Pilih Foto Baru
                                            </Button>
                                            {photoPreview && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemovePhoto}
                                                    className="rounded-sm text-rose-600 text-xs hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                                                >
                                                    <Trash2 className="mr-1.5 size-3.5" />
                                                    Hapus Foto
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-1.5 text-[11px] text-brand-muted">
                                        Format JPG, PNG, atau WEBP. Maksimal 2MB.
                                    </p>
                                    <InputError message={profileForm.errors.photo} className="mt-1" />
                                </div>

                                {/* Nama Lengkap */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="name" className="font-semibold text-brand-text text-sm">
                                        Nama Lengkap Guru <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            placeholder="Nama lengkap beserta gelar (contoh: Ahmad Fauzi, S.Pd.)"
                                            className="border-neutral-200 focus:border-brand"
                                            required
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.name} className="mt-1" />
                                </div>

                                {/* NIP */}
                                <div>
                                    <Label htmlFor="nip" className="font-semibold text-brand-text text-sm">
                                        Nomor Induk Pegawai (NIP)
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="nip"
                                            type="text"
                                            value={profileForm.data.nip}
                                            onChange={(e) => profileForm.setData('nip', e.target.value)}
                                            placeholder="Contoh: 198501012010011001"
                                            className="border-neutral-200 focus:border-brand"
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.nip} className="mt-1" />
                                </div>

                                {/* Mata Pelajaran */}
                                <div>
                                    <Label htmlFor="subject" className="font-semibold text-brand-text text-sm">
                                        Mata Pelajaran yang Diampu
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={profileForm.data.subject}
                                            onChange={(e) => profileForm.setData('subject', e.target.value)}
                                            placeholder="Contoh: Matematika / Bahasa Arab"
                                            className="border-neutral-200 focus:border-brand"
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.subject} className="mt-1" />
                                </div>

                                {/* Nomor Telepon / WA */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="phone" className="font-semibold text-brand-text text-sm">
                                        No. WhatsApp / Telepon
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={profileForm.data.phone}
                                            onChange={(e) => profileForm.setData('phone', e.target.value)}
                                            placeholder="Contoh: 081234567890"
                                            className="border-neutral-200 focus:border-brand"
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.phone} className="mt-1" />
                                </div>

                                {/* Informational Banner for Homeroom */}
                                <div className="sm:col-span-2 rounded-lg border border-emerald-100 bg-emerald-50/60 p-4 text-emerald-900 text-xs">
                                    <div className="flex items-start gap-2.5">
                                        <Info className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Informasi Penugasan Wali Kelas</p>
                                            <p className="mt-0.5 text-emerald-800">
                                                {teacher.homeroomClass ? (
                                                    <>
                                                        Saat ini Anda ditugaskan sebagai wali kelas{' '}
                                                        <span className="font-bold">{teacher.homeroomClass.name}</span>.
                                                        Pengaturan penugasan kelas dikelola secara terpusat oleh administrator sekolah.
                                                    </>
                                                ) : (
                                                    'Anda belum ditugaskan sebagai wali kelas. Fitur absensi murid dan rekap kehadiran kelas akan aktif otomatis setelah administrator menugaskan kelas kepada Anda.'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3 border-neutral-100 border-t pt-4">
                                <Button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="gap-2 rounded-sm bg-brand px-6 font-semibold text-white shadow-xs hover:bg-brand-dark cursor-pointer"
                                >
                                    <Save className="size-4" />
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Data Guru'}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                {/* TAB 2: KEAMANAN & AKUN */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Email & Akun */}
                        <form onSubmit={handleProfileSubmit} className="h-full">
                            <div className="flex h-full flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                                <div>
                                    <div className="border-neutral-100 border-b pb-4">
                                        <h2 className="font-bold text-brand-text text-lg">Alamat Email Akun</h2>
                                        <p className="mt-0.5 text-brand-muted text-xs">
                                            Email digunakan untuk masuk ke portal guru dan pemberitahuan sistem.
                                        </p>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <Label htmlFor="email" className="font-semibold text-brand-text text-sm">
                                                Alamat Email <span className="text-rose-500">*</span>
                                            </Label>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileForm.data.email}
                                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                                    placeholder="guru@lantaburo.sch.id"
                                                    className="border-neutral-200 focus:border-brand"
                                                    required
                                                />
                                            </div>
                                            <InputError message={profileForm.errors.email} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end border-neutral-100 border-t pt-4">
                                    <Button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="gap-2 rounded-sm bg-brand px-5 font-semibold text-white shadow-xs hover:bg-brand-dark cursor-pointer"
                                    >
                                        <Save className="size-4" />
                                        {profileForm.processing ? 'Menyimpan...' : 'Perbarui Email'}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Ganti Kata Sandi */}
                        <form onSubmit={handlePasswordSubmit} className="h-full">
                            <div className="flex h-full flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                                <div>
                                    <div className="border-neutral-100 border-b pb-4">
                                        <h2 className="font-bold text-brand-text text-lg">Ubah Kata Sandi</h2>
                                        <p className="mt-0.5 text-brand-muted text-xs">
                                            Pastikan kata sandi baru Anda aman dan minimal 8 karakter.
                                        </p>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <Label
                                                htmlFor="current_password"
                                                className="font-semibold text-brand-text text-sm"
                                            >
                                                Kata Sandi Saat Ini
                                            </Label>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="current_password"
                                                    type="password"
                                                    value={passwordForm.data.current_password}
                                                    onChange={(e) =>
                                                        passwordForm.setData('current_password', e.target.value)
                                                    }
                                                    placeholder="••••••••"
                                                    className="border-neutral-200 focus:border-brand"
                                                    autoComplete="current-password"
                                                />
                                            </div>
                                            <InputError
                                                message={passwordForm.errors.current_password}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="password" className="font-semibold text-brand-text text-sm">
                                                Kata Sandi Baru
                                            </Label>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={passwordForm.data.password}
                                                    onChange={(e) =>
                                                        passwordForm.setData('password', e.target.value)
                                                    }
                                                    placeholder="••••••••"
                                                    className="border-neutral-200 focus:border-brand"
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                            <InputError message={passwordForm.errors.password} className="mt-1" />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="password_confirmation"
                                                className="font-semibold text-brand-text text-sm"
                                            >
                                                Konfirmasi Kata Sandi Baru
                                            </Label>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={passwordForm.data.password_confirmation}
                                                    onChange={(e) =>
                                                        passwordForm.setData('password_confirmation', e.target.value)
                                                    }
                                                    placeholder="••••••••"
                                                    className="border-neutral-200 focus:border-brand"
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                            <InputError
                                                message={passwordForm.errors.password_confirmation}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end border-neutral-100 border-t pt-4">
                                    <Button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="gap-2 rounded-sm bg-brand px-5 font-semibold text-white shadow-xs hover:bg-brand-dark cursor-pointer"
                                    >
                                        <KeyRound className="size-4" />
                                        {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

GuruPengaturan.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Pengaturan Akun',
            href: pengaturan(),
        },
    ],
};
