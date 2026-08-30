import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

const inputClass =
    'h-12 border-brand-muted/40 bg-white text-brand-text placeholder:text-brand-muted focus-visible:border-brand focus-visible:ring-brand/15';

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar" />

            <div className="flex flex-col gap-8">
                <div className="space-y-3">
                    <p className="font-semibold text-xs tracking-[0.25em] text-brand uppercase">
                        Homeschooling Lantaburo
                    </p>
                    <h1 className="font-bold text-3xl leading-tight text-brand-text">
                        Buat Akun
                    </h1>
                    <p className="font-regular text-base leading-relaxed text-brand-muted">
                        Mulai perjalanan belajar bersama Homeschooling
                        Lantaburo.
                    </p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Nama lengkap Anda"
                                        className={inputClass}
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Kata Sandi</Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="********"
                                        passwordrules={passwordRules}
                                        className={inputClass}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="********"
                                        passwordrules={passwordRules}
                                        className={inputClass}
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-12 w-full rounded-sm bg-brand-dark font-semibold text-white cursor-pointer hover:bg-brand-dark/90"
                                    tabIndex={5}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    {processing ? 'Mendaftar...' : 'Daftar'}
                                </Button>
                            </div>

                            <div className="text-center font-regular text-sm text-brand-muted">
                                Sudah punya akun?{' '}
                                <TextLink
                                    href={login()}
                                    tabIndex={6}
                                    className="font-semibold text-brand hover:text-brand-dark"
                                >
                                    Masuk
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun',
    description: 'Mulai perjalanan belajar bersama Homeschooling Lantaburo',
};