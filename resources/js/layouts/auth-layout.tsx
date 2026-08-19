import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <AuthLayoutTemplate>{children}</AuthLayoutTemplate>;
}
