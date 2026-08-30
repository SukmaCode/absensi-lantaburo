import { Form, Head } from '@inertiajs/react';
import { Separator } from '@radix-ui/react-separator';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

const inputClass =
    'h-12 border-brand-muted/40 bg-white text-brand-text placeholder:text-brand-muted focus-visible:border-brand focus-visible:ring-brand/15';

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk" />
            <div className="flex flex-col gap-8">
                <div className="space-y-3">
                    <p className="font-semibold text-xs tracking-[0.25em] text-brand uppercase">
                        Homeschooling Lantaburo
                    </p>
                    <h1 className="font-bold text-3xl leading-tight text-brand-text">
                        Selamat Datang Kembali
                    </h1>
                    <p className="font-regular text-base leading-relaxed text-brand-muted">
                        Masuk untuk melanjutkan perjalanan belajar bersama
                        Lantaburo.
                    </p>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Kata Sandi
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto font-medium text-sm text-brand hover:text-brand-dark"
                                                tabIndex={5}
                                            >
                                                Lupa password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Kata sandi Anda"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="font-regular text-sm text-brand-text"
                                    >
                                        Ingat saya
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-12 w-full rounded-sm bg-brand-dark font-semibold text-white cursor-pointer hover:bg-brand-dark/90"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    {processing ? 'Masuk...' : 'Masuk'}
                                </Button>
                            </div>

                            <div className="text-center font-regular text-sm text-brand-muted">
                                Belum punya akun?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-semibold text-brand hover:text-brand-dark"
                                >
                                    Daftar
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {status && (
                <div className="mt-4 text-center font-medium text-sm text-brand-dark">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk',
    description: 'Masuk untuk melanjutkan perjalanan belajar bersama Lantaburo',
};
