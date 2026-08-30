import { useEffect, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaFilter,
    FaGraduationCap,
    FaMagnifyingGlass,
    FaPlus,
    FaTrash,
    FaUserCheck,
} from 'react-icons/fa6';
import { MdModeEdit } from 'react-icons/md';
import FormAddParent from '@/components/data-orangtua/FormAddParent';
import FormEditParent from '@/components/data-orangtua/FormEditParent';
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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type {
    AdminFlash,
    AvailableStudentOption,
    ParentCredentials,
    ParentPagination,
    ParentPreviewRow,
} from '@/types/admin';

export default function DataOrangTua({
    parents,
    pagination,
    availableStudents,
    filters,
}: {
    parents: ParentPreviewRow[];
    pagination: ParentPagination;
    availableStudents: AvailableStudentOption[];
    filters?: {
        search?: string;
    };
}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [editTarget, setEditTarget] = useState<ParentPreviewRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ParentPreviewRow | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [credential, setCredential] = useState<ParentCredentials | null>(null);
    const [copied, setCopied] = useState(false);
    const isFirstRender = useRef(true);

    const { props } = usePage<{ flash?: AdminFlash }>();
    const flash = props.flash;

    useEffect(() => {
        if (flash?.parent_credentials) {
            setCredential(flash.parent_credentials);
        }
    }, [flash?.parent_credentials]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/admin/data-orangtua',
                searchQuery.trim() ? { search: searchQuery.trim() } : {},
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
        if (!deleteTarget) return;

        setIsDeleting(true);
        router.delete(`/admin/data-orangtua/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    }

    const goToPage = (page: number) => {
        router.get(
            '/admin/data-orangtua',
            {
                page,
                ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
            },
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
            <Head title="Data Orang Tua" />
            <div className="flex flex-1 flex-col border border-neutral-100 bg-white p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-semibold text-base text-brand-text">
                            Data Orang Tua
                        </h2>
                        <p className="mt-0.5 text-sm text-brand-muted">
                            Kelola data akun orang tua dan relasi siswa di sekolah
                        </p>
                    </div>
                    <Button
                        onClick={() => setOpenAdd(true)}
                        className="h-10 bg-brand px-5 text-white hover:bg-brand-dark cursor-pointer"
                    >
                        <FaPlus className="size-4" />
                        Tambah Orang Tua
                    </Button>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <FaMagnifyingGlass className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama orang tua, siswa (anak), email, atau no HP..."
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

                <div className="mt-4 overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-160 text-left text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                                <th className="pb-3 min-w-12 font-medium">No</th>
                                <th className="pb-3 min-w-42 font-medium">Nama Orang Tua</th>
                                <th className="pb-3 min-w-56 font-medium">Nama Siswa</th>
                                <th className="pb-3 min-w-36 font-medium">Email</th>
                                <th className="pb-3 min-w-32 font-medium">No. HP / WA</th>
                                <th className="pb-3 min-w-24 font-medium">Status</th>
                                <th className="pb-3 min-w-24 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parents.length > 0 ? (
                                parents.map((parent, index) => {
                                    const {
                                        id,
                                        name,
                                        email,
                                        phone,
                                        status,
                                        students,
                                    } = parent;

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
                                                <div className="flex items-center gap-2.5">
                                                    <div>
                                                        <p className="font-medium text-brand-text">
                                                            {name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {students && students.length > 0 ? (
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {students.map((student) => (
                                                            <span
                                                                key={student.id}
                                                                className="inline-flex items-center gap-1 rounded-md bg-brand-soft/60 px-2.5 py-1 font-medium text-xs text-brand-dark"
                                                            >
                                                                <FaGraduationCap className="size-3 text-brand" />
                                                                <span>{student.name}</span>
                                                                {student.class && (
                                                                    <span className="text-[10px] text-brand-muted font-normal">
                                                                        ({student.class})
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-brand-muted italic">
                                                        Belum terhubung
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-brand-muted line-clamp-1">
                                                {email}
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
                                                    <FaUserCheck className="size-3" />
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        title="Edit Orang Tua"
                                                        onClick={() => setEditTarget(parent)}
                                                        className="h-8 border-neutral-200 bg-white px-2 text-brand-text hover:bg-neutral-100 cursor-pointer"
                                                    >
                                                        <MdModeEdit className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        title="Hapus Orang Tua"
                                                        onClick={() => setDeleteTarget(parent)}
                                                        className="h-8 border-neutral-200 bg-white px-2 text-red-500 hover:border-red-200 hover:bg-red-50 cursor-pointer"
                                                    >
                                                        <FaTrash className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-brand-muted text-sm"
                                    >
                                        Tidak ada data orang tua yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-brand-muted">
                        Menampilkan {pagination.total} orang tua
                    </p>
                    {pagination.last_page > 1 && (
                        <div className="flex flex-wrap items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(pagination.current_page - 1)}
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
                                onClick={() => goToPage(pagination.current_page + 1)}
                                disabled={
                                    pagination.current_page === pagination.last_page
                                }
                                className="border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                            >
                                <FaChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Dialog Tambah Orang Tua */}
                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-white text-black custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle className="text-black">
                                Tambah Orang Tua
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan informasi data orang tua dan hubungkan dengan siswa (anak).
                            </DialogDescription>
                        </DialogHeader>
                        <FormAddParent
                            availableStudents={availableStudents}
                            onSuccess={() => setOpenAdd(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Dialog Edit Orang Tua */}
                <Dialog
                    open={editTarget !== null}
                    onOpenChange={(isOpen) => !isOpen && setEditTarget(null)}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-white text-black custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle className="text-black">
                                Edit Data Orang Tua
                            </DialogTitle>
                            <DialogDescription>
                                Perbarui data orang tua dan relasi siswa di bawah ini.
                            </DialogDescription>
                        </DialogHeader>
                        {editTarget && (
                            <FormEditParent
                                parent={editTarget}
                                availableStudents={availableStudents}
                                onSuccess={() => setEditTarget(null)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Dialog Hapus Orang Tua */}
                <Dialog
                    open={deleteTarget !== null}
                    onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}
                >
                    <DialogContent className="sm:max-w-md bg-white text-black">
                        <DialogHeader>
                            <DialogTitle className="text-black">
                                Konfirmasi Hapus Orang Tua
                            </DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus data orang tua{' '}
                                <span className="font-semibold text-black">
                                    {deleteTarget?.name}
                                </span>
                                ? Akun pengguna dan relasi siswa ke orang tua ini akan dihapus.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteTarget(null)}
                                disabled={isDeleting}
                                className="bg-white text-black border-neutral-200 hover:bg-brand-soft hover:text-black"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog Kredensial Orang Tua */}
                <Dialog
                    open={credential !== null}
                    onOpenChange={(isOpen) => !isOpen && setCredential(null)}
                >
                    <DialogContent className="sm:max-w-md bg-white text-black">
                        <DialogHeader>
                            <DialogTitle className="text-black">
                                Akun Orang Tua Berhasil Dibuat
                            </DialogTitle>
                            <DialogDescription>
                                Salin kredensial di bawah ini dan kirimkan ke
                                orang tua (mis. melalui WhatsApp).
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-brand-muted">Nama</Label>
                                <p className="text-sm font-medium text-black">
                                    {credential?.name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-brand-muted">
                                    Email / Username
                                </Label>
                                <p className="text-sm font-medium text-black">
                                    {credential?.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-brand-muted">
                                    Password
                                </Label>
                                <p className="text-sm font-medium text-black">
                                    {credential?.password}
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (!credential) return;
                                    const text = `Nama: ${credential.name}\nEmail: ${credential.email}\nPassword: ${credential.password}`;
                                    void navigator.clipboard.writeText(text);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="bg-white text-black hover:bg-brand-soft hover:text-black cursor-pointer border-neutral-200"
                            >
                                {copied ? 'Tersalin!' : 'Salin Kredensial'}
                            </Button>
                            <Button
                                onClick={() => setCredential(null)}
                                className="bg-brand text-white hover:bg-brand-dark cursor-pointer"
                            >
                                Selesai
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

DataOrangTua.layout = {
    breadcrumbs: [
        {
            title: 'Data Orang Tua',
            href: '/admin/data-orangtua',
        },
    ],
};
