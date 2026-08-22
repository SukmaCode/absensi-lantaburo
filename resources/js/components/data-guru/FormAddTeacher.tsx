import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
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
import { dataGuru } from '@/routes/admin';

type FormAddTeacherProps = {
    onSuccess: () => void;
};

export default function FormAddTeacher({ onSuccess }: FormAddTeacherProps) {
    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            name: '',
            email: '',
            password: '',
            phone: '',
            nip: '',
            subject: '',
            status: 'active',
        });

    function submit(e: React.SubmitEvent) {
        e.preventDefault();

        post(dataGuru.url(), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="name">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
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
                    <Label htmlFor="nis">
                        NIP <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nis"
                        name="nis"
                        value={data.nip}
                        onChange={(e) => setData('nip', e.target.value)}
                        placeholder="Nomor Induk Pegawai"
                    />
                    <InputError message={errors.nip} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Minimal 8 karakter"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">No. HP</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="subject">Mata Pelajaran</Label>
                    <Input
                        id="subject"
                        name="subject"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        placeholder="Mata pelajaran"
                    />
                    <InputError message={errors.subject} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value)}
                    >
                        <SelectTrigger className="w-full text-black">
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
                    className="bg-brand text-white hover:bg-brand-dark"
                    disabled={processing}
                >
                    {processing && (
                        <LoaderCircle className="size-4 animate-spin" />
                    )}
                    Simpan Guru
                </Button>
            </div>
        </form>
    );
}
