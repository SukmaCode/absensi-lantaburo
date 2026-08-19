import { Head } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import { pengumuman } from '@/routes';

export default function Pengumuman() {
    return (
        <>
            <Head title="Pengumuman" />
            <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft">
                    <Megaphone className="size-8 text-brand-dark" />
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-brand-text">
                        Pengumuman
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-brand-muted">
                        Halaman pengelolaan pengumuman sekolah akan segera
                        hadir.
                    </p>
                </div>
            </div>
        </>
    );
}

Pengumuman.layout = {
    breadcrumbs: [
        {
            title: 'Pengumuman',
            href: pengumuman(),
        },
    ],
};
