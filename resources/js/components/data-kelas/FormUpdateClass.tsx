import { useForm } from '@inertiajs/react';
import { Check, LoaderCircle, X } from 'lucide-react';
import type React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { update } from '@/routes/admin/data-kelas';
import type { TeacherOption } from '@/types/dashboard';

type FormUpdateClassProps = {
    classData: {
        id: number;
        name: string;
        grade_level: string;
        homeroom_teacher_id: number | null;
    };
    teachers: TeacherOption[];
    onCancel: () => void;
};

export function FormUpdateClass({
    classData,
    teachers,
    onCancel,
}: FormUpdateClassProps) {
    const availableTeachers = teachers.filter(
        (teacher) =>
            !teacher.homeroom_class_id ||
            teacher.homeroom_class_id === classData.id,
    );

    const { data, setData, put, processing, errors } = useForm({
        name: classData.name,
        grade_level: classData.grade_level,
        homeroom_teacher_id: classData.homeroom_teacher_id
            ? String(classData.homeroom_teacher_id)
            : '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(update.url(classData.id), {
            preserveScroll: true,
            onSuccess: () => onCancel(),
        });
    }

    return (
        <tr className="border-b border-brand/20 bg-brand-soft/30">
            <td colSpan={6} className="py-3 px-4">
                <form onSubmit={submit} className="flex flex-wrap items-start gap-4">
                    {/* Nama Kelas */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-brand-muted">
                            Nama Kelas <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama kelas"
                            className="h-8 w-44 border-neutral-300 bg-white text-sm focus-visible:border-brand"
                        />
                        <InputError message={errors.name} className="text-xs" />
                    </div>

                    {/* Tingkat Jenjang */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-brand-muted">
                            Tingkat / Jenjang <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={data.grade_level}
                            onValueChange={(value) => setData('grade_level', value)}
                        >
                            <SelectTrigger className="h-8 w-44 border-neutral-300 bg-white text-sm text-black focus:border-brand">
                                <SelectValue placeholder="Pilih tingkat" />
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
                        <InputError message={errors.grade_level} className="text-xs" />
                    </div>

                    {/* Wali Kelas */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-brand-muted">
                            Wali Kelas
                        </label>
                        <Select
                            value={data.homeroom_teacher_id || 'none'}
                            onValueChange={(value) =>
                                setData('homeroom_teacher_id', value === 'none' ? '' : value)
                            }
                        >
                            <SelectTrigger className="h-8 w-56 border-neutral-300 bg-white text-sm text-black focus:border-brand">
                                <SelectValue placeholder="Pilih wali kelas" />
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
                        <InputError message={errors.homeroom_teacher_id} className="text-xs" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end gap-1.5 pb-0.5" style={{ marginTop: 'auto' }}>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="h-8 rounded-sm bg-brand px-3 text-white hover:bg-brand-dark cursor-pointer"
                        >
                            {processing ? (
                                <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                                <Check className="size-3.5" />
                            )}
                            Simpan
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={onCancel}
                            className="h-8 rounded-sm border-neutral-200 bg-red-600 px-3 text-white hover:bg-red-700 cursor-pointer"
                        >
                            <X className="size-3.5" />
                            Batal
                        </Button>
                    </div>
                </form>
            </td>
        </tr>
    );
}