import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PengumumanController from '@/actions/App/Http/Controllers/Admin/PengumumanController';

type AnnouncementRow = {
    id: number;
    title: string;
    content: string;
    target_role: string;
    published_at: string | null;
};

type FormEditAnnouncementProps = {
    announcement: AnnouncementRow;
    onSuccess: () => void;
};

export default function FormEditAnnouncement({ announcement, onSuccess }: FormEditAnnouncementProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title,
        content: announcement.content,
        target_role: announcement.target_role,
        published_at: announcement.published_at
            ? announcement.published_at.slice(0, 16)
            : '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        put(PengumumanController.update.url(announcement.id), {
            onSuccess: () => {
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="edit-title">
                    Judul <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="edit-title"
                    name="title"
                    className="text-black"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Judul pengumuman"
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="edit-content">
                    Isi Pengumuman <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="edit-content"
                    name="content"
                    rows={5}
                    className="resize-none text-black"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    placeholder="Tulis isi pengumuman di sini..."
                />
                <InputError message={errors.content} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="edit-target_role">
                        Target Penerima <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.target_role}
                        onValueChange={(value) => setData('target_role', value)}
                    >
                        <SelectTrigger id="edit-target_role" className="w-full text-black">
                            <SelectValue placeholder="Pilih target" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="guru">Guru</SelectItem>
                            <SelectItem value="siswa">Siswa</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.target_role} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-published_at">Tanggal Publish</Label>
                    <Input
                        id="edit-published_at"
                        name="published_at"
                        type="datetime-local"
                        className="text-black"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                    />
                    <InputError message={errors.published_at} />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    className="bg-brand text-white hover:bg-brand-dark"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Perbarui Pengumuman
                </Button>
            </div>
        </form>
    );
}
