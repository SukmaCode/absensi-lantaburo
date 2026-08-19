import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { home } from '@/routes';
import heroImage from '../../../images/bg-hero.jpg';
import Logo from '../../../images/logo.png';

export default function AuthSplitLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-svh bg-brand-bg">
            <div className="relative hidden w-[40%] flex-col justify-between overflow-hidden bg-brand-dark p-10 text-white lg:flex">
                <div className="absolute -top-20 -right-16 size-72 rounded-full border-[22px] border-white/5" />
                <div className="absolute top-1/3 -left-14 size-40 rounded-full border-[14px] border-white/5" />
                <div className="absolute -bottom-24 -left-10 size-72 rounded-[2.5rem] border-[22px] border-white/5" />

                <Link
                    href={home()}
                    className="relative z-10 flex items-center gap-3"
                >
                    <span className="flex size-12 items-center justify-center rounded-xl bg-white p-1.5">
                        <img
                            src={Logo}
                            alt="Daarul Quran Lantaburo"
                            className="size-full object-contain"
                        />
                    </span>
                    <span className="font-semibold text-sm text-white">
                        Daarul Quran Lantaburo
                    </span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <h2 className="font-bold text-3xl leading-snug text-white">
                        Belajar dengan cara yang lebih personal dan bermakna.
                    </h2>
                    <p className="mt-4 font-regular text-base leading-relaxed text-white/80">
                        Ruang belajar yang mendukung setiap siswa untuk
                        berkembang sesuai potensi dan kebutuhannya.
                    </p>
                </div>

                <div className="relative z-10 overflow-hidden rounded-2xl">
                    <img
                        src={heroImage}
                        alt="Suasana belajar Homeschooling Lantaburo"
                        className="h-48 w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-brand-dark/30" />
                </div>
            </div>

            <div className="relative flex min-h-svh flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
                <Link
                    href={home()}
                    className="mb-8 flex items-center gap-2.5 lg:hidden"
                >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-brand-soft">
                        <img
                            src={Logo}
                            alt="Daarul Quran Lantaburo"
                            className="size-full object-contain"
                        />
                    </span>
                    <span className="font-semibold text-sm text-brand-dark">
                        Daarul Quran Lantaburo
                    </span>
                </Link>

                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}