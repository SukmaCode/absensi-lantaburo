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
import { update } from '@/routes/admin/data-siswa';
import type { ClassOption } from '@/types/dashboard';

export type StudentEditData = {
    id: number;
    name: string;
    email?: string;
    phone?: string | null;
    nis: string;
    class_id?: number | string | null;
    class?: string | null;
    gender?: 'L' | 'P' | string;
    birth_date?: string | null;
    address?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
    status: 'Aktif' | 'Nonaktif' | string;
    raw_status?: string;
};

type FormEditStudentProps = {
    student: StudentEditData;
    classes: ClassOption[];
    onSuccess: () => void;
};

export default function FormEditStudent({
    student,
    classes,
    onSuccess,
}: FormEditStudentProps) {
    const initialClassId = student.class_id
        ? String(student.class_id)
        : classes.find((c) => c.name === student.class)?.id
          ? String(classes.find((c) => c.name === student.class)?.id)
          : '';

    const initialBirthDate = student.birth_date
        ? String(student.birth_date).split('T')[0]
        : '';

    const initialStatus =
        student.raw_status ??
        (student.status === 'Aktif' ? 'active' : 'inactive');

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: student.name ?? '',
        nis: student.nis ?? '',
        email: student.email ?? '',
        password: '',
        phone: student.phone ?? '',
        gender: student.gender ?? '',
        class_id: initialClassId,
        birth_date: initialBirthDate,
        status: initialStatus,
        address: student.address ?? '',
        parent_name: student.parent_name ?? '',
        parent_phone: student.parent_phone ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        put(update.url(student.id), {
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
                        value={data.name}
                        onChange={(e) => {
                            setData('name', e.target.value);
                            if (e.target.value.length > 0) {
                                clearErrors('name');
                            }
                        }}
                        placeholder="Nama siswa"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-nis">
                        NIS <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-nis"
                        name="nis"
                        value={data.nis}
                        onChange={(e) => {
                            setData('nis', e.target.value);
                            if (e.target.value.length > 0) {
                                clearErrors('nis');
                            }
                        }}
                        placeholder="Nomor Induk Siswa"
                    />
                    <InputError message={errors.nis} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-email">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="edit-email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => {
                            setData('email', e.target.value);
                            if (e.target.value.length > 0) {
                                clearErrors('email');
                            }
                        }}
                        placeholder="email@example.com"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-password">
                        Password Baru{' '}
                        <span className="text-xs text-brand-muted font-normal">
                            (Kosongkan jika tidak ingin mengubah)
                        </span>
                    </Label>
                    <Input
                        id="edit-password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Minimal 8 karakter"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-phone">No. HP</Label>
                    <Input
                        id="edit-phone"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-gender">
                        Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.gender}
                        onValueChange={(value) => {
                            setData('gender', value);
                            clearErrors('gender');
                        }}
                    >
                        <SelectTrigger className="w-full text-black">
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
                    <Label htmlFor="edit-class_id">Kelas</Label>
                    <Select
                        value={data.class_id}
                        onValueChange={(value) => setData('class_id', value)}
                    >
                        <SelectTrigger className="w-full text-black">
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
                    <Label htmlFor="edit-birth_date">Tanggal Lahir</Label>
                    <Input
                        id="edit-birth_date"
                        name="birth_date"
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                    />
                    <InputError message={errors.birth_date} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-status">
                        Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => {
                            setData('status', value);
                            clearErrors('status');
                        }}
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
                    <Label htmlFor="edit-address">Alamat</Label>
                    <Input
                        id="edit-address"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Alamat lengkap"
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-parent_name">Nama Orang Tua</Label>
                    <Input
                        id="edit-parent_name"
                        name="parent_name"
                        value={data.parent_name}
                        onChange={(e) => setData('parent_name', e.target.value)}
                        placeholder="Nama ayah/ibu"
                    />
                    <InputError message={errors.parent_name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="edit-parent_phone">No. HP Orang Tua</Label>
                    <Input
                        id="edit-parent_phone"
                        name="parent_phone"
                        value={data.parent_phone}
                        onChange={(e) => setData('parent_phone', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                    />
                    <InputError message={errors.parent_phone} />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onSuccess}
                    disabled={processing}
                    className="border-neutral-200 bg-white text-brand-text hover:bg-brand-soft"
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    className="bg-brand text-white hover:bg-brand-dark"
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
