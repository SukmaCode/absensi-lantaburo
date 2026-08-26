import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Megaphone,
    Plus,
    Search,
    AlertTriangle,
} from 'lucide-react';
import { FaUsers } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { pengumuman } from '@/routes/admin';
import type { Pagination } from '@/types/dashboard';
import FormAddAnnouncement from '@/components/pengumuman/FormAddAnnouncement';
import FormEditAnnouncement from '@/components/pengumuman/FormEditAnnouncement';
import PengumumanController from '@/actions/App/Http/Controllers/Admin/PengumumanController';

interface AnnouncementRow {
    id: number;
    title: string;
    content: string;
    target_role: string;
    published_at: string | null;
    created_at: string | null;
    creator_name: string | null;
}

const TARGET_ROLE_CONFIG: Record<
    string,
    { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
    all: {
        label: 'Semua',
        icon: FaUsers,
        className: 'bg-blue-50 text-blue-700',
    },
    guru: {
        label: 'Guru',
        icon: GiTeacher,
        className: 'bg-purple-50 text-purple-700',
    },
    siswa: {
        label: 'Siswa',
        icon: PiStudentFill,
        className: 'bg-amber-50 text-amber-700',
    },
};

function formatDateTime(dateString: string | null): string {
    if (!dateString) {
        return '-';
    }
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Pengumuman({
    announcements,
    pagination,
}: {
    announcements: AnnouncementRow[];
    pagination: Pagination;
}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [editTarget, setEditTarget] = useState<AnnouncementRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AnnouncementRow | null>(null);
    const [search, setSearch] = useState('');

    const filteredAnnouncements = announcements.filter(
        (a) =>
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.content.toLowerCase().includes(search.toLowerCase()),
    );

    function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(PengumumanController.destroy.url(deleteTarget.id), {
            onFinish: () => setDeleteTarget(null),
        });
    }

    return (
        <>
            <Head title="Pengumuman" />
            <div className="flex flex-1 flex-col border border-neutral-100 bg-white p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-semibold text-base text-brand-text">Pengumuman</h2>
                        <p className="mt-0.5 text-sm text-brand-muted">
                            Kelola pengumuman sekolah untuk guru dan siswa
                        </p>
                    </div>
                    <Button
                        onClick={() => setOpenAdd(true)}
                        className="h-10 bg-brand px-5 text-white hover:bg-brand-dark"
                    >
                        <Plus className="size-4" />
                        Tambah Pengumuman
                    </Button>
                </div>

                {/* Search */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                        <Input
                            type="search"
                            placeholder="Cari judul atau isi pengumuman..."
                            className="border border-neutral-200 bg-white pl-9 text-black focus-visible:border-2 focus-visible:border-brand"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                    {filteredAnnouncements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft">
                                <Megaphone className="size-7 text-brand-dark" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-brand-text">
                                    {search ? 'Tidak ada hasil' : 'Belum ada pengumuman'}
                                </p>
                                <p className="mt-1 text-xs text-brand-muted">
                                    {search
                                        ? 'Coba kata kunci yang berbeda.'
                                        : 'Klik "Tambah Pengumuman" untuk membuat pengumuman baru.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                                    <th className="pb-3 font-medium">No</th>
                                    <th className="pb-3 font-medium">Judul</th>
                                    <th className="pb-3 font-medium">Target</th>
                                    <th className="pb-3 font-medium">Dibuat oleh</th>
                                    <th className="pb-3 font-medium">Waktu Publish</th>
                                    <th className="pb-3 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnnouncements.map((announcement, index) => {
                                    const roleConfig =
                                        TARGET_ROLE_CONFIG[announcement.target_role] ??
                                        TARGET_ROLE_CONFIG.all;
                                    const RoleIcon = roleConfig.icon;

                                    return (
                                        <tr
                                            key={announcement.id}
                                            className="border-b border-neutral-50 last:border-0"
                                        >
                                            <td className="py-3 text-brand-muted tabular-nums">
                                                {pagination.per_page *
                                                    (pagination.current_page - 1) +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="max-w-xs py-3">
                                                <p className="truncate font-medium text-brand-text">
                                                    {announcement.title}
                                                </p>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-brand-muted">
                                                    {announcement.content}
                                                </p>
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-xs',
                                                        roleConfig.className,
                                                    )}
                                                >
                                                    <RoleIcon className="size-3" />
                                                    {roleConfig.label}
                                                </span>
                                            </td>
                                            <td className="py-3 text-brand-muted">
                                                {announcement.creator_name ?? '-'}
                                            </td>
                                            <td className="py-3 text-brand-muted tabular-nums">
                                                {formatDateTime(announcement.published_at)}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-neutral-200 bg-white px-2 text-brand-text hover:bg-brand-soft"
                                                        onClick={() => setEditTarget(announcement)}
                                                    >
                                                        <MdModeEdit className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-neutral-200 bg-white px-2 text-red-500 hover:border-red-200 hover:bg-red-50"
                                                        onClick={() =>
                                                            setDeleteTarget(announcement)
                                                        }
                                                    >
                                                        <MdDelete className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {announcements.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-brand-muted">
                            Menampilkan {pagination.total} pengumuman
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
                )}
            </div>

            {/* Modal: Add Announcement */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-black">Tambah Pengumuman</DialogTitle>
                        <DialogDescription>
                            Isi data pengumuman baru di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <FormAddAnnouncement onSuccess={() => setOpenAdd(false)} />
                </DialogContent>
            </Dialog>

            {/* Modal: Edit Announcement */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-black">Edit Pengumuman</DialogTitle>
                        <DialogDescription>Perbarui data pengumuman di bawah ini.</DialogDescription>
                    </DialogHeader>
                    {editTarget && (
                        <FormEditAnnouncement
                            announcement={editTarget}
                            onSuccess={() => setEditTarget(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Alert: Delete Confirmation */}
            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent className="bg-white sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="size-5 text-red-500" />
                            </div>
                            <DialogTitle className="text-brand-text">Hapus Pengumuman?</DialogTitle>
                        </div>
                        <DialogDescription className="mt-2">
                            Pengumuman &ldquo;{deleteTarget?.title}&rdquo; akan dihapus secara
                            permanen. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            className="border-neutral-200 text-brand-text hover:bg-brand-soft"
                            onClick={() => setDeleteTarget(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
