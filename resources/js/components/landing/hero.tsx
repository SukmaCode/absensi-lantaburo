import heroImage from '../../../images/thumbnail2.jpeg';

export default function Hero() {
    return (
        <section
            id="beranda"
            className="relative overflow-hidden bg-brand-bg"
            style={{
                backgroundImage:
                    'linear-gradient(to right, rgba(9,152,232,0.08) 1px, transparent 2px),' +
                    'linear-gradient(to bottom, rgba(9,152,232,0.08) 1px, transparent 2px)',
                backgroundSize: '40px 40px',
            }}
        >
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16">
                <div>
                    <p className="mb-5 font-semibold text-xs tracking-[0.2em] text-brand uppercase">
                        Homeschooling Lantaburo
                    </p>
                    <h1 className="font-bold text-4xl leading-[1.12] text-brand-text sm:text-5xl lg:text-[3.4rem]">
                        Pendidikan yang personal, mendukung, dan{' '}
                        <span className="text-brand">bermakna</span> bagi anak.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-muted">
                        Lantaburo membantu setiap anak tumbuh sesuai potensinya
                        lewat pendekatan belajar yang hangat, inklusif, dan
                        menantang. Kami berjalan bersama orang tua dalam setiap
                        langkah tumbuh kembang putra-putri Anda.
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <a
                            href="#tentang"
                            className="rounded-xl bg-brand px-7 py-3.5 font-semibold text-sm text-white transition-colors hover:bg-brand-dark"
                        >
                            Kenali Lantaburo
                        </a>
                        <a
                            href="#kontak"
                            className="rounded-xl border border-brand/30 px-7 py-3.5 font-semibold text-sm text-brand transition-colors hover:border-brand hover:bg-brand-soft"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -top-6 -right-4 size-28 rounded-full bg-brand/15" />
                    <div className="absolute -bottom-8 -left-6 size-36 rounded-3xl bg-brand-warm/20" />
                    <div className="relative overflow-hidden rounded-2xl border border-brand-soft">
                        <img
                            src={heroImage}
                            alt="Siswa Homeschooling Lantaburo belajar di lingkungan yang hangat"
                            className="aspect-[4/3] w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
