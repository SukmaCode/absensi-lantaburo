import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Check, LoaderCircle, Search, Users, X } from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AvailableStudentOption, ParentPreviewRow } from '@/types/admin';

type FormEditParentProps = {
    parent: ParentPreviewRow;
    availableStudents: AvailableStudentOption[];
    onSuccess: () => void;
};

export default function FormEditParent({
    parent,
    availableStudents,
    onSuccess,
}: FormEditParentProps) {
    const [studentSearch, setStudentSearch] = useState('');

    const { data, setData, put, processing, errors, clearErrors } = useForm<{
        name: string;
        email: string;
        password: string;
        phone: string;
        status: string;
        student_ids: number[];
    }>({
        name: parent.name ?? '',
        email: parent.email ?? '',
        password: '',
        phone: parent.phone ?? '',
        status: parent.raw_status ?? (parent.status === 'Aktif' ? 'active' : 'inactive'),
        student_ids: parent.student_ids ?? parent.students.map((s) => s.id),
    });

    function toggleStudent(studentId: number) {
        if (data.student_ids.includes(studentId)) {
            setData(
                'student_ids',
                data.student_ids.filter((id) => id !== studentId),
            );
        } else {
            setData('student_ids', [...data.student_ids, studentId]);
        }
    }

    function removeStudent(studentId: number) {
        setData(
            'student_ids',
            data.student_ids.filter((id) => id !== studentId),
        );
    }

    const filteredStudents = availableStudents.filter((s) => {
        if (!studentSearch.trim()) return true;
        const q = studentSearch.toLowerCase();
        return (
            s.name.toLowerCase().includes(q) ||
            s.nis.toLowerCase().includes(q) ||
            (s.class && s.class.toLowerCase().includes(q))
        );
    });

    const selectedStudentsList = availableStudents.filter((s) =>
        data.student_ids.includes(s.id),
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();

        put(`/admin/data-orangtua/${parent.id}`, {
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
                        placeholder="Nama lengkap orang tua / wali"
                    />
                    <InputError message={errors.name} />
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
                        Password{' '}
                        <span className="text-xs font-normal text-brand-muted">
                            (Kosongkan jika tidak diubah)
                        </span>
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
                    <Label htmlFor="edit-phone">No. Telepon / WhatsApp</Label>
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

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="edit-status">Status Akun</Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value)}
                    >
                        <SelectTrigger id="edit-status" className="w-full text-black rounded-xs">
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

            {/* Relasi Siswa (Anak) */}
            <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="size-4 text-brand" />
                        <Label className="font-semibold text-sm text-brand-text">
                            Hubungkan Siswa (Anak)
                        </Label>
                    </div>
                    <span className="text-xs text-brand-muted">
                        {data.student_ids.length} siswa dipilih
                    </span>
                </div>
                <p className="text-xs text-brand-muted">
                    Pilih atau ubah siswa yang terhubung dengan akun orang tua ini.
                </p>

                {/* Selected Students Tags */}
                {selectedStudentsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedStudentsList.map((st) => (
                            <Badge
                                key={st.id}
                                variant="secondary"
                                className="flex items-center gap-1.5 border border-brand/20 bg-brand-soft/40 px-2.5 py-1 text-xs text-brand-dark"
                            >
                                <span className="font-medium">{st.name}</span>
                                {st.class && (
                                    <span className="text-[10px] text-brand-muted">
                                        ({st.class})
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeStudent(st.id)}
                                    className="cursor-pointer rounded-full p-0.5 hover:bg-brand/20 text-brand-dark transition-colors"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Search in student list */}
                <div className="relative mt-2">
                    <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-brand-muted" />
                    <Input
                        type="text"
                        placeholder="Cari nama siswa atau NIS..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="h-8 border-neutral-200 bg-white pl-8 text-xs text-black"
                    />
                </div>

                {/* List of Available Students */}
                <div className="max-h-44 overflow-y-auto rounded border border-neutral-200 custom-scrollbar bg-white p-1 divide-y divide-neutral-100">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                            const isChecked = data.student_ids.includes(student.id);
                            return (
                                <label
                                    key={student.id}
                                    className={cn(
                                        'flex cursor-pointer items-center justify-between gap-2 rounded px-2.5 py-2 text-xs transition-colors hover:bg-brand-soft/20',
                                        isChecked && 'bg-brand-soft/30',
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={() =>
                                                toggleStudent(student.id)
                                            }
                                        />
                                        <div>
                                            <p className="font-medium text-brand-text">
                                                {student.name}
                                            </p>
                                            <p className="text-[11px] text-brand-muted">
                                                NIS: {student.nis} {student.class ? `• ${student.class}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    {isChecked && (
                                        <Check className="size-3.5 text-brand" />
                                    )}
                                </label>
                            );
                        })
                    ) : (
                        <p className="py-4 text-center text-xs text-brand-muted">
                            Tidak ada data siswa yang cocok.
                        </p>
                    )}
                </div>
                <InputError message={errors.student_ids} />
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
