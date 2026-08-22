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

type FormAddAnnouncementProps = {
    onSuccess: () => void;
};

export default function FormAddAnnouncement({ onSuccess }: FormAddAnnouncementProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        target_role: 'all',
        published_at: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(PengumumanController.store.url(), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="title">
                    Judul <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    name="title"
                    className="text-black"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Judul pengumuman"
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="content">
                    Isi Pengumuman <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="content"
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
                    <Label htmlFor="target_role">
                        Target Penerima <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.target_role}
                        onValueChange={(value) => setData('target_role', value)}
                    >
                        <SelectTrigger id="target_role" className="w-full text-black">
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
                    <Label htmlFor="published_at">Tanggal Publish</Label>
                    <Input
                        id="published_at"
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
                    Simpan Pengumuman
                </Button>
            </div>
        </form>
    );
}
