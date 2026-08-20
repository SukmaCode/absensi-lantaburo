import { Head } from '@inertiajs/react';
import { GraduationCap } from 'lucide-react';
import { dataGuru } from '@/routes/admin';

export default function DataGuru() {
    return (
        <>
            <Head title="Data Guru" />
            <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft">
                    <GraduationCap className="size-8 text-brand-dark" />
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-brand-text">
                        Data Guru
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-brand-muted">
                        Halaman pengelolaan data guru dan rekap kehadiran guru
                        akan segera hadir.
                    </p>
                </div>
            </div>
        </>
    );
}

DataGuru.layout = {
    breadcrumbs: [
        {
            title: 'Data Guru',
            href: dataGuru(),
        },
    ],
};
