import { Fragment, useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaFilter,
    FaMagnifyingGlass,
    FaPlus,
    FaSchool,
    FaTrash,
    FaUsers,
} from 'react-icons/fa6';
import FormAddClass from '@/components/data-kelas/FormAddClass';
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
import { dataKelas } from '@/routes/admin';
import type {
    ClassPagination,
    ClassPreviewRow,
    TeacherOption,
} from '@/types/dashboard';
import { FormUpdateClass } from '@/components/data-kelas/FormUpdateClass';

interface DataKelasProps {
    classes: ClassPreviewRow[];
    teachers: TeacherOption[];
    pagination: ClassPagination;
    filters?: {
        search?: string;
    };
}

export default function DataKelas({
    classes,
    teachers,
    pagination,
    filters,
}: DataKelasProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                dataKelas.url({
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

    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: number;
        name: string;
        homeroom_teacher: string;
    } | null>(null);

    function handleDeleteHomeroomTeacher() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/data-kelas/${deleteTarget.id}/wali-kelas`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }

    const goToPage = (page: number) => {
        router.get(
            dataKelas.url({
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
            <Head title="Data Kelas" />
            <div className="flex flex-1 flex-col border border-neutral-100 bg-white p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-semibold text-base text-brand-text">
                            Data Kelas
                        </h2>
                        <p className="mt-0.5 text-sm text-brand-muted">
                            Daftar kelas dan wali kelas di sekolah
                        </p>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        className="h-10 bg-brand px-5 text-white hover:bg-brand-dark cursor-pointer"
                    >
                        <FaPlus className="size-4" />
                        Tambah Kelas
                    </Button>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <FaMagnifyingGlass className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama kelas, tingkat, atau wali kelas..."
                            className="border border-neutral-200 bg-white pl-9 text-black focus-visible:border-2 focus-visible:border-brand"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="h-10 border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                    >
                        <FaFilter className="size-4 text-brand-muted" />
                        Filter
                    </Button>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-130 text-left text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                                <th className="pb-3 font-medium">No</th>
                                <th className="pb-3 font-medium">Nama Kelas</th>
                                <th className="pb-3 font-medium">Tingkat / Jenjang</th>
                                <th className="pb-3 font-medium">Wali Kelas</th>
                                <th className="pb-3 font-medium">Jumlah Siswa</th>
                                <th className="pb-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.length > 0 ? (
                                classes.map(
                                    (
                                        {
                                            id,
                                            name,
                                            grade_level,
                                            homeroom_teacher,
                                            homeroom_teacher_id,
                                            students_count,
                                        },
                                        index,
                                    ) => (
                                        <Fragment key={id}>
                                            <tr
                                                className={cn(
                                                    'border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors',
                                                    editingId === id && 'bg-brand-soft/10',
                                                )}
                                            >
                                                <td className="py-3 text-brand-muted tabular-nums">
                                                    {pagination.per_page *
                                                        (pagination.current_page - 1) +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-soft/80 text-brand">
                                                            <FaSchool className="size-4" />
                                                        </div>
                                                        <span className="font-medium text-brand-text">
                                                            {name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className="rounded-md bg-brand-soft px-2.5 py-0.5 font-medium text-xs text-brand-dark">
                                                        Kelas {grade_level}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {homeroom_teacher ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-brand-text">
                                                                {homeroom_teacher}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Hapus wali kelas"
                                                                onClick={() =>
                                                                    setDeleteTarget({
                                                                        id,
                                                                        name,
                                                                        homeroom_teacher,
                                                                    })
                                                                }
                                                                className="size-6 text-red-500 hover:bg-red-50 hover:text-red-700 rounded p-0 cursor-pointer"
                                                            >
                                                                <FaTrash className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-brand-muted italic">
                                                            Belum ditentukan
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-0.5 font-medium text-xs text-brand-text">
                                                        <FaUsers className="size-3 text-brand-muted" />
                                                        {students_count} Siswa
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setEditingId(editingId === id ? null : id)
                                                        }
                                                        className={cn(
                                                            'h-7 border-neutral-200 px-3 bg-brand rounded-sm text-xs text-white hover:bg-brand-soft hover:text-brand-dark hover:border-brand cursor-pointer',
                                                            editingId === id &&
                                                            'border-brand bg-white text-brand',
                                                        )}
                                                    >
                                                        {editingId === id ? 'Tutup' : 'Edit'}
                                                    </Button>
                                                </td>
                                            </tr>
                                            {editingId === id && (
                                                <FormUpdateClass
                                                    key={`edit-${id}`}
                                                    classData={{
                                                        id,
                                                        name,
                                                        grade_level,
                                                        homeroom_teacher_id,
                                                    }}
                                                    teachers={teachers}
                                                    onCancel={() => setEditingId(null)}
                                                />
                                            )}
                                        </Fragment>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-8 text-center text-brand-muted text-sm"
                                    >
                                        Tidak ada data kelas yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-brand-muted">
                        Menampilkan {pagination.total} kelas
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
                                <FaChevronLeft className="size-4" />
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
                                <FaChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Modal Add Class */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-black">
                                Tambah Kelas
                            </DialogTitle>
                            <DialogDescription>
                                Isi data kelas baru di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        <FormAddClass
                            teachers={teachers}
                            onSuccess={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Modal Delete Homeroom Teacher Confirmation */}
                <Dialog
                    open={!!deleteTarget}
                    onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}
                >
                    <DialogContent className="bg-white sm:max-w-md">
                        <DialogHeader>
                            <div className="flex flex-col items-center justify-center gap-3">
                                <FaTrash className="size-20 text-red-500" />

                                <DialogTitle className="text-brand-text font-semibold">
                                    Hapus Wali Kelas?
                                </DialogTitle>
                            </div>
                            <DialogDescription className="mt-2">
                                Wali kelas <strong>{deleteTarget?.homeroom_teacher}</strong> pada <strong>{deleteTarget?.name}</strong> akan dilepas/dihapus. Tindakan ini tidak akan menghapus data guru dari sistem.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-row justify-center items-center gap-2">
                            <Button
                                variant="outline"
                                className="w-full border-neutral-200 text-brand-text bg-white hover:bg-neutral-900/10 hover:text-brand-text cursor-pointer"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleDeleteHomeroomTeacher}
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

DataKelas.layout = {
    breadcrumbs: [
        {
            title: 'Data Kelas',
            href: dataKelas(),
        },
    ],
};
