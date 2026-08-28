import activitiesOne from '../../../images/thumbnail.webp';
import activitiesLarge from '../../../images/thumbnail3.webp';
import activitiesTwo from '../../../images/thumbnail2.webp';
import type { SchoolProfile } from '@/types/landing';

interface ActivitiesProps {
    school: SchoolProfile | null;
}

export default function Activities({ school }: ActivitiesProps) {
    const images = [
        {
            src: school?.activities_image_1
                ? `/storage/${school.activities_image_1}`
                : activitiesLarge,
            caption: 'Belajar lewat pengalaman nyata',
            alt: 'Siswa Lantaburo mengikuti kegiatan belajar langsung',
            span: 'lg:col-span-2 lg:row-span-2',
        },
        {
            src: school?.activities_image_2
                ? `/storage/${school.activities_image_2}`
                : activitiesOne,
            caption: 'Eksplorasi minat dan bakat',
            alt: 'Kegiatan eksplorasi minat siswa',
            span: '',
        },
        {
            src: school?.activities_image_3
                ? `/storage/${school.activities_image_3}`
                : activitiesTwo,
            caption: 'Kolaborasi dalam kelompok kecil',
            alt: 'Siswa berkolaborasi dalam kelompok kecil',
            span: '',
        },
    ];

    return (
        <section id="aktivitas" className="bg-brand-dark">
            <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <div className="max-w-2xl">
                    <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-soft uppercase">
                        Aktivitas
                    </p>
                    <h2 className="font-bold text-white text-3xl leading-tight sm:text-4xl">
                        Hari-hari yang diisi dengan rasa ingin tahu
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-brand-soft">
                        Berbagai kegiatan nyata yang menumbuhkan kolaborasi, kreativitas,
                        dan keberanian.
                    </p>
                </div>

                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
                    {images.map((item) => (
                        <figure
                            key={item.caption}
                            className={`group relative overflow-hidden rounded-2xl ${item.span}`}
                        >
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="aspect-4/3 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}