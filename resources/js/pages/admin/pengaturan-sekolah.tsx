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
    hero_image: string | null;
    about_image: string | null;
    activities_image_1: string | null;
    activities_image_2: string | null;
    activities_image_3: string | null;
    description_heading: string | null;
    description_body: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
}

export default function PengaturanSekolah({ schoolProfile: profile }: { schoolProfile: SchoolProfile }) {
    const logoInputRef = useRef<HTMLInputElement>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const aboutInputRef = useRef<HTMLInputElement>(null);
    const activities1InputRef = useRef<HTMLInputElement>(null);
    const activities2InputRef = useRef<HTMLInputElement>(null);
    const activities3InputRef = useRef<HTMLInputElement>(null);

    const [logoPreview, setLogoPreview] = useState<string | null>(
        profile.logo ? `/storage/${profile.logo}` : null,
    );
    const [heroPreview, setHeroPreview] = useState<string | null>(
        profile.hero_image ? `/storage/${profile.hero_image}` : null,
    );
    const [aboutPreview, setAboutPreview] = useState<string | null>(
        profile.about_image ? `/storage/${profile.about_image}` : null,
    );
    const [activities1Preview, setActivities1Preview] = useState<string | null>(
        profile.activities_image_1 ? `/storage/${profile.activities_image_1}` : null,
    );
    const [activities2Preview, setActivities2Preview] = useState<string | null>(
        profile.activities_image_2 ? `/storage/${profile.activities_image_2}` : null,
    );
    const [activities3Preview, setActivities3Preview] = useState<string | null>(
        profile.activities_image_3 ? `/storage/${profile.activities_image_3}` : null,
    );

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        _method: 'put' as const,
        name: profile.name ?? '',
        logo: null as File | null,
        hero_image: null as File | null,
        about_image: null as File | null,
        activities_image_1: null as File | null,
        activities_image_2: null as File | null,
        activities_image_3: null as File | null,
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

    function handleHeroChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('hero_image', file);
        if (file) {
            setHeroPreview(URL.createObjectURL(file));
        }
    }

    function handleAboutChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('about_image', file);
        if (file) {
            setAboutPreview(URL.createObjectURL(file));
        }
    }

    function handleActivities1Change(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('activities_image_1', file);
        if (file) {
            setActivities1Preview(URL.createObjectURL(file));
        }
    }

    function handleActivities2Change(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('activities_image_2', file);
        if (file) {
            setActivities2Preview(URL.createObjectURL(file));
        }
    }

    function handleActivities3Change(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('activities_image_3', file);
        if (file) {
            setActivities3Preview(URL.createObjectURL(file));
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
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
                                        onClick={() => logoInputRef.current?.click()}
                                    >
                                        <Upload className="size-4" />
                                        Pilih Logo
                                    </Button>
                                    <p className="text-xs text-brand-muted">
                                        Format: JPG, PNG, GIF. Maks 2 MB.
                                    </p>
                                </div>
                                <InputError message={errors.logo} />
                            </div>
                            <input
                                ref={logoInputRef}
                                id="logo"
                                name="logo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoChange}
                            />
                            <InputError message={errors.logo} />
                        </div>
                        <div>
                            <Label htmlFor="hero_image">Hero Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                                    {heroPreview ? (
                                        <img
                                            src={heroPreview}
                                            alt="Hero image"
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
                                        onClick={() => heroInputRef.current?.click()}
                                    >
                                        <Upload className="size-4" />
                                        Pilih Hero Image
                                    </Button>
                                    <p className="text-xs text-brand-muted">
                                        Format: JPG, PNG, GIF. Maks 2 MB.
                                    </p>
                                </div>
                                <InputError message={errors.hero_image} />
                            </div>
                            <input
                                ref={heroInputRef}
                                id="hero_image"
                                name="hero_image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleHeroChange}
                            />
                            <InputError message={errors.hero_image} />
                        </div>
                        <div>
                            <Label htmlFor="about_image">About Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                                    {aboutPreview ? (
                                        <img
                                            src={aboutPreview}
                                            alt="About image"
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
                                        onClick={() => aboutInputRef.current?.click()}
                                    >
                                        <Upload className="size-4" />
                                        Pilih About Image
                                    </Button>
                                    <p className="text-xs text-brand-muted">
                                        Format: JPG, PNG, GIF. Maks 2 MB.
                                    </p>
                                </div>
                                <InputError message={errors.about_image} />
                            </div>
                            <input
                                ref={aboutInputRef}
                                id="about_image"
                                name="about_image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAboutChange}
                            />
                            <InputError message={errors.about_image} />
                        </div>
                        <div>
                            <Label htmlFor="activity_image_1">Activity Image 1</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                                    {activities1Preview ? (
                                        <img
                                            src={activities1Preview}
                                            alt="Activity image 1"
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
                                        onClick={() => activities1InputRef.current?.click()}
                                    >
                                        <Upload className="size-4" />
                                        Pilih Activity Image 1
                                    </Button>
                                    <p className="text-xs text-brand-muted">
                                        Format: JPG, PNG, GIF. Maks 2 MB.
                                    </p>
                                </div>
                                <InputError message={errors.activities_image_1} />
                            </div>
                            <input
                                ref={activities1InputRef}
                                id="activities_image_1"
                                name="activities_image_1"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleActivities1Change}
                            />
                            <InputError message={errors.activities_image_1} />
                        </div>
                        <div>
                            <Label htmlFor="activity_image_2">Activity Image 2</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                                    {activities2Preview ? (
                                        <img
                                            src={activities2Preview}
                                            alt="Activity image 2"
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
                                        onClick={() => activities2InputRef.current?.click()}
                                    >
                                        <Upload className="size-4" />
                                        Pilih Activity Image 2
                                    </Button>
                                    <p className="text-xs text-brand-muted">
                                        Format: JPG, PNG, GIF. Maks 2 MB.
                                    </p>
                                </div>
                                <InputError message={errors.activities_image_2} />
                            </div>
                            <input
                                ref={activities2InputRef}
                                id="activities_image_2"
                                name="activities_image_2"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleActivities2Change}
                            />
                            <InputError message={errors.activities_image_2} />
                        </div>
                        <div>
                            <Label htmlFor="activity_image_3">Activity Image 3</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                                    {activities3Preview ? (
                                        <img
                                            src={activities3Preview}
                                            alt="Activity image 3"
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
                                        onClick={() => activities3InputRef.current?.click()}
                                    >
                                        <Upload className="size-4" />
                                        Pilih Activity Image 3
                                    </Button>
                                    <p className="text-xs text-brand-muted">
                                        Format: JPG, PNG, GIF. Maks 2 MB.
                                    </p>
                                </div>
                                <InputError message={errors.activities_image_3} />
                            </div>
                            <input
                                ref={activities3InputRef}
                                id="activities_image_3"
                                name="activities_image_3"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleActivities3Change}
                            />
                            <InputError message={errors.activities_image_3} />
                        </div>
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
                </form >
            </div >
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
