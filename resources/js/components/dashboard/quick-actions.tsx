import { Link } from '@inertiajs/react';
import { ArrowRight, Megaphone, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { absensi, dataSiswa, pengumuman } from '@/routes';

export function QuickActions() {
    return (
        <div>
            <h2 className="font-semibold text-base text-brand-text">
                Quick Actions
            </h2>

            <div className="mt-4 flex flex-col gap-3">
                <Button
                    asChild
                    className="h-11 justify-between bg-brand px-5 text-white hover:bg-brand-dark"
                >
                    <Link href={dataSiswa()} prefetch>
                        <span className="flex items-center gap-2">
                            <UserPlus className="size-4" />
                            Tambah Siswa
                        </span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    className="h-11 justify-between border-neutral-200 bg-white px-5 text-brand-text hover:bg-brand-soft"
                >
                    <Link href={pengumuman()} prefetch>
                        <span className="flex items-center gap-2">
                            <Megaphone className="size-4 text-brand-muted" />
                            Buat Pengumuman
                        </span>
                        <ArrowRight className="size-4 text-brand-muted" />
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    className="h-11 justify-between border-neutral-200 bg-white px-5 text-brand-text hover:bg-brand-soft"
                >
                    <Link href={absensi()} prefetch>
                        <span className="flex items-center gap-2">
                            <ArrowRight className="size-4 rotate-180 text-brand-muted" />
                            Lihat Semua Absensi
                        </span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
