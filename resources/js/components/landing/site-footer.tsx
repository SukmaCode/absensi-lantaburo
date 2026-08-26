import type { SchoolProfile } from '@/types/landing';
import Logo from "../../../images/logo.png"

const footerNav = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang', href: '#tentang' },
    { label: 'Program', href: '#program' },
    { label: 'Aktivitas', href: '#aktivitas' },
    { label: 'Testimoni', href: '#testimoni' },
    { label: 'Kontak', href: '#kontak' },
];

interface SiteFooterProps {
    school: SchoolProfile | null;
}

export default function SiteFooter({ school }: SiteFooterProps) {
    return (
        <footer id="kontak" className="bg-brand-text">
            <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
                    <div>
                        <div className="flex items-center gap-2.5">
                            {/* <span className="flex size-8 items-center justify-center rounded-md bg-brand text-white">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 3L2.5 8.5V21H9.5V14H14.5V21H21.5V8.5L12 3Z"
                                        fill="currentColor"
                                    />
                                    <path d="M12 7L8 9V10H16V9L12 7Z" fill="#E0F4FF" />
                                </svg>
                            </span> */}
                            <img src={Logo} alt="Logo" width={40} height={40} />
                            <span className="font-bold text-white">Daarul Quran Lantaburo</span>
                        </div>
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                            {school?.description ??
                                'Lembaga pendidikan alternatif yang menghadirkan pengalaman belajar personal, mendukung, dan bermakna bagi setiap anak.'}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                            Jelajahi
                        </p>
                        <ul className="mt-5 space-y-3">
                            {footerNav.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="text-sm text-white/70 transition-colors hover:text-white"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                            Kontak
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-white/70">
                            {school?.phone ? <li>{school.phone}</li> : null}
                            {school?.email ? <li>{school.email}</li> : null}
                            {school?.address ? <li>{school.address}</li> : null}
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        &copy; {new Date().getFullYear()} Homeschooling Lantaburo. Hak cipta
                        dilindungi.
                    </p>
                    <p>{school?.name ?? 'Homeschooling Lantaburo'}</p>
                </div>
            </div>
        </footer>
    );
}