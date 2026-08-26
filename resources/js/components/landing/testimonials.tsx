import { Quote } from 'lucide-react';

export default function Testimonials() {
    return (
        <section id="testimoni" className="bg-white">
            <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
                <div className="text-center">
                    <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                        Testimoni
                    </p>
                    <h2 className="font-bold text-brand-text text-3xl leading-tight sm:text-4xl">
                        Cerita dari keluarga Lantaburo
                    </h2>
                </div>

                <figure className="mt-12 rounded-2xl border border-brand-soft bg-brand-bg p-8 sm:p-12">
                    <Quote className="size-9 text-brand" />
                    <blockquote className="mt-6 font-medium text-brand-text text-xl leading-relaxed sm:text-2xl">
                        &ldquo;Yang kami rasakan di Lantaburo adalah anak kami diperlakukan
                        sebagai pribadi, bukan angka. Pendamping belajar mendengarkan,
                        memahami, dan merancang cara belajar yang cocok untuknya. Anak
                        kami kini lebih percaya diri dan senang belajar.&rdquo;
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                        <span className="flex size-12 items-center justify-center rounded-full bg-brand font-bold text-white">
                            R
                        </span>
                        <div>
                            <p className="font-semibold text-brand-text">Ratna Dewi</p>
                            <p className="text-sm text-brand-muted">
                                Orang tua siswa Homeschooling Lantaburo
                            </p>
                        </div>
                    </figcaption>
                </figure>
            </div>
        </section>
    );
}