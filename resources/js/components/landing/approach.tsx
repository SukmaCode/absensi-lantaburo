const principles = [
    {
        number: '01',
        title: 'Belajar personal',
        description:
            'Kurikulum dan kecepatan belajar disesuaikan dengan minat serta gaya belajar setiap anak.',
    },
    {
        number: '02',
        title: 'Perkembangan utuh',
        description:
            'Kami memperhatikan bukan hanya nilai, tetapi juga karakter, kemandirian, dan kesejahteraan emosional.',
    },
    {
        number: '03',
        title: 'Aktivitas praktis',
        description:
            'Belajar lewat pengalaman nyata: proyek, eksperimen, dan kegiatan di luar ruangan yang bermakna.',
    },
    {
        number: '04',
        title: 'Lingkungan mendukung',
        description:
            'Suasana yang aman dan hangat, di mana anak berani bertanya, mencoba, dan berkembang.',
    },
];

export default function Approach() {
    return (
        <section className="bg-brand-bg">
            <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:py-28">
                <div>
                    <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                        Pendekatan Belajar
                    </p>
                    <h2 className="font-bold text-brand-text text-3xl leading-tight sm:text-4xl">
                        Cara anak kami belajar, tumbuh, dan percaya diri
                    </h2>
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-brand-muted">
                        Empat prinsip yang menjadi dasar setiap keputusan belajar di
                        Lantaburo.
                    </p>
                </div>

                <div className="divide-y divide-brand-soft border-y border-brand-soft">
                    {principles.map((principle) => (
                        <div key={principle.number} className="grid gap-3 py-7 sm:grid-cols-[3.5rem_1fr]">
                            <span className="font-bold text-brand text-lg">
                                {principle.number}
                            </span>
                            <div>
                                <h3 className="font-semibold text-brand-text text-xl">
                                    {principle.title}
                                </h3>
                                <p className="mt-2 leading-relaxed text-brand-muted">
                                    {principle.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}