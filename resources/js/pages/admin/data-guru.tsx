import { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Filter, Plus, Search, Trash2, UserRoundCheck } from 'lucide-react';
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import DataGuruController from '@/actions/App/Http/Controllers/Admin/DataGuruController';
import FormAddTeacher from '@/components/data-guru/FormAddTeacher';
import FormEditTeacher from '@/components/data-guru/FormEditTeacher';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { dataGuru } from '@/routes/admin';
import type { TeacherPagination } from '@/types/dashboard';

interface TeacherPreviewRow {
    id: number;
    name: string;
    email: string;
    nip: string | null;
    subject: string | null;
    wali_kelas: string | null;
    phone: string | null;
    status: 'Aktif' | 'Nonaktif';
    raw_status?: string;
    avatar: string | null;
}

export default function DataGuru({
    teachers,
    pagination,
    filters
}: {
    teachers: TeacherPreviewRow[];
    pagination: TeacherPagination;
    filters?: {
        search?: string;
    }
}) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [editTarget, setEditTarget] = useState<TeacherPreviewRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<TeacherPreviewRow | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                dataGuru.url({
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

    function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(DataGuruController.destroy.url(deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }

    const goToPage = (page: number) => {
        router.get(
            dataGuru.url({
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
            <Head title="Data Guru" />
            <div className="flex flex-1 flex-col border border-neutral-100 bg-white p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="font-semibold text-base text-brand-text">
                                Data Guru
                            </h2>
                            <p className="mt-0.5 text-sm text-brand-muted">
                                Preview data guru terbaru di sekolah
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        className="h-10 bg-brand px-5 text-white hover:bg-brand-dark cursor-pointer"
                    >
                        <Plus className="size-4" />
                        Tambah Guru
                    </Button>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama, NIP, atau wali kelas..."
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
                                <th className="pb-3 min-w-12 font-medium">No</th>
                                <th className="pb-3 min-w-36 font-medium">Nama</th>
                                <th className="pb-3 min-w-36 font-medium">NIP</th>
                                <th className="pb-3 min-w-36 font-medium">Wali Kelas</th>
                                <th className="pb-3 min-w-36 font-medium">Phone</th>
                                <th className="pb-3 min-w-36 font-medium">Status</th>
                                <th className="pb-3 min-w-36 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.length > 0 ? (
                                teachers.map(
                                    (
                                        teacher,
                                        index,
                                    ) => {
                                        const {
                                            id,
                                            name,
                                            nip,
                                            wali_kelas,
                                            phone,
                                            status,
                                        } = teacher;

                                        return (
                                            <tr
                                                key={id ?? nip ?? name}
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
                                                    {nip ?? '-'}
                                                </td>
                                                <td className="py-3">
                                                    {wali_kelas ? (
                                                        <span className="rounded-md bg-brand-soft px-2 py-0.5 font-medium text-xs text-brand-dark">
                                                            {wali_kelas}
                                                        </span>
                                                    ) : (
                                                        <span className="text-brand-muted">
                                                            Tidak ada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-brand-muted tabular-nums">
                                                    {phone ?? '-'}
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
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            title="Edit guru"
                                                            onClick={() => setEditTarget(teacher)}
                                                            className="h-8 border-neutral-200 bg-white px-2 text-brand-text hover:bg-black   cursor-pointer"
                                                        >
                                                            <MdModeEdit className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            title="Hapus guru"
                                                            onClick={() => setDeleteTarget(teacher)}
                                                            className="h-8 border-neutral-200 bg-white px-2 text-red-500 hover:border-red-200 hover:bg-red-500 cursor-pointer"
                                                        >
                                                            <FaTrash className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-brand-muted text-sm"
                                    >
                                        Tidak ada data guru yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-brand-muted">
                        Menampilkan {pagination.total} guru
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

                {/* Modal Add Teacher */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-black">
                                Tambah Guru
                            </DialogTitle>
                            <DialogDescription>
                                Isi data guru baru di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <FormAddTeacher onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>

                {/* Modal Edit Teacher */}
                <Dialog
                    open={!!editTarget}
                    onOpenChange={(isOpen) => !isOpen && setEditTarget(null)}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-black">
                                Edit Data Guru
                            </DialogTitle>
                            <DialogDescription>
                                Perbarui data guru di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        {editTarget && (
                            <FormEditTeacher
                                teacher={editTarget}
                                onSuccess={() => setEditTarget(null)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Modal Delete Teacher Confirmation */}
                <Dialog
                    open={!!deleteTarget}
                    onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}
                >
                    <DialogContent className="bg-white sm:max-w-md">
                        <DialogHeader>
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                                <div className="flex size-14 items-center justify-center rounded-full bg-red-100">
                                    <Trash2 className="size-7 text-red-600" />
                                </div>
                                <DialogTitle className="text-brand-text font-semibold text-lg">
                                    Hapus Data Guru?
                                </DialogTitle>
                            </div>
                            <DialogDescription className="mt-2 text-center text-sm text-neutral-600">
                                Data guru <strong>{deleteTarget?.name}</strong> akan dihapus secara permanen dari sistem.
                                {deleteTarget?.wali_kelas && (
                                    <span className="mt-3 block text-left rounded-md bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
                                        <strong>Perhatian:</strong> Guru ini terdaftar sebagai wali kelas <strong>{deleteTarget.wali_kelas}</strong>. Relasi wali kelas pada kelas tersebut akan otomatis dilepas.
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 flex flex-row justify-center items-center gap-2">
                            <Button
                                variant="outline"
                                className="w-full border-neutral-200 text-brand-text bg-white hover:bg-neutral-900/10 hover:text-brand-text cursor-pointer"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="w-full bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                            >
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
