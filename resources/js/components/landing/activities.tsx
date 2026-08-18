import activitiesOne from '../../../images/thumbnail.jpeg';
import activitiesLarge from '../../../images/thumbnail.jpg';
import activitiesTwo from '../../../images/thumbnail2.jpeg';

const gallery = [
    {
        src: activitiesLarge,
        caption: 'Belajar lewat pengalaman nyata',
        alt: 'Siswa Lantaburo mengikuti kegiatan belajar langsung',
        span: 'lg:col-span-2 lg:row-span-2',
    },
    {
        src: activitiesOne,
        caption: 'Eksplorasi minat dan bakat',
        alt: 'Kegiatan eksplorasi minat siswa',
        span: '',
    },
    {
        src: activitiesTwo,
        caption: 'Kolaborasi dalam kelompok kecil',
        alt: 'Siswa berkolaborasi dalam kelompok kecil',
        span: '',
    },
];

export default function Activities() {
    return (
        <section id="aktivitas" className="bg-brand">
            <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
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
                    {gallery.map((item) => (
                        <figure
                            key={item.caption}
                            className={`group relative overflow-hidden rounded-2xl ${item.span}`}
                        >
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="aspect-4/3 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-dark/80 to-transparent p-4 pt-12 text-sm font-medium text-white">
                                {item.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}