import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    Plus,
    Search,
    AlertTriangle,
    MapPin,
    Phone,
    User,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { MdModeEdit, MdDelete } from 'react-icons/md';
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
import { event as eventRoute } from '@/routes/admin';
import type { Pagination } from '@/types/dashboard';
import FormAddEvent from '@/components/event/FormAddEvent';
import FormEditEvent, { type EventRow } from '@/components/event/FormEditEvent';
import EventController from '@/actions/App/Http/Controllers/Admin/EventController';

function formatDate(dateString: string | null): string {
    if (!dateString) {
        return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function isUpcoming(dateString: string | null): boolean {
    if (!dateString) return false;
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
}

export default function EventPage({
    events,
    pagination,
    filters,
}: {
    events: EventRow[];
    pagination: Pagination;
    filters?: {
        search?: string;
    };
}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [editTarget, setEditTarget] = useState<EventRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EventRow | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                eventRoute.url({
                    query: searchQuery.trim() ? { search: searchQuery.trim() } : undefined,
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

        router.delete(EventController.destroy.url(deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }

    const goToPage = (page: number) => {
        router.get(
            eventRoute.url({
                query: {
                    page,
                    ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
                },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Agenda Kegiatan" />
            <div className="flex flex-1 flex-col border border-neutral-100 bg-white p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-semibold text-base text-brand-text">Agenda Kegiatan</h2>
                        <p className="mt-0.5 text-sm text-brand-muted">
                            Kelola jadwal dan agenda kegiatan sekolah yang ditampilkan di landing page
                        </p>
                    </div>
                    <Button
                        onClick={() => setOpenAdd(true)}
                        className="h-10 bg-brand px-5 text-white hover:bg-brand-dark cursor-pointer"
                    >
                        <Plus className="size-4" />
                        Tambah Agenda
                    </Button>
                </div>

                {/* Search */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
                        <Input
                            type="search"
                            placeholder="Cari judul kegiatan, lokasi, atau penanggung jawab..."
                            className="border border-neutral-200 bg-white pl-9 text-black focus-visible:border-2 focus-visible:border-brand"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft">
                                <CalendarDays className="size-7 text-brand-dark" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-brand-text">
                                    {searchQuery ? 'Tidak ada hasil kegiatan' : 'Belum ada agenda kegiatan'}
                                </p>
                                <p className="mt-1 text-xs text-brand-muted">
                                    {searchQuery
                                        ? 'Coba kata kunci pencarian yang lain.'
                                        : 'Klik tombol "Tambah Agenda" untuk membuat agenda kegiatan baru.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 text-xs text-brand-muted">
                                    <th className="pb-3 font-medium">No</th>
                                    <th className="pb-3 font-medium">Judul Kegiatan</th>
                                    <th className="pb-3 font-medium">Tanggal</th>
                                    <th className="pb-3 font-medium">Lokasi</th>
                                    <th className="pb-3 font-medium">Kontak</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((eventItem, index) => {
                                    const upcoming = isUpcoming(eventItem.event_date);

                                    return (
                                        <tr
                                            key={eventItem.id}
                                            className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60 transition-colors"
                                        >
                                            <td className="py-3 text-brand-muted tabular-nums">
                                                {pagination.per_page *
                                                    (pagination.current_page - 1) +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="max-w-xs py-3">
                                                <p className="truncate font-medium text-brand-text">
                                                    {eventItem.title}
                                                </p>
                                                {eventItem.description && (
                                                    <p className="mt-0.5 line-clamp-1 text-xs text-brand-muted">
                                                        {eventItem.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 text-brand-text font-medium whitespace-nowrap">
                                                {formatDate(eventItem.event_date)}
                                            </td>
                                            <td className="py-3 text-brand-muted">
                                                {eventItem.location ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="size-3.5 shrink-0 text-brand-muted" />
                                                        <span className="truncate">{eventItem.location}</span>
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="py-3 text-brand-muted">
                                                {eventItem.contact_person || eventItem.phone ? (
                                                    <div className="space-y-0.5 text-xs">
                                                        {eventItem.contact_person && (
                                                            <p className="flex items-center gap-1 text-brand-text">
                                                                <User className="size-3 shrink-0" />
                                                                <span>{eventItem.contact_person}</span>
                                                            </p>
                                                        )}
                                                        {eventItem.phone && (
                                                            <p className="flex items-center gap-1 text-brand-muted">
                                                                <Phone className="size-3 shrink-0" />
                                                                <span>{eventItem.phone}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-md px-2 py-0.5 font-medium text-xs',
                                                        upcoming
                                                            ? 'bg-[#e7f6e0] text-brand'
                                                            : 'bg-neutral-100 text-brand-muted',
                                                    )}
                                                >
                                                    {upcoming ? 'Akan Datang' : 'Selesai'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-neutral-200 bg-white px-2 text-brand-text hover:bg-brand-soft cursor-pointer"
                                                        onClick={() => setEditTarget(eventItem)}
                                                        title="Edit agenda"
                                                    >
                                                        <MdModeEdit className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-neutral-200 bg-white px-2 text-red-500 hover:border-red-200 hover:bg-red-50 cursor-pointer"
                                                        onClick={() => setDeleteTarget(eventItem)}
                                                        title="Hapus agenda"
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
                {events.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-brand-muted">
                            Menampilkan {pagination.total} agenda kegiatan
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
                                    <ChevronLeft className="size-4" />
                                </Button>
                                {pagination.links.map((link, index) => {
                                    const label = link.label
                                        .replaceAll('&laquo;', '«')
                                        .replaceAll('&raquo;', '»');

                                    if (label.includes('Previous') || label.includes('Next')) {
                                        return null;
                                    }

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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => goToPage(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal: Add Event */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-black">Tambah Agenda Kegiatan</DialogTitle>
                        <DialogDescription>
                            Isi detail agenda kegiatan baru yang akan ditampilkan di website sekolah.
                        </DialogDescription>
                    </DialogHeader>
                    <FormAddEvent onSuccess={() => setOpenAdd(false)} />
                </DialogContent>
            </Dialog>

            {/* Modal: Edit Event */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-black">Edit Agenda Kegiatan</DialogTitle>
                        <DialogDescription>
                            Perbarui detail agenda kegiatan di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    {editTarget && (
                        <FormEditEvent
                            event={editTarget}
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
                            <DialogTitle className="text-brand-text">Hapus Agenda Kegiatan?</DialogTitle>
                        </div>
                        <DialogDescription className="mt-2">
                            Agenda &ldquo;{deleteTarget?.title}&rdquo; akan dihapus secara
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

EventPage.layout = {
    breadcrumbs: [
        {
            title: 'Agenda Kegiatan',
            href: eventRoute(),
        },
    ],
};
