import { Link } from '@inertiajs/react';
import { Filter, Plus, Search, UserRoundCheck } from 'lucide-react';
import { useState } from 'react';
import FormAddStudent from '@/components/data-siswa/FormAddStudent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { dataSiswa } from '@/routes/admin';
import type { ClassOption, StudentPagination } from '@/types/dashboard';

interface StudentPreviewRow {
    name: string;
    nis: string;
    class: string | null;
    status: 'Aktif' | 'Nonaktif';
    avatar: string | null;
}

export default function DataSiswa({
    students,
    pagination,
    classes,
}: {
    students: StudentPreviewRow[];
    pagination: StudentPagination;
    classes: ClassOption[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="h-full border border-neutral-100 bg-white p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="font-semibold text-base text-brand-text">
                        Data Siswa
                    </h2>
                    <p className="mt-0.5 text-sm text-brand-muted">
                        Preview data siswa terbaru di sekolah
                    </p>
                </div>
                <Button
                    onClick={() => setOpen(true)}
                    className="h-10 bg-brand px-5 text-white hover:bg-brand-dark"
                >
                    <Plus className="size-4" />
                    Tambah Siswa
                </Button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                    <Input
                        type="search"
                        placeholder="Cari nama, NIS, atau kelas..."
                        className="border border-neutral-200 bg-white pl-9 text-black focus-visible:border-2 focus-visible:border-brand"
                    />
                </div>
                <Button
                    variant="outline"
                    className="h-10 border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                >
                    <Filter className="size-4 text-brand-muted" />
                    Filter
                </Button>
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-130 text-left text-sm">
                    <thead>
                        <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                            <th className="pb-3 font-medium">No</th>
                            <th className="pb-3 font-medium">Nama</th>
                            <th className="pb-3 font-medium">NIS</th>
                            <th className="pb-3 font-medium">Kelas</th>
                            <th className="pb-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(
                            (
                                {
                                    name,
                                    nis,
                                    class: classLabel,
                                    status,
                                    avatar,
                                },
                                index,
                            ) => (
                                <tr
                                    key={nis}
                                    className="border-b border-neutral-50 last:border-0"
                                >
                                    <td className="py-3 text-brand-muted tabular-nums">
                                        {pagination.per_page *
                                            (pagination.current_page - 1) +
                                            index +
                                            1}
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage
                                                    src={avatar ?? undefined}
                                                    alt={name}
                                                />
                                                <AvatarFallback className="bg-brand-soft text-brand-dark">
                                                    {name
                                                        .split(' ')
                                                        .map((part) => part[0])
                                                        .slice(0, 2)
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-brand-text">
                                                {name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-brand-muted tabular-nums">
                                        {nis}
                                    </td>
                                    <td className="py-3">
                                        <span className="rounded-md bg-brand-soft px-2 py-0.5 font-medium text-xs text-brand-dark">
                                            {classLabel}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-xs',
                                                status === 'Aktif'
                                                    ? 'bg-[#e7f6e0] text-brand'
                                                    : 'bg-neutral-100 text-brand-muted',
                                            )}
                                        >
                                            <UserRoundCheck className="size-3" />
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-brand-muted">
                    Menampilkan {pagination.total} siswa
                </p>
                <div className="flex flex-wrap items-center gap-1">
                    {pagination.links.map((link, index) => {
                        const label = link.label
                            .replaceAll('&laquo;', '«')
                            .replaceAll('&raquo;', '»');

                        return link.url ? (
                            <Button
                                key={index}
                                asChild
                                variant="outline"
                                size="sm"
                                className={cn(
                                    'border-neutral-200 bg-white text-brand-text hover:bg-brand-soft',
                                    link.active &&
                                        'border-brand bg-brand text-white hover:bg-brand-dark',
                                )}
                            >
                                <Link href={link.url} preserveScroll>
                                    {label}
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled
                                className="border-neutral-200 bg-white text-brand-muted"
                            >
                                {label}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-white custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className='text-black'>Tambah Siswa</DialogTitle>
                        <DialogDescription>
                            Isi data siswa baru di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <FormAddStudent
                        classes={classes}
                        onSuccess={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
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
