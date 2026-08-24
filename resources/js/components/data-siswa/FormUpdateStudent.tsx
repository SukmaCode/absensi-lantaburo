import { useForm } from '@inertiajs/react';
import { Check, LoaderCircle, X } from 'lucide-react';
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
import { update } from '@/routes/admin/data-siswa';
import type { ClassOption } from '@/types/dashboard';

type FormUpdateStudentProps = {
    student: {
        id: number;
        nis: string;
        class: string | null;
        status: 'Aktif' | 'Nonaktif';
    };
    classes: ClassOption[];
    onCancel: () => void;
};

export function FormUpdateStudent({ student, classes, onCancel }: FormUpdateStudentProps) {
    const currentClassId = classes.find((c) => c.name === student.class)?.id;

    const { data, setData, put, processing, errors } = useForm({
        nis: student.nis,
        class_id: currentClassId ? String(currentClassId) : '',
        status: student.status === 'Aktif' ? 'active' : 'inactive',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(update.url(student.id), {
            preserveScroll: true,
            onSuccess: () => onCancel(),
        });
    }

    return (
        <tr className="border-b border-brand/20 bg-brand-soft/30">
            <td colSpan={8} className="py-3 px-2">
                <form onSubmit={submit} className="flex flex-wrap items-start gap-3">
                    {/* NIS */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-brand-muted">NIS</label>
                        <Input
                            value={data.nis}
                            onChange={(e) => setData('nis', e.target.value)}
                            placeholder="Nomor Induk Siswa"
                            className="h-8 w-40 border-neutral-300 text-sm focus-visible:border-brand"
                        />
                        <InputError message={errors.nis} className="text-xs" />
                    </div>

                    {/* Kelas */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-brand-muted">Kelas</label>
                        <Select
                            value={data.class_id}
                            onValueChange={(value) => setData('class_id', value)}
                        >
                            <SelectTrigger className="h-8 w-36 text-black border-neutral-300 text-sm focus:border-brand">
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
                        <InputError message={errors.class_id} className="text-xs" />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-brand-muted">Status</label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger className="h-8 w-32 text-black border-neutral-300 text-sm focus:border-brand">
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Nonaktif</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="text-xs" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end gap-1 pb-0.5" style={{ marginTop: 'auto' }}>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="h-8 bg-brand rounded-sm cursor-pointer px-3 text-white hover:bg-brand-dark"
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
                            className="h-8 rounded-sm cursor-pointer border-neutral-200 bg-red-600 px-3 text-white hover:bg-red-700"
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