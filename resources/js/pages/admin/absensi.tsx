import { Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import { absensi } from '@/routes/admin';

export default function Absensi() {
    return (
        <>
            <Head title="Absensi" />
            <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft">
                    <ClipboardList className="size-8 text-brand-dark" />
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-brand-text">
                        Absensi
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-brand-muted">
                        Halaman rekap kehadiran siswa dan guru akan segera
                        hadir. Modul ini merupakan bagian dari Fase 2
                        pengembangan.
                    </p>
                </div>
            </div>
        </>
    );
}

Absensi.layout = {
    breadcrumbs: [
        {
            title: 'Absensi',
            href: absensi(),
        },
    ],
};
