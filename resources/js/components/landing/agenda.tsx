import { CalendarDays, MapPin } from 'lucide-react';

import type { EventItem } from '@/types/landing';

function formatDate(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getWhatsAppUrl(
    phone: string,
    title: string,
    contactPerson?: string | null
): string {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = `62${cleanPhone.slice(1)}`;
    } else if (cleanPhone.startsWith('8')) {
        cleanPhone = `62${cleanPhone}`;
    }

    const greeting = contactPerson ? `Halo ${contactPerson}` : 'Halo Admin';
    const message = `${greeting}, saya ingin bertanya mengenai agenda kegiatan "${title}" di Homeschooling Lantaburo.`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

interface AgendaProps {
    events?: EventItem[];
}

export default function Agenda({ events = [] }: AgendaProps) {
    return (
        <section id='agenda' className="bg-white">
            <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
                <div className="max-w-2xl">
                    <p className="mb-4 font-semibold text-xs tracking-[0.2em] text-brand uppercase">
                        Agenda
                    </p>
                    <h2 className="font-bold text-3xl leading-tight text-brand-text sm:text-4xl">
                        Kegiatan sekolah yang akan datang
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-brand-muted">
                        Jadwal kegiatan terdekat. Simak dan ikuti bersama
                        keluarga Anda.
                    </p>
                </div>

                {events.length > 0 ? (
                    <div className="mt-14 divide-y divide-brand-soft border-y border-brand-soft">
                        {events.map((event) => (
                            <article
                                key={event.id}
                                className="grid gap-4 py-8 lg:grid-cols-[10rem_1fr] lg:gap-10"
                            >
                                <div>
                                    <p className="font-bold text-lg text-brand-text">
                                        {formatDate(event.event_date)}
                                    </p>
                                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-muted">
                                        <MapPin className="size-4" />
                                        {event.location}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl text-brand-text">
                                        {event.title}
                                    </h3>
                                    <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-brand-muted sm:hidden">
                                        <CalendarDays className="mt-0.5 size-4 shrink-0" />
                                        {formatDate(event.event_date)}
                                    </p>
                                    <p className="mt-2 leading-relaxed text-brand-muted">
                                        {event.description}
                                    </p>
                                    {(event.contact_person || event.phone) && (
                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-muted">
                                            {event.contact_person && (
                                                <p>
                                                    Kontak:{' '}
                                                    <span className="font-medium text-brand-text">
                                                        {event.contact_person}
                                                    </span>
                                                </p>
                                            )}
                                            {event.phone && (
                                                <p>
                                                    WhatsApp:{' '}
                                                    <a
                                                        href={getWhatsAppUrl(
                                                            event.phone,
                                                            event.title,
                                                            event.contact_person
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-brand underline underline-offset-2 transition-colors hover:text-brand-dark"
                                                    >
                                                        {event.phone}
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="mt-14 text-brand-muted">
                        Belum ada agenda terdekat. Mohon kembali lagi nanti.
                    </p>
                )}
            </div>
        </section>
    );
}
