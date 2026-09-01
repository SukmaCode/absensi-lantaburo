import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { FaSchool } from "react-icons/fa";

export default function AppLogo() {
    const { name, logo } = usePage<{
        name: string;
        logo: string | null;
    }>().props;

    const [logoPreview] = useState<string | null>(
        logo ? `/storage/${logo}` : null,
    );
    
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                {logoPreview ? (
                    <img src={logoPreview} alt={name} width={40} height={40} className="bg-cover bg-center" />
                ) : (
                    <FaSchool className="size-8 fill-current text-white" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
