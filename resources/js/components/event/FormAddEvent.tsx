import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import EventController from '@/actions/App/Http/Controllers/Admin/EventController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type FormAddEventProps = {
    onSuccess: () => void;
};

export default function FormAddEvent({ onSuccess }: FormAddEventProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        event_date: '',
        location: '',
        contact_person: '',
        phone: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(EventController.store.url(), {
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
                    Judul Kegiatan <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    name="title"
                    className="text-black"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Contoh: Open House Homeschooling Lantaburo"
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="event_date">
                        Tanggal Kegiatan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="event_date"
                        name="event_date"
                        type="date"
                        className="text-black"
                        value={data.event_date}
                        onChange={(e) => setData('event_date', e.target.value)}
                    />
                    <InputError message={errors.event_date} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <Input
                        id="location"
                        name="location"
                        className="text-black"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        placeholder="Contoh: Aula Lantaburo"
                    />
                    <InputError message={errors.location} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="contact_person">Kontak Person</Label>
                    <Input
                        id="contact_person"
                        name="contact_person"
                        className="text-black"
                        value={data.contact_person}
                        onChange={(e) => setData('contact_person', e.target.value)}
                        placeholder="Nama penanggung jawab"
                    />
                    <InputError message={errors.contact_person} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">No. Telepon / WhatsApp</Label>
                    <Input
                        id="phone"
                        name="phone"
                        className="text-black"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Contoh: 081234567890"
                    />
                    <InputError message={errors.phone} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi Kegiatan</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="resize-none text-black"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Tulis deskripsi detail kegiatan di sini..."
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    className="bg-brand text-white hover:bg-brand-dark"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Simpan Agenda
                </Button>
            </div>
        </form>
    );
}
