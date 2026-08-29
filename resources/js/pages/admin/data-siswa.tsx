import { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Filter, Plus, Search, UserRoundCheck } from 'lucide-react';
import { MdModeEdit } from 'react-icons/md';
import FormAddStudent from '@/components/data-siswa/FormAddStudent';
import FormEditStudent from '@/components/data-siswa/FormEditStudent';
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

export interface StudentPreviewRow {
    id: number;
    user_id?: number;
    name: string;
    email?: string;
    phone?: string | null;
    nis: string;
    class_id?: number | string | null;
    class: string | null;
    gender?: 'L' | 'P' | string;
    birth_date?: string | null;
    address?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
    status: 'Aktif' | 'Nonaktif';
    raw_status?: string;
    photo?: string | null;
    payment_status: string | null;
    payment_type: string | null;
}

export default function DataSiswa({
    students,
    pagination,
    classes,
    filters,
}: {
    students: StudentPreviewRow[];
    pagination: StudentPagination;
    classes: ClassOption[];
    filters?: { search?: string };
}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [editTarget, setEditTarget] = useState<StudentPreviewRow | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                dataSiswa.url({
                    query: searchQuery.trim() ? { search: searchQuery } : undefined,
                }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const goToPage = (page: number) => {
        router.get(
            dataSiswa.url({
                query: {
                    page,
                    ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
                },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const maxButtons = 10;
    const startPage =
        Math.floor((pagination.current_page - 1) / maxButtons) * maxButtons + 1;
    const endPage = Math.min(startPage + maxButtons - 1, pagination.last_page);
    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i,
    );

    return (
        <>
            <Head title="Data Siswa" />
            <div className="flex flex-1 flex-col border border-neutral-100 bg-white p-4 sm:p-6">
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
                        onClick={() => setOpenAdd(true)}
                        className="h-10 bg-brand px-5 text-white hover:bg-brand-dark cursor-pointer"
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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

                <div className="mt-4 max-h-[60vh] overflow-auto custom-scrollbar">
                    <table className="w-full min-w-130 text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-white shadow-xs">
                            <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                                <th className="pb-3 min-w-12 font-medium bg-white">No</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">Nama</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">NIS</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">Orang tua</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">Kelas</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">Status</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">Status Pembayaran</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">Tipe Pembayaran</th>
                                <th className="pb-3 min-w-36 font-medium bg-white">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student, index) => {
                                    const {
                                        id,
                                        name,
                                        nis,
                                        parent_name: parentName,
                                        class: classLabel,
                                        status,
                                        payment_status: paymentStatus,
                                        payment_type: paymentType,
                                    } = student;

                                    return (
                                        <tr
                                            key={id}
                                            className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors"
                                        >
                                            <td className="py-3 text-brand-muted tabular-nums">
                                                {pagination.per_page *
                                                    (pagination.current_page - 1) +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
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
                                                    {parentName ?? '—'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span className="rounded-md bg-brand-soft px-2 py-0.5 font-medium text-xs text-brand-dark">
                                                    {classLabel ?? 'Belum ada kelas'}
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
                                            <td className="py-3">
                                                {paymentStatus ? (
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center rounded-md px-2 py-0.5 font-medium text-xs uppercase',
                                                            paymentStatus === 'settlement' ||
                                                                paymentStatus === 'success' ||
                                                                paymentStatus === 'capture'
                                                                ? 'bg-[#e7f6e0] text-brand'
                                                                : paymentStatus === 'pending'
                                                                    ? 'bg-yellow-50 text-yellow-600'
                                                                    : 'bg-red-50 text-red-500',
                                                        )}
                                                    >
                                                        {paymentStatus}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-brand-muted">—</span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span className="text-xs text-brand-muted uppercase">
                                                    {paymentType ?? '—'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    title="Edit Siswa"
                                                    onClick={() => setEditTarget(student)}
                                                    className="h-8 border-neutral-200 bg-white px-2.5 text-brand-text hover:bg-neutral-100 hover:text-brand-dark hover:border-brand cursor-pointer"
                                                >
                                                    <MdModeEdit className="size-3.5 mr-1" />
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-sm text-brand-muted"
                                    >
                                        Tidak ada data siswa ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-brand-muted">
                        Menampilkan {pagination.total} siswa
                    </p>
                    {pagination.last_page > 1 && (
                        <div className="flex flex-wrap items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    goToPage(pagination.current_page - 1)
                                }
                                disabled={pagination.current_page === 1}
                                className="border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            {pages.map((pageNumber) => (
                                <Button
                                    key={pageNumber}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(pageNumber)}
                                    className={cn(
                                        'border-neutral-200 bg-white text-brand-text hover:bg-brand-soft',
                                        pageNumber === pagination.current_page &&
                                            'border-brand bg-brand text-white hover:bg-brand-dark',
                                    )}
                                >
                                    {pageNumber}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    goToPage(pagination.current_page + 1)
                                }
                                disabled={
                                    pagination.current_page ===
                                    pagination.last_page
                                }
                                className="border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Modal Tambah Siswa */}
                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-white text-black custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle className="text-black">Tambah Siswa</DialogTitle>
                            <DialogDescription>
                                Isi data siswa baru di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <FormAddStudent
                            classes={classes}
                            onSuccess={() => setOpenAdd(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Modal Edit Siswa */}
                <Dialog
                    open={!!editTarget}
                    onOpenChange={(isOpen) => !isOpen && setEditTarget(null)}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-white text-black custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle className="text-black">Edit Data Siswa</DialogTitle>
                            <DialogDescription>
                                Perbarui data lengkap siswa di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        {editTarget && (
                            <FormEditStudent
                                student={editTarget}
                                classes={classes}
                                onSuccess={() => setEditTarget(null)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
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
