import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import DataGuruController from '@/actions/App/Http/Controllers/Admin/DataGuruController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type TeacherEditData = {
    id: number;
    name: string;
    email: string;
    nip: string | null;
    phone: string | null;
    subject: string | null;
    status: 'Aktif' | 'Nonaktif' | string;
    raw_status?: string;
};

type FormEditTeacherProps = {
    teacher: TeacherEditData;
    onSuccess: () => void;
};

export default function FormEditTeacher({
    teacher,
    onSuccess,
}: FormEditTeacherProps) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: teacher.name ?? '',
        email: teacher.email ?? '',
        password: '',
        phone: teacher.phone ?? '',
        nip: teacher.nip ?? '',
        subject: teacher.subject ?? '',
        status: teacher.raw_status ?? (teacher.status === 'Aktif' ? 'active' : 'inactive'),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        put(DataGuruController.update.url(teacher.id), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="edit-name">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-name"
                        name="name"
                        className="text-black"
                        value={data.name}
                        onChange={(e) => {
                            const value = e.target.value;
                            setData('name', value);

                            if (value.length >= 1) {
                                clearErrors('name');
                            }
                        }}
                        placeholder="Nama guru"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-nip">
                        NIP <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-nip"
                        name="nip"
                        className="text-black"
                        value={data.nip}
                        onChange={(e) => setData('nip', e.target.value)}
                        placeholder="Nomor Induk Pegawai"
                    />
                    <InputError message={errors.nip} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-email">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-email"
                        name="email"
                        type="email"
                        className="text-black"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-password">
                        Password <span className="text-xs text-brand-muted font-normal">(Kosongkan jika tidak diubah)</span>
                    </Label>
                    <Input
                        id="edit-password"
                        name="password"
                        type="password"
                        className="text-black"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Minimal 8 karakter baru"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-phone">No. HP</Label>
                    <Input
                        id="edit-phone"
                        name="phone"
                        className="text-black"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-subject">
                        Mata Pelajaran <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-subject"
                        name="subject"
                        className="text-black"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        placeholder="Mata pelajaran"
                    />
                    <InputError message={errors.subject} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value)}
                    >
                        <SelectTrigger id="edit-status" className="w-full text-black">
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    className="bg-brand text-white hover:bg-brand-dark cursor-pointer"
                    disabled={processing}
                >
                    {processing && (
                        <LoaderCircle className="size-4 animate-spin" />
                    )}
                    Simpan Perubahan
                </Button>
            </div>
        </form>
    );
}
