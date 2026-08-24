const heading = [
    'Pendidikan yang personal, mendukung, dan bermakna bagi anak.',
    'Lantaburo membantu setiap anak tumbuh sesuai potensinya lewat pendekatan belajar yang hangat, inklusif, dan menantang. Kami berjalan bersama orang tua dalam setiap langkah tumbuh kembang putra-putri Anda.',
];

export default function Hero() {
    return (
        <section
            id="beranda"
            className="bgImageHero relative z-10 overflow-hidden bg-brand-bg"
        >
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16">
                <div>
                    {/* <p className="mb-5 font-semibold text-xs tracking-[0.2em] text-brand uppercase">
                        Homeschooling Lantaburo
                    </p> */}
                    <h1 className="font-bold text-4xl leading-[1.12] text-white sm:text-5xl">
                        Pendidikan yang personal, mendukung, dan{' '}
                        <span className="text-brand">bermakna</span> bagi anak.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-white">
                        Lantaburo membantu setiap anak tumbuh sesuai potensinya
                        lewat pendekatan belajar yang hangat, inklusif, dan
                        menantang. Kami berjalan bersama orang tua dalam setiap
                        langkah tumbuh kembang putra-putri Anda.
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <a
                            href="#tentang"
                            className="rounded-md bg-brand-dark px-7 py-3.5 font-semibold text-sm text-white transition-colors hover:bg-brand-dark"
                        >
                            Kenali Lantaburo
                        </a>
                        <a
                            href="#kontak"
                            className="rounded-md border border-brand/30 px-7 py-3.5 font-semibold text-sm text-brand transition-colors hover:border-brand hover:bg-brand-soft"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
