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
import { store } from '@/routes/admin/data-kelas';
import type { TeacherOption } from '@/types/dashboard';

type FormAddClassProps = {
    teachers: TeacherOption[];
    onSuccess: () => void;
};

export default function FormAddClass({
    teachers,
    onSuccess,
}: FormAddClassProps) {
    const availableTeachers = teachers.filter((teacher) => !teacher.homeroom_class_id);

    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            name: '',
            grade_level: '',
            homeroom_teacher_id: '',
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(store.url(), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">
                        Nama Kelas <span className="text-red-500">*</span>
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
                        placeholder="Contoh: XII IPA 1, 7A, dll."
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="grade_level">
                        Tingkat / Jenjang <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={data.grade_level}
                        onValueChange={(value) => {
                            setData('grade_level', value);
                            clearErrors('grade_level');
                        }}
                    >
                        <SelectTrigger className="w-full text-black">
                            <SelectValue placeholder="Pilih tingkat / jenjang" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VII">Kelas VII (7 SMP)</SelectItem>
                            <SelectItem value="VIII">Kelas VIII (8 SMP)</SelectItem>
                            <SelectItem value="IX">Kelas IX (9 SMP)</SelectItem>
                            <SelectItem value="X">Kelas X (10 SMA)</SelectItem>
                            <SelectItem value="XI">Kelas XI (11 SMA)</SelectItem>
                            <SelectItem value="XII">Kelas XII (12 SMA)</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.grade_level} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="homeroom_teacher_id">
                        Wali Kelas
                    </Label>
                    <Select
                        value={data.homeroom_teacher_id || 'none'}
                        onValueChange={(value) =>
                            setData('homeroom_teacher_id', value === 'none' ? '' : value)
                        }
                    >
                        <SelectTrigger className="w-full text-black">
                            <SelectValue placeholder="Pilih wali kelas (opsional)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">-- Belum Ada Wali Kelas --</SelectItem>
                            {availableTeachers.map((teacher) => (
                                <SelectItem
                                    key={teacher.id}
                                    value={String(teacher.id)}
                                >
                                    {teacher.name} {teacher.nip ? `(${teacher.nip})` : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.homeroom_teacher_id} />
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
                    Simpan Kelas
                </Button>
            </div>
        </form>
    );
}
