import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { dataSiswa } from '@/routes';

export default function DataSiswa() {
    return (
        <>
            <Head title="Data Siswa" />
            <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft">
                    <Users className="size-8 text-brand-dark" />
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-brand-text">
                        Data Siswa
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-brand-muted">
                        Halaman pengelolaan data siswa (tambah, ubah, cari) akan
                        segera hadir. Modul ini merupakan bagian dari Fase 3
                        pengembangan.
                    </p>
                </div>
            </div>
        </>
    );
}

DataSiswa.layout = {
    breadcrumbs: [
        {
            title: 'Data Siswa',
            href: dataSiswa(),
        },
    ],
};
