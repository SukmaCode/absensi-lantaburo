import { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Building2,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    School,
    Upload,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SchoolProfileController from '@/actions/App/Http/Controllers/Admin/SchoolProfileController';
import { schoolProfile } from '@/routes/admin';

interface SchoolProfile {
    id: number;
    name: string | null;
    logo: string | null;
    description_heading: string | null;
    description_body: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
}

export default function PengaturanSekolah({ schoolProfile: profile }: { schoolProfile: SchoolProfile }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        profile.logo ? `/storage/${profile.logo}` : null,
    );

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        _method: 'put' as const,
        name: profile.name ?? '',
        logo: null as File | null,
        description_heading: profile.description_heading ?? '',
        description_body: profile.description_body ?? '',
        address: profile.address ?? '',
        phone: profile.phone ?? '',
        email: profile.email ?? '',
    });

    function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(SchoolProfileController.update.url(profile.id), {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title="Pengaturan Sekolah" />

            <div className="flex flex-1 flex-col border border-neutral-100 bg-white p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-base text-brand-text">Pengaturan Sekolah</h2>
                    <p className="text-sm text-brand-muted">
                        Perbarui informasi dan identitas sekolah yang ditampilkan di sistem.
                    </p>
                </div>

                {recentlySuccessful && (
                    <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        Profil sekolah berhasil diperbarui.
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-6">
                    {/* Logo */}
                    <div className="grid gap-2">
                        <Label>Logo Sekolah</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo sekolah"
                                        className="size-full object-contain p-1"
                                    />
                                ) : (
                                    <School className="size-8 text-neutral-300" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="size-4" />
                                    Pilih Logo
                                </Button>
                                <p className="text-xs text-brand-muted">
                                    Format: JPG, PNG, GIF. Maks 2 MB.
                                </p>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            id="logo"
                            name="logo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                        />
                        <InputError message={errors.logo} />
                    </div>

                    {/* Nama Sekolah */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Nama Sekolah 
                        </Label>
                        <div className="relative">
                            <Building2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                            <Input
                                id="name"
                                name="name"
                                className="pl-9 text-black"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama lengkap sekolah"
                            />
                        </div>
                        <InputError message={errors.name} />
                    </div>

                    {/* Deskripsi */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="description_heading">
                                Deskripsi Singkat 
                            </Label>
                            <Input
                                id="description_heading"
                                name="description_heading"
                                className="text-black"
                                value={data.description_heading}
                                onChange={(e) => setData('description_heading', e.target.value)}
                                placeholder="Tagline atau deskripsi pendek sekolah"
                            />
                            <InputError message={errors.description_heading} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Email 
                            </Label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="pl-9 text-black"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@sekolah.sch.id"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description_body">
                            Deskripsi Lengkap 
                        </Label>
                        <Textarea
                            id="description_body"
                            name="description_body"
                            rows={1}
                            className="resize-none text-black h-40"
                            value={data.description_body}
                            onChange={(e) => setData('description_body', e.target.value)}
                            placeholder="Deskripsi lengkap tentang sekolah..."
                        />
                        <InputError message={errors.description_body} />
                    </div>

                    {/* Kontak */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">
                                Nomor Telepon 
                            </Label>
                            <div className="relative">
                                <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className="pl-9 text-black"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="021-xxxxxxx"
                                />
                            </div>
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">
                                Alamat 
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute top-3 left-3 size-4 text-brand-muted" />
                                <Textarea
                                    id="address"
                                    name="address"
                                    rows={1}
                                    className="resize-none pl-9 text-black"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Alamat lengkap sekolah"
                                />
                            </div>
                            <InputError message={errors.address} />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end border-t border-neutral-100 pt-4">
                        <Button
                            type="submit"
                            className="bg-brand px-6 text-white hover:bg-brand-dark"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

PengaturanSekolah.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Sekolah',
            href: schoolProfile(),
        },
    ],
};
