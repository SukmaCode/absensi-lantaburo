import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { login, register } from '@/routes';
import { dashboard as dashboardAdmin } from '@/routes/admin';
import { dashboard as dashboardGuru } from '@/routes/guru';
import { dashboard as dashboardSiswa } from '@/routes/siswa';
import type { Auth } from '@/types';
import Logo from "../../../images/logo.png"
import { School2Icon } from 'lucide-react';


const navItems = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang', href: '#tentang' },
    { label: 'Program', href: '#program' },
    { label: 'Aktivitas', href: '#aktivitas' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Testimoni', href: '#testimoni' },
    { label: 'Kontak', href: '#kontak' },
];

interface SiteNavProps {
    loggedIn: boolean;
}

export default function SiteNav({ loggedIn }: SiteNavProps) {
    const [open, setOpen] = useState(false);

    const { auth, name, logo, email, address, phone } = usePage<{
        auth: Auth;
        name: string;
        logo: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
    }>().props;

    const role = auth.user?.role;
    const isGuru = role === 'guru' || role === 'teacher';
    const isSiswa = role === 'siswa' || role === 'student';
    const dashboardUrl = isSiswa ? dashboardSiswa() : isGuru ? dashboardGuru() : dashboardAdmin();

    const [logoPreview] = useState<string | null>(
        logo ? `/storage/${logo}` : null,
    );

    const infoItems = [
        { label: phone, key: 'phone', icon: <FaPhoneAlt size={10} color="white" /> },
        {
            label: email,
            key: 'email',
            icon: <MdEmail size={10} color="white" />,
        },
        {
            label: address,
            key: 'address',
            icon: <FaLocationDot size={10} color="white" />,
        },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-brand-soft bg-brand-bg/90 backdrop-blur">
            {/* <div className='w-full py-2 bg-linear-to-r from-brand-dark to-brand flex justify-center'> */}
            <div className="flex w-full justify-center bg-brand-dark py-2">
                <ul className="flex w-full justify-center gap-4">
                    {infoItems.map((item) => (
                        <li
                            className="flex items-center justify-center gap-2 sm:gap-6"
                            key={item.key}
                        >
                            <span className="font-light text-white">
                                {item.icon}
                            </span>
                            <p className="font-regular text-[clamp(0.4rem,2vw,0.8rem)] text-white transition-colors">
                                {item.label}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
                <a href="#beranda" className="flex items-center gap-2.5">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="size-10" />
                    ) : (
                        <School2Icon className="size-10 text-brand-dark" />
                    )}
                    <span className="font-bold text-brand-dark">{name}</span>
                </a>

                <nav className="hidden items-center gap-7 lg:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="font-medium text-sm text-brand-muted transition-colors hover:text-brand-text"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    {loggedIn ? (
                        <Link
                            href={dashboardUrl}
                            className="font-medium text-sm text-brand-muted transition-colors hover:text-brand-text"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="font-medium text-sm text-brand-muted transition-colors hover:text-brand-text"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-sm bg-brand-dark px-6 py-2 text-center font-semibold text-sm text-white hover:bg-brand-dark/80"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="flex size-10 items-center justify-center rounded-md text-brand-text lg:hidden"
                    aria-label={open ? 'Tutup menu' : 'Buka menu'}
                >
                    {open ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </button>
            </div>

            {open ? (
                <div className="border-t border-brand-soft bg-brand-bg px-5 pt-2 pb-5 lg:hidden">
                    <nav className="flex flex-col">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="border-b border-brand-soft/60 py-3 font-medium text-sm text-brand-muted"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                    <div className="mt-4 flex flex-col gap-2.5">
                        {loggedIn ? (
                            <Link
                                href={dashboardUrl}
                                className="rounded-lg bg-brand px-5 py-2.5 text-center font-semibold text-sm text-white"
                            >
                                Buka Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-sm border border-brand/30 px-5 py-2.5 text-center font-semibold text-sm text-brand"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-sm bg-brand-dark px-5 py-2.5 text-center font-semibold text-sm text-white"
                                >
                                    Daftar Akun
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            ) : null}
        </header>
    );
}
