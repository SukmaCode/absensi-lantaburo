import type { SchoolProfile } from '@/types/landing';
import heroBgDefault from '../../../images/bg-hero.webp';

interface HeroProps {
    school: SchoolProfile | null;
}

export default function Hero({ school }: HeroProps) {
    const heroImage = school?.hero_image
        ? `/storage/${school.hero_image}`
        : heroBgDefault;

    return (
        <section
            id="beranda"
            className="relative z-10 overflow-hidden bg-brand-bg"
        >
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <img
                    src={heroImage}
                    alt="Hero Background"
                    className="h-full w-full object-cover object-bottom brightness-50"
                />
            </div>

            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16">
                <div>
                    <h1 className="font-bold text-4xl leading-[1.12] text-white sm:text-5xl">
                        {school?.description_heading ?? 'Pendidikan yang personal, mendukung, dan bermakna bagi anak'}
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-white">
                        {school?.description_body ?? `Lantaburo membantu setiap anak tumbuh sesuai potensinya
                        lewat pendekatan belajar yang hangat, inklusif, dan menantang. Kami berjalan bersama orang tua dalam setiap
                        langkah tumbuh kembang putra-putri Anda.`}
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <a
                            href="#tentang"
                            className="rounded-sm bg-brand-dark px-7 py-3.5 font-semibold text-sm text-white transition-colors hover:bg-brand"
                        >
                            Kenali {school?.name}
                        </a>
                        <a
                            href="#kontak"
                            className="rounded-sm border border-brand/30 px-7 py-3.5 font-semibold text-sm text-brand transition-colors hover:border-brand hover:bg-brand-soft"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
