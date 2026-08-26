export default function CallToAction() {
    return (
        <section className="relative overflow-hidden bg-brand-dark">
            <div className="absolute -top-16 -right-10 size-56 rounded-full border-[18px] border-white/10" />
            <div className="absolute -bottom-20 -left-16 size-64 rounded-3xl bg-brand-warm/15" />
            <div className="relative mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-28">
                <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-brand-soft uppercase">
                    Mulai Bersama Lantaburo
                </p>
                <h2 className="font-bold text-white text-3xl leading-tight sm:text-5xl">
                    Pendidikan terbaik untuk anak Anda dimulai dari percakapan kecil
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-brand-soft">
                    Konsultasikan kebutuhan belajar putra-putri Anda bersama tim
                    Lantaburo. Kami siap mendengar dan menemukan cara belajar yang
                    paling tepat.
                </p>
                <a
                    href="#kontak"
                    className="mt-10 inline-block rounded-xl bg-white px-8 py-4 text-sm font-bold text-brand transition-colors hover:bg-brand-soft"
                >
                    Hubungi Kami
                </a>
            </div>
        </section>
    );
}