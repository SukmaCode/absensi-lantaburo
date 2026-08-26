import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import EventController from '@/actions/App/Http/Controllers/Admin/EventController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface EventRow {
    id: number;
    title: string;
    description: string | null;
    event_date: string;
    location: string | null;
    contact_person: string | null;
    phone: string | null;
    created_at?: string | null;
}

type FormEditEventProps = {
    event: EventRow;
    onSuccess: () => void;
};

export default function FormEditEvent({ event, onSuccess }: FormEditEventProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: event.title,
        description: event.description ?? '',
        event_date: event.event_date ? event.event_date.substring(0, 10) : '',
        location: event.location ?? '',
        contact_person: event.contact_person ?? '',
        phone: event.phone ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        put(EventController.update.url(event.id), {
            onSuccess: () => {
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="edit-title">
                    Judul Kegiatan <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="edit-title"
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
                    <Label htmlFor="edit-event_date">
                        Tanggal Kegiatan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-event_date"
                        name="event_date"
                        type="date"
                        className="text-black"
                        value={data.event_date}
                        onChange={(e) => setData('event_date', e.target.value)}
                    />
                    <InputError message={errors.event_date} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-location">Lokasi</Label>
                    <Input
                        id="edit-location"
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
                    <Label htmlFor="edit-contact_person">Kontak Person</Label>
                    <Input
                        id="edit-contact_person"
                        name="contact_person"
                        className="text-black"
                        value={data.contact_person}
                        onChange={(e) => setData('contact_person', e.target.value)}
                        placeholder="Nama penanggung jawab"
                    />
                    <InputError message={errors.contact_person} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-phone">No. Telepon / WhatsApp</Label>
                    <Input
                        id="edit-phone"
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
                <Label htmlFor="edit-description">Deskripsi Kegiatan</Label>
                <Textarea
                    id="edit-description"
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
                    Simpan Perubahan
                </Button>
            </div>
        </form>
    );
}
