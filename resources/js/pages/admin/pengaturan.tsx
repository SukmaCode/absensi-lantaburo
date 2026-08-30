import { Head, Link, useForm } from '@inertiajs/react';
import {
    FaArrowRight,
    FaBuilding,
    FaCalendarDays,
    FaCamera,
    FaCircleCheck,
    FaCircleInfo,
    FaEnvelope,
    FaFloppyDisk,
    FaGraduationCap,
    FaKey,
    FaPhone,
    FaSchool,
    FaTrash,
    FaUser,
    FaUsers,
} from 'react-icons/fa6';
import { BsShieldCheck, BsShieldExclamation, BsStars } from 'react-icons/bs';
import { type ChangeEvent, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard as adminDashboard, pengaturan as adminPengaturan, schoolProfile as adminSchoolProfile } from '@/routes/admin';
import { password as adminPasswordRoute, update as adminUpdateRoute } from '@/routes/admin/pengaturan';
import type { PengaturanAdminPageProps } from '@/types/admin';

export default function AdminPengaturan({
    user,
    systemStats,
    status,
}: PengaturanAdminPageProps) {
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'access'>('profile');
    const [photoPreview, setPhotoPreview] = useState<string | null>(user.avatar || null);

    // Profile Form
    const profileForm = useForm<{
        name: string;
        email: string;
        phone: string;
        photo: File | string | null;
        remove_photo: boolean;
    }>({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
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
        profileForm.post(adminUpdateRoute.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put(adminPasswordRoute.url(), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Pengaturan Akun Admin" />

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
                                    <FaCamera className="size-4" />
                                </button>
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                                        {user.name || 'Administrator'}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand-soft px-2.5 py-0.5 font-semibold text-brand-dark text-xs">
                                        <BsShieldCheck className="size-3.5 text-brand" />
                                        Administrator Sistem
                                    </span>
                                </div>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-muted">
                                    <span className="flex items-center gap-1.5">
                                        <FaEnvelope className="size-3.5 text-brand-muted" />
                                        <span className="font-medium text-brand-text">{user.email}</span>
                                    </span>
                                    <span>&bull;</span>
                                    <span className="flex items-center gap-1.5">
                                        <FaPhone className="size-3.5 text-brand-muted" />
                                        <span className="font-medium text-brand-text">
                                            {user.phone || 'Belum diatur'}
                                        </span>
                                    </span>
                                    {user.created_at && (
                                        <>
                                            <span>&bull;</span>
                                            <span className="flex items-center gap-1.5">
                                                <FaCalendarDays className="size-3.5 text-brand-muted" />
                                                <span>Bergabung sejak: {user.created_at}</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* System Scope & Stats Card */}
                        <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-white/90 p-4 shadow-xs backdrop-blur-xs sm:min-w-[280px]">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-semibold text-brand-text">
                                    <FaBuilding className="size-4 text-brand" />
                                    Cakupan Kelola
                                </span>
                                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-semibold text-[11px] text-emerald-700">
                                    Akses Penuh
                                </span>
                            </div>
                            <div className="mt-1 grid grid-cols-3 gap-2 border-neutral-100 border-y py-2 text-center">
                                <div>
                                    <p className="font-bold text-brand-text text-sm">
                                        {systemStats.totalTeachers}
                                    </p>
                                    <p className="text-[11px] text-brand-muted">Guru</p>
                                </div>
                                <div className="border-neutral-100 border-x">
                                    <p className="font-bold text-brand-text text-sm">
                                        {systemStats.totalStudents}
                                    </p>
                                    <p className="text-[11px] text-brand-muted">Siswa</p>
                                </div>
                                <div>
                                    <p className="font-bold text-brand-text text-sm">
                                        {systemStats.totalClasses}
                                    </p>
                                    <p className="text-[11px] text-brand-muted">Kelas</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-brand-muted truncate">
                                Lembaga: <span className="font-semibold text-brand-text">{systemStats.schoolName}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Alerts */}
                {status === 'profile-updated' && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 shadow-xs">
                        <FaCircleCheck className="size-5 shrink-0 text-emerald-600" />
                        <p className="font-medium text-sm">
                            Profil dan informasi akun administrator Anda berhasil diperbarui.
                        </p>
                    </div>
                )}

                {status === 'password-updated' && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 shadow-xs">
                        <FaCircleCheck className="size-5 shrink-0 text-emerald-600" />
                        <p className="font-medium text-sm">Kata sandi akun administrator berhasil diperbarui.</p>
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
                        <FaUser className="size-4" />
                        Data Diri & Profil
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
                        <BsShieldCheck className="size-4" />
                        Keamanan & Kata Sandi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('access')}
                        className={cn(
                            'flex items-center gap-2 cursor-pointer rounded-sm px-4 py-2.5 font-semibold text-sm transition-all',
                            activeTab === 'access'
                                ? 'bg-brand text-white shadow-xs'
                                : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-brand-text',
                        )}
                    >
                        <FaBuilding className="size-4" />
                        Informasi Hak Akses & Sistem
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

                {/* TAB 1: DATA DIRI & PROFIL ADMIN */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                            <div className="border-neutral-100 border-b pb-4">
                                <h2 className="font-bold text-brand-text text-lg sm:text-xl">
                                    Informasi Profil Administrator
                                </h2>
                                <p className="mt-0.5 text-brand-muted text-xs sm:text-sm">
                                    Perbarui nama lengkap, email login, dan nomor kontak Anda sebagai pengelola sistem.
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
                                                {getInitials(profileForm.data.name || 'Admin')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="rounded-sm bg-brand text-xs text-white cursor-pointer hover:bg-brand-dark"
                                            >
                                                <FaCamera className="mr-1.5 size-3.5 text-white" />
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
                                                    <FaTrash className="mr-1.5 size-3.5" />
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
                                        Nama Lengkap Administrator <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            placeholder="Nama lengkap administrator"
                                            className="border-neutral-200 focus:border-brand"
                                            required
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.name} className="mt-1" />
                                </div>

                                {/* Alamat Email */}
                                <div>
                                    <Label htmlFor="email" className="font-semibold text-brand-text text-sm">
                                        Alamat Email Login <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            placeholder="admin@lantaburo.sch.id"
                                            className="border-neutral-200 focus:border-brand"
                                            required
                                        />
                                    </div>
                                    <p className="mt-1 text-[11px] text-brand-muted">
                                        Email ini digunakan untuk autentikasi dan notifikasi sistem.
                                    </p>
                                    <InputError message={profileForm.errors.email} className="mt-1" />
                                </div>

                                {/* Nomor WhatsApp / Telepon */}
                                <div>
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
                                    <p className="mt-1 text-[11px] text-brand-muted">
                                        Kontak darurat atau koordinasi sistem sekolah.
                                    </p>
                                    <InputError message={profileForm.errors.phone} className="mt-1" />
                                </div>

                                {/* Informational Banner */}
                                <div className="sm:col-span-2 rounded-lg border border-brand/20 bg-brand-soft/40 p-4 text-brand-dark text-xs">
                                    <div className="flex items-start gap-2.5">
                                        <FaCircleInfo className="size-4 shrink-0 text-brand mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-brand-text">Hak Otoritas Akun Administrator</p>
                                            <p className="mt-0.5 text-brand-muted leading-relaxed">
                                                Akun ini memiliki kewenangan penuh dalam mengelola master data (siswa, guru, kelas), absensi sekolah, pengumuman publik, serta data profil lembaga. Pastikan data akun selalu diperbarui secara berkala demi keamanan sistem.
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
                                    <FaFloppyDisk className="size-4" />
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Profil Admin'}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                {/* TAB 2: KEAMANAN & KATA SANDI */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Ganti Kata Sandi */}
                        <form onSubmit={handlePasswordSubmit} className="h-full">
                            <div className="flex h-full flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                                <div>
                                    <div className="border-neutral-100 border-b pb-4">
                                        <h2 className="font-bold text-brand-text text-lg">Ubah Kata Sandi</h2>
                                        <p className="mt-0.5 text-brand-muted text-xs">
                                            Gunakan kombinasi kata sandi yang kuat dan tidak digunakan di situs lain.
                                        </p>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <Label
                                                htmlFor="current_password"
                                                className="font-semibold text-brand-text text-sm"
                                            >
                                                Kata Sandi Saat Ini <span className="text-rose-500">*</span>
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
                                                    required
                                                />
                                            </div>
                                            <InputError
                                                message={passwordForm.errors.current_password}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="password" className="font-semibold text-brand-text text-sm">
                                                Kata Sandi Baru <span className="text-rose-500">*</span>
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
                                                    required
                                                />
                                            </div>
                                            <InputError message={passwordForm.errors.password} className="mt-1" />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="password_confirmation"
                                                className="font-semibold text-brand-text text-sm"
                                            >
                                                Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
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
                                                    required
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
                                        <FaKey className="size-4" />
                                        {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Security Guidelines & Tips */}
                        <div className="flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                            <div>
                                <div className="border-neutral-100 border-b pb-4">
                                    <div className="flex items-center gap-2">
                                        <BsShieldExclamation className="size-5 text-amber-500" />
                                        <h2 className="font-bold text-brand-text text-lg">Panduan Keamanan Akun</h2>
                                    </div>
                                    <p className="mt-0.5 text-brand-muted text-xs">
                                        Rekomendasi untuk menjaga integritas dan keamanan portal administrator.
                                    </p>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-4">
                                        <p className="font-semibold text-brand-text text-sm">1. Standar Kata Sandi Kuat</p>
                                        <p className="mt-1 text-brand-muted text-xs leading-relaxed">
                                            Gunakan minimal 8 karakter dengan perpaduan huruf besar, huruf kecil, angka, dan karakter simbol unik (contoh: @, #, $, !).
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-4">
                                        <p className="font-semibold text-brand-text text-sm">2. Jangan Bagikan Kredensial</p>
                                        <p className="mt-1 text-brand-muted text-xs leading-relaxed">
                                            Kredensial administrator memiliki akses tanpa batas. Jangan pernah membagikan email atau kata sandi kepada pihak lain.
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-4">
                                        <p className="font-semibold text-brand-text text-sm">3. Selalu Keluar di Perangkat Umum</p>
                                        <p className="mt-1 text-brand-muted text-xs leading-relaxed">
                                            Pastikan melakukan <i>Log Out</i> setelah selesai mengakses sistem dari komputer sekolah atau perangkat bersama.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3.5 text-emerald-900 text-xs">
                                <div className="flex items-center gap-2 font-semibold">
                                    <BsStars className="size-4 text-emerald-600" />
                                    <span>Status Keamanan Sistem: Normal & Terlindungi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: HAK AKSES & INFORMASI SISTEM */}
                {activeTab === 'access' && (
                    <div className="space-y-6">
                        {/* Modules Overview */}
                        <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                            <div className="border-neutral-100 border-b pb-4">
                                <h2 className="font-bold text-brand-text text-lg sm:text-xl">
                                    Cakupan Hak Akses Modul Administrator
                                </h2>
                                <p className="mt-0.5 text-brand-muted text-xs sm:text-sm">
                                    Daftar modul fungsional yang dapat dikelola langsung oleh akun administrator ini.
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg border border-neutral-200/70 bg-white p-4 shadow-2xs">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                            <FaUsers className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-brand-text text-sm">Data Siswa</p>
                                            <p className="text-[11px] text-brand-muted">
                                                {systemStats.totalStudents} Siswa Terdaftar
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-neutral-200/70 bg-white p-4 shadow-2xs">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <FaGraduationCap className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-brand-text text-sm">Data Guru & Tenaga Didik</p>
                                            <p className="text-[11px] text-brand-muted">
                                                {systemStats.totalTeachers} Guru Terdaftar
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-neutral-200/70 bg-white p-4 shadow-2xs">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                            <FaSchool className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-brand-text text-sm">Data Rombel & Kelas</p>
                                            <p className="text-[11px] text-brand-muted">
                                                {systemStats.totalClasses} Kelas Aktif
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Link Card to School Profile Settings */}
                        <div className="relative overflow-hidden rounded-xl border border-brand/30 bg-gradient-to-br from-white via-white to-brand-soft/40 p-6 shadow-xs sm:p-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md">
                                        <FaBuilding className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-text text-lg">
                                            Pengaturan Profil Lembaga & Sekolah
                                        </h3>
                                        <p className="mt-1 text-brand-muted text-xs sm:text-sm max-w-xl leading-relaxed">
                                            Kelola identitas utama sekolah, logo institusi, alamat resmi, nomor kontak publik, dan deskripsi profil yang ditampilkan di halaman beranda portal.
                                        </p>
                                    </div>
                                </div>

                                <Button asChild className="shrink-0 gap-2 bg-brand text-white hover:bg-brand-dark cursor-pointer">
                                    <Link href={adminSchoolProfile()}>
                                        Buka Pengaturan Sekolah
                                        <FaArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AdminPengaturan.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: adminDashboard(),
        },
        {
            title: 'Pengaturan Akun',
            href: adminPengaturan(),
        },
    ],
};
