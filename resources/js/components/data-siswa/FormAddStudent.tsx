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
import { dataSiswa } from '@/routes/admin';
import type { ClassOption } from '@/types/dashboard';

type FormAddStudentProps = {
    classes: ClassOption[];
    onSuccess: () => void;
};

export default function FormAddStudent({
    classes,
    onSuccess,
}: FormAddStudentProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        nis: '',
        class_id: '',
        gender: '',
        birth_date: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        status: 'active',
    });

    function submit(e: React.SubmitEvent) {
        e.preventDefault();

        post(dataSiswa.url(), {
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
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nama siswa"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="nis">NIS</Label>
                    <Input
                        id="nis"
                        name="nis"
                        value={data.nis}
                        onChange={(e) => setData('nis', e.target.value)}
                        placeholder="Nomor Induk Siswa"
                    />
                    <InputError message={errors.nis} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="password">Password</Label>
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
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <Select
                        value={data.gender}
                        onValueChange={(value) => setData('gender', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.gender} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="class_id">Kelas</Label>
                    <Select
                        value={data.class_id}
                        onValueChange={(value) => setData('class_id', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((classOption) => (
                                <SelectItem
                                    key={classOption.id}
                                    value={String(classOption.id)}
                                >
                                    {classOption.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.class_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="birth_date">Tanggal Lahir</Label>
                    <Input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                    />
                    <InputError message={errors.birth_date} />
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

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Alamat lengkap"
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="parent_name">Nama Orang Tua</Label>
                    <Input
                        id="parent_name"
                        name="parent_name"
                        value={data.parent_name}
                        onChange={(e) => setData('parent_name', e.target.value)}
                        placeholder="Nama ayah/ibu"
                    />
                    <InputError message={errors.parent_name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="parent_phone">No. HP Orang Tua</Label>
                    <Input
                        id="parent_phone"
                        name="parent_phone"
                        value={data.parent_phone}
                        onChange={(e) =>
                            setData('parent_phone', e.target.value)
                        }
                        placeholder="08xxxxxxxxxx"
                    />
                    <InputError message={errors.parent_phone} />
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
                    Simpan Siswa
                </Button>
            </div>
        </form>
    );
}
