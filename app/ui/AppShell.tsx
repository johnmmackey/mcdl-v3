import { Session } from 'next-auth';
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'


import {
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
        <div className='flex min-h-dvh w-full'>
            <SidebarProvider>
                <MySidebar />

                <div className='flex flex-1 flex-col'>
                    <header className='bg-card sticky top-0 z-50 border-b'>
                        <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6'>
                            <div className='flex items-center gap-4'>
                                <SidebarTrigger className='[&_svg]:!size-5' />
                                <Separator orientation='vertical' className='hidden !h-4 sm:block' />
                                <AppBreadcrumbs />
                            </div>
                            <div className='flex items-center gap-1.5'>
                                {session && session.user 
                                    ? <ProfileDropdown
                                        trigger={
                                            <Button variant='ghost' size='icon' className='size-9.5'>
                                                <Avatar className='size-9.5 '>
                                                    <AvatarFallback>{userInitials(session.user.name ?? '')}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        }
                                        session={session}
                                    />
                                    : <LoginButton/>
                                }
                            </div>
                        </div>
                    </header>
                    <main className='mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6'>

                        <div className='h-full'>
                            {children}
                        </div>

                    </main>
                    <footer>
                        <div className='text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6'>
                            <p className='text-sm text-balance max-sm:text-center'>
                                {`©${new Date().getFullYear()}`}{' '}
                                52west.com. All rights reserved.
                            </p>
                        </div>
                    </footer>
                </div>
            </SidebarProvider>
        </div>
    )
}

