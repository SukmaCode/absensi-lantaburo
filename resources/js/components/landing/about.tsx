import aboutImage from '../../../images/thumbnail.jpeg';
import type { SchoolProfile } from '@/types/landing';

const stats = [
    { value: '1:8', label: 'Rasio pendampingan belajar' },
    { value: '100%', label: 'Program personal per anak' },
    { value: 'SD–SMA', label: 'Jenjang yang didampingi' },
];

interface AboutProps {
    school: SchoolProfile | null;
}

export default function About({ school }: AboutProps) {
    const previewAboutImage = school?.about_image ? `/storage/${school.about_image}` : aboutImage;
    return (
        // <section id="tentang" className="bg-linear-to-r from-brand-dark to-brand">
        <section id="tentang" className="bg-brand-dark">
            <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
                    <div>
                        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-soft uppercase">
                            Tentang {school?.name}
                        </p>
                        <h2 className="font-bold text-white text-3xl leading-tight sm:text-4xl">
                            Tempat belajar yang melihat setiap anak sebagai pribadi yang utuh
                        </h2>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-soft">
                            {school?.name} adalah lembaga pendidikan alternatif
                            yang menghadirkan lingkungan belajar yang suportif, inklusif,
                            dan menarik. Kami merancang pengalaman belajar bersama setiap
                            keluarga, bukan sekadar memindahkan kurikulum ke rumah.
                        </p>
                        <p className="mt-4 max-w-xl leading-relaxed text-brand-soft/80">
                            Setiap anak belajar dengan kecepatan, minat, dan gayanya
                            sendiri. Pendamping belajar kami memastikan tidak ada anak
                            yang tertinggal, dan tidak ada anak yang dianggap sama.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-5 -left-5 size-24 rounded-full border-10 border-brand-soft/20" />
                        <div className="relative overflow-hidden rounded-2xl">
                            {!school?.about_image ? (
                                <img
                                    src={aboutImage}
                                    alt="Suasana kegiatan belajar di Homeschooling Lantaburo"
                                    className="aspect-5/4 w-full object-cover"
                                />
                            ) : (
                                <img
                                    src={previewAboutImage}
                                    alt="Suasana kegiatan belajar di Homeschooling Lantaburo"
                                    className="aspect-5/4 w-full object-cover"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="font-bold text-brand-warm text-3xl sm:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-sm font-medium text-brand-soft">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}