import { usePage } from '@inertiajs/react';
import { FaBell } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';

export function AppSidebarHeader() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-brand-bg px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-black cursor-pointer hover:bg-transparent hover:text-black" />
                {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
            </div>

            <div className="flex items-center gap-3">
                <span className="hidden text-sm text-black md:inline-flex">
                    {today}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full text-black hover:bg-brand-soft hover:text-brand-dark"
                    aria-label="Notifikasi"
                >
                    <FaBell className="size-5 text-brand-dark" />
                    {/* <span className="absolute top-1.5 right-2 size-2 rounded-full bg-red-500" /> */}
                </Button>
                {auth.user && (
                    <Avatar className="size-8 overflow-hidden rounded-full">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="bg-brand-soft text-brand-dark">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        </header>
    );
}
