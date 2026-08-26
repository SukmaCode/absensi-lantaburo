import { BookOpen, HeartHandshake, Palette } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

interface Program {
    title: string;
    description: string;
    icon: LucideIcon;
    level: string;
}

const programs: Program[] = [
    {
        title: 'Homeschooling Reguler',
        description:
            'Program utama Lantaburo untuk jenjang SD hingga SMA. Kurikulum terpadu yang dikembangkan bersama keluarga, dengan pendampingan harian, portofolio perkembangan, dan asesmen yang bermakna.',
        icon: BookOpen,
        level: 'SD – SMA',
    },
    {
        title: 'Keterampilan & Seni',
        description:
            'Eksplorasi minat lewat seni, musik, olahraga, dan keterampilan praktis yang melatih kreativitas serta kemandirian.',
        icon: Palette,
        level: 'Semua jenjang',
    },
    {
        title: 'Pendampingan Inklusif',
        description:
            'Dukungan khusus bagi anak dengan kebutuhan belajar beragam, disesuaikan dengan kemampuan dan potensi masing-masing.',
        icon: HeartHandshake,
        level: 'Semua jenjang',
    },
];

export default function Programs() {
    const [featured, ...supporting] = programs;

    return (
        <section id="program" className="bg-white">
            <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <div className="max-w-2xl">
                    <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                        Program
                    </p>
                    <h2 className="font-bold text-brand-text text-3xl leading-tight sm:text-4xl">
                        Program belajar yang fleksibel, bukan seragam
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-brand-muted">
                        Setiap program dirancang bersama orang tua dan disesuaikan dengan
                        kebutuhan anak, bukan sebaliknya.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
                    <div className="rounded-2xl bg-brand-bg p-8 lg:p-10">
                        <div className="flex items-center justify-between gap-4">
                            <span className="flex size-12 items-center justify-center rounded-sm bg-brand text-white">
                                <featured.icon className="size-6" />
                            </span>
                            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                                {featured.level}
                            </span>
                        </div>
                        <h3 className="mt-7 font-bold text-brand-text text-2xl">
                            {featured.title}
                        </h3>
                        <p className="mt-3 leading-relaxed text-brand-muted">
                            {featured.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {supporting.map((program) => (
                            <div
                                key={program.title}
                                className="flex flex-1 gap-5 border border-brand-soft/70 p-7"
                            >
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-brand-soft text-brand">
                                    <program.icon className="size-5" />
                                </span>
                                <div>
                                    <h3 className="font-semibold text-brand-text">
                                        {program.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                                        {program.description}
                                    </p>
                                    <p className="mt-2 text-xs font-semibold text-brand">
                                        {program.level}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}