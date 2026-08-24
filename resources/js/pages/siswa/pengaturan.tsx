import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Camera,
    CheckCircle2,
    GraduationCap,
    HeartHandshake,
    KeyRound,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    Sparkles,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, pengaturan } from '@/routes/siswa';
import type { PengaturanSiswaPageProps } from '@/types/siswa';

export default function SiswaPengaturan({
    student,
    user,
    classes,
    status,
}: PengaturanSiswaPageProps) {
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'parent' | 'security'>('profile');
    const [photoPreview, setPhotoPreview] = useState<string | null>(user.avatar || null);

    // Profile Form
    const profileForm = useForm<{
        name: string;
        email: string;
        phone: string;
        nis: string;
        class_id: string;
        gender: 'L' | 'P';
        birth_date: string;
        address: string;
        parent_name: string;
        parent_phone: string;
        photo: File | string | null;
        remove_photo: boolean;
    }>({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nis: student.nis || '',
        class_id: student.class_id ? String(student.class_id) : '',
        gender: student.gender || 'L',
        birth_date: student.birth_date || '',
        address: student.address || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        photo: null,
        remove_photo: false,
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Calculate profile completeness score
    const requiredFields = [
        profileForm.data.name,
        profileForm.data.email,
        profileForm.data.nis,
        profileForm.data.class_id,
        profileForm.data.gender,
        profileForm.data.birth_date,
        profileForm.data.phone,
        profileForm.data.address,
        profileForm.data.parent_name,
        profileForm.data.parent_phone,
    ];
    const filledCount = requiredFields.filter((val) => Boolean(val && String(val).trim() !== '')).length;
    const completenessPercent = Math.round((filledCount / requiredFields.length) * 100);

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
        profileForm.post(pengaturan.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/siswa/pengaturan/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Pengaturan Akun Siswa" />

            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-brand-soft/30 p-6 shadow-xs sm:p-8">
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative group">
                                <Avatar className="size-20 rounded-md border-2 border-brand/20 shadow-md sm:size-24">
                                    <AvatarImage src={photoPreview || undefined} alt={user.name} className="object-cover" />
                                    <AvatarFallback className="rounded-md bg-brand-soft font-bold text-2xl text-brand-dark">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-sm border border-white bg-brand text-white shadow-md transition-transform hover:scale-110"
                                    title="Ubah Foto Profil"
                                >
                                    <Camera className="size-4" />
                                </button>
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="font-bold text-2xl text-brand-text sm:text-3xl">
                                        {user.name || 'Profil Siswa'}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700 text-xs">
                                        <GraduationCap className="size-3.5" />
                                        Siswa Aktif
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-brand-muted">
                                    NIS: <span className="font-medium text-brand-text">{student.nis || '-'}</span> &bull; Kelas:{' '}
                                    <span className="font-medium text-brand-text">{student.className || 'Belum diatur'}</span>
                                </p>
                            </div>
                        </div>

                        {/* Profile Completion Indicator */}
                        <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-xs sm:min-w-[260px]">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-semibold text-brand-text">
                                    <Sparkles className="size-4 text-brand" />
                                    Kelengkapan Data
                                </span>
                                <span className="font-bold text-brand">{completenessPercent}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-brand-soft to-brand transition-all duration-500"
                                    style={{ width: `${completenessPercent}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-brand-muted">
                                {completenessPercent === 100
                                    ? 'Data profil Anda sudah terisi lengkap!'
                                    : 'Lengkapi seluruh informasi data diri & orang tua.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Alerts */}
                {status === 'profile-updated' && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 shadow-xs">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                        <p className="font-medium text-sm">Profil dan data siswa Anda berhasil diperbarui.</p>
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
                        Data Diri & Akademik
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('parent')}
                        className={cn(
                            'flex items-center gap-2 cursor-pointer rounded-sm px-4 py-2.5 font-semibold text-sm transition-all',
                            activeTab === 'parent'
                                ? 'bg-brand text-white shadow-xs'
                                : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-brand-text',
                        )}
                    >
                        <HeartHandshake className="size-4" />
                        Data Orang Tua / Wali
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

                {/* TAB 1: DATA DIRI & AKADEMIK */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                            <div className="border-neutral-100 border-b pb-4">
                                <h2 className="font-bold text-brand-text text-lg sm:text-xl">
                                    Informasi Data Diri Siswa
                                </h2>
                                <p className="mt-0.5 text-brand-muted text-xs sm:text-sm">
                                    Isi informasi identitas siswa dan data akademik sekolah dengan lengkap.
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Photo Upload Section */}
                                <div className="sm:col-span-2">
                                    <Label className="font-semibold text-brand-text text-sm">Foto Profil</Label>
                                    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <Avatar className="size-16 rounded-sm border border-neutral-200 shadow-xs">
                                            <AvatarImage src={photoPreview || undefined} alt={user.name} className="object-cover" />
                                            <AvatarFallback className="rounded-xl bg-brand-soft font-semibold text-brand-dark">
                                                {getInitials(profileForm.data.name || 'Siswa')}
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
                                                    className="rounded-sm text-rose-600 text-xs hover:bg-rose-50 hover:text-rose-700"
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

                                {/* NIS */}
                                <div>
                                    <p className="font-semibold text-brand-text text-sm">
                                        Nomor Induk Siswa (NIS) <span className="text-rose-500">*</span>
                                    </p>
                                    <div className="relative mt-1.5">
                                        <p className='font-regular text-brand-text text-sm'>{profileForm.data.nis}</p>
                                    </div>
                                    <InputError message={profileForm.errors.nis} className="mt-1" />
                                </div>

                                {/* Nama Lengkap */}
                                <div>
                                    <Label htmlFor="name" className="font-semibold text-brand-text text-sm">
                                        Nama Lengkap Siswa <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            placeholder="Nama lengkap sesuai akta/ijazah"
                                            className="border-neutral-200 focus:border-brand"
                                            required
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.name} className="mt-1" />
                                </div>

                                {/* Pilihan Kelas */}
                                <div>
                                    <p className="font-semibold text-brand-text text-sm">
                                        Kelas
                                    </p>
                                    <div className="mt-1.5">
                                        <p className='font-regular text-brand-text text-sm'>{profileForm.data.class_id || 'Belum ada kelas'}</p>
                                    </div>
                                    <InputError message={profileForm.errors.class_id} className="mt-1" />
                                </div>

                                {/* Jenis Kelamin */}
                                <div>
                                    <Label className="font-semibold text-brand-text text-sm">
                                        Jenis Kelamin <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="mt-1.5 grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => profileForm.setData('gender', 'L')}
                                            className={cn(
                                                'flex items-center justify-center gap-2 rounded-sm border p-3 font-semibold text-sm transition-all',
                                                profileForm.data.gender === 'L'
                                                    ? 'border-brand bg-brand-soft/40 text-brand-dark ring-2 ring-brand/20'
                                                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300',
                                            )}
                                        >
                                            <span className="flex size-5 items-center justify-center rounded-full border border-current text-xs">
                                                L
                                            </span>
                                            Laki-laki
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => profileForm.setData('gender', 'P')}
                                            className={cn(
                                                'flex items-center justify-center gap-2 rounded-sm border p-3 font-semibold text-sm transition-all',
                                                profileForm.data.gender === 'P'
                                                    ? 'border-brand bg-brand-soft/40 text-brand-dark ring-2 ring-brand/20'
                                                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300',
                                            )}
                                        >
                                            <span className="flex size-5 items-center justify-center rounded-full border border-current text-xs">
                                                P
                                            </span>
                                            Perempuan
                                        </button>
                                    </div>
                                    <InputError message={profileForm.errors.gender} className="mt-1" />
                                </div>

                                {/* Tanggal Lahir */}
                                <div>
                                    <Label htmlFor="birth_date" className="font-semibold text-brand-text text-sm">
                                        Tanggal Lahir
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={profileForm.data.birth_date}
                                            onChange={(e) => profileForm.setData('birth_date', e.target.value)}
                                            className="border-neutral-200 focus:border-brand"
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.birth_date} className="mt-1" />
                                </div>

                                {/* Nomor Telepon / WA Siswa */}
                                <div>
                                    <Label htmlFor="phone" className="font-semibold text-brand-text text-sm">
                                        No. WhatsApp / Telepon Siswa
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

                                {/* Alamat Lengkap */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="address" className="font-semibold text-brand-text text-sm">
                                        Alamat Tempat Tinggal
                                    </Label>
                                    <div className="mt-1.5">
                                        <Textarea
                                            id="address"
                                            rows={3}
                                            value={profileForm.data.address}
                                            onChange={(e) => profileForm.setData('address', e.target.value)}
                                            placeholder="Alamat lengkap (nama jalan, RT/RW, kelurahan, kecamatan, kota)"
                                            className="border-neutral-200 focus:border-brand"
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.address} className="mt-1" />
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3 border-neutral-100 border-t pt-4">
                                <Button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="gap-2 rounded-sm bg-brand px-6 font-semibold text-white shadow-xs hover:bg-brand-dark"
                                >
                                    <Save className="size-4" />
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Data Diri'}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                {/* TAB 2: DATA ORANG TUA / WALI */}
                {activeTab === 'parent' && (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                            <div className="border-neutral-100 border-b pb-4">
                                <h2 className="font-bold text-brand-text text-lg sm:text-xl">
                                    Data Orang Tua / Wali
                                </h2>
                                <p className="mt-0.5 text-brand-muted text-xs sm:text-sm">
                                    Informasi ini penting untuk komunikasi sekolah terkait absensi dan laporan akademik.
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Nama Orang Tua / Wali */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="parent_name" className="font-semibold text-brand-text text-sm">
                                        Nama Lengkap Orang Tua / Wali
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="parent_name"
                                            type="text"
                                            value={profileForm.data.parent_name}
                                            onChange={(e) => profileForm.setData('parent_name', e.target.value)}
                                            placeholder="Contoh: Bapak Ahmad / Ibu Siti"
                                            className="border-neutral-200 focus:border-brand"
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.parent_name} className="mt-1" />
                                </div>

                                {/* No Telepon / WA Orang Tua */}
                                <div className="sm:col-span-2">
                                    <Label htmlFor="parent_phone" className="font-semibold text-brand-text text-sm">
                                        No. WhatsApp / Telepon Orang Tua
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="parent_phone"
                                            type="tel"
                                            value={profileForm.data.parent_phone}
                                            onChange={(e) => profileForm.setData('parent_phone', e.target.value)}
                                            placeholder="Contoh: 081298765432"
                                            className="border-neutral-200 focus:border-brand"
                                        />
                                    </div>
                                    <InputError message={profileForm.errors.parent_phone} className="mt-1" />
                                    <div className="mt-2 flex items-start gap-2 rounded-sm bg-brand-soft/40 p-3 text-brand-dark text-xs">
                                        <AlertCircle className="size-4 shrink-0 text-brand" />
                                        <span>
                                            Nomor WhatsApp orang tua akan digunakan untuk pengiriman notifikasi otomatis saat absensi siswa tercatat.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3 border-neutral-100 border-t pt-4">
                                <Button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="gap-2 rounded-sm bg-brand px-6 font-semibold text-white shadow-xs hover:bg-brand-dark"
                                >
                                    <Save className="size-4" />
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Data Orang Tua'}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                {/* TAB 3: KEAMANAN & AKUN */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Email & Akun */}
                        <form onSubmit={handleProfileSubmit} className="h-full">
                            <div className="flex h-full flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
                                <div>
                                    <div className="border-neutral-100 border-b pb-4">
                                        <h2 className="font-bold text-brand-text text-lg">Alamat Email Akun</h2>
                                        <p className="mt-0.5 text-brand-muted text-xs">
                                            Email digunakan untuk masuk ke sistem absensi dan pemulihan akun.
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
                                                    placeholder="email@example.com"
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
                                        className="gap-2 rounded-sm bg-brand px-5 font-semibold text-white shadow-xs hover:bg-brand-dark"
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
                                            <Label htmlFor="current_password" className="font-semibold text-brand-text text-sm">
                                                Kata Sandi Saat Ini
                                            </Label>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="current_password"
                                                    type="password"
                                                    value={passwordForm.data.current_password}
                                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                    placeholder="••••••••"
                                                    className="border-neutral-200 focus:border-brand"
                                                    autoComplete="current-password"
                                                />
                                            </div>
                                            <InputError message={passwordForm.errors.current_password} className="mt-1" />
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
                                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                    placeholder="••••••••"
                                                    className="border-neutral-200 focus:border-brand"
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                            <InputError message={passwordForm.errors.password} className="mt-1" />
                                        </div>

                                        <div>
                                            <Label htmlFor="password_confirmation" className="font-semibold text-brand-text text-sm">
                                                Konfirmasi Kata Sandi Baru
                                            </Label>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={passwordForm.data.password_confirmation}
                                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                    placeholder="••••••••"
                                                    className="border-neutral-200 focus:border-brand"
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                            <InputError message={passwordForm.errors.password_confirmation} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end border-neutral-100 border-t pt-4">
                                    <Button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="gap-2 rounded-sm bg-brand px-5 font-semibold text-white shadow-xs hover:bg-brand-dark"
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

SiswaPengaturan.layout = {
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
