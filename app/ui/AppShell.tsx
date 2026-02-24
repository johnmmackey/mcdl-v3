import type { Session } from '@/lib/auth';
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'


import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'

import { LoginButton, ProfileDropdown } from './ProfileDropdown';
import { userInitials } from '@/app/lib/userInitials';
import { AppBreadcrumbs } from './AppBreadCrumbs';
import { MySidebar } from './MySidebar';

const header = <div className='flex gap-4 items-center'>
    <Image style={{ borderRadius: '30px' }} src='/diver.png' alt="diver" width={55} height={55} />
    <span className='text-2xl font-semibold'>MCDL</span>
</div>

export const MyAppShell = ({
    children,
    session
}: Readonly<{
    children: React.ReactNode;
    session: Session | null
}>) => {

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <header className='bg-card sticky top-0 z-50 border-b' role='heading'>

                    <div className="flex h-(--header-height) w-full items-center gap-2 px-4 justify-between">
                        <span>&nbsp;</span>
                        <span className='md:hidden'>MCDL</span>
                        <span className='hidden md:inline'>Montgomery County Diving League</span>

                        {session && session.user
                            ? <ProfileDropdown
                                trigger={
                                    <Button id='profile-dropdown' variant='ghost' size='icon' className='size-9.5'>
                                        <Avatar className='size-9.5 '>
                                            <AvatarFallback>{userInitials(session.user.name ?? '')}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                }
                                session={session}
                            />
                            : <LoginButton />
                        }
                    </div>
                    <div className='mx-auto flex w-full items-center justify-between gap-6 px-4 py-2 sm:px-6'>

                        <div className='flex items-center gap-4'>
                            <SidebarTrigger className='[&_svg]:!size-5' />
                            <Separator orientation='vertical' className='hidden !h-4 sm:block' />
                            <AppBreadcrumbs />
                        </div>

                    </div>
                </header>
                <div className="flex flex-1">
                    <MySidebar />
                    <SidebarInset>
                        <main className='mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6'>

                            <div className='h-full'>
                                {children}
                            </div>

                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}

