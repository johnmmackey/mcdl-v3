

import { Session } from 'next-auth';
import { signIn, signOut } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link'

import { LoginButton, ProfileDropdown } from './ProfileDropdown';

import crypto from 'crypto';


import {
    ArrowRightLeftIcon,
    CalendarClockIcon,
    ChartNoAxesCombinedIcon,
    ChartPieIcon,
    ChartSplineIcon,
    ClipboardListIcon,
    Clock9Icon,
    CrownIcon,
    FacebookIcon,
    HashIcon,
    InstagramIcon,
    LanguagesIcon,
    LinkedinIcon,
    SettingsIcon,
    SquareActivityIcon,
    TwitterIcon,
    Undo2Icon,
    UserIcon,
    UsersIcon,
    LogInIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar'

import {
    IconHome,
    IconChartBarPopular,
    IconFiles,
    IconKey,
    IconLogin,
    IconSettings,
    IconUsersGroup,
} from '@tabler/icons-react';

import { userInitials } from '@/app/lib/userInitials';


function IconDiver(props: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            className={'tabler-icon ' + props.className || ''}
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M19 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
            <path d="M2 2l3 3l1.5 4l3.5 2l6 2l1 4l2.5 3"></path>
        </svg>
    )
}

const header = <div className='flex gap-4 items-center'>
    <Image style={{ borderRadius: '30px' }} src='/diver.png' alt="diver" width={55} height={55} />
    <span className='text-2xl font-semibold'>MCDL</span>
</div>


const links = [
    { link: '/', label: 'Home', icon: IconHome },
    { link: '/teams', label: 'Teams', icon: IconUsersGroup },
    { link: '/meets', label: 'Meets', icon: IconDiver },
    { link: '/standings', label: 'Standings', icon: IconChartBarPopular },
    { link: '/resources', label: 'Resources', icon: IconFiles },
    { link: '/users', label: 'Users', icon: IconKey },

    { link: '/test', label: 'Test Page', icon: IconSettings },
];


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
                <Sidebar>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href='#'>
                                                <ChartNoAxesCombinedIcon />
                                                <span>Dashboard</span>
                                            </a>
                                        </SidebarMenuButton>
                                        <SidebarMenuBadge className='bg-primary/10 rounded-full'>5</SidebarMenuBadge>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel>Pages</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {links.map((item) => (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton asChild>

                                                <Link

                                                    href={item.link}


                                                >
                                                    <item.icon stroke={1.5} />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel>Supporting Features</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href='#'>
                                                <SquareActivityIcon />
                                                <span>Real Time Monitoring</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href='#'>
                                                <CalendarClockIcon />
                                                <span>Schedule Post & Calendar</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href='#'>
                                                <Undo2Icon />
                                                <span>Report & Export</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href='#'>
                                                <SettingsIcon />
                                                <span>Settings & Integrations</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href='#'>
                                                <UsersIcon />
                                                <span>User Management</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <div className='flex flex-1 flex-col'>
                    <header className='bg-card sticky top-0 z-50 border-b'>
                        <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6'>
                            <div className='flex items-center gap-4'>
                                <SidebarTrigger className='[&_svg]:!size-5' />
                                <Separator orientation='vertical' className='hidden !h-4 sm:block' />
                                <Breadcrumb className='hidden sm:block'>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Free</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
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

                        <CardContent className='h-full'>
                            {children}
                        </CardContent>

                    </main>
                    <footer>
                        <div className='text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6'>
                            <p className='text-sm text-balance max-sm:text-center'>
                                {`©${new Date().getFullYear()}`}{' '}
                                <a href='#' className='text-primary'>
                                    shadcn/studio
                                </a>
                                , Made for better web design
                            </p>
                            <div className='flex items-center gap-5'>
                                <a href='#'>
                                    <FacebookIcon className='size-4' />
                                </a>
                                <a href='#'>
                                    <InstagramIcon className='size-4' />
                                </a>
                                <a href='#'>
                                    <LinkedinIcon className='size-4' />
                                </a>
                                <a href='#'>
                                    <TwitterIcon className='size-4' />
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
            </SidebarProvider>
        </div>
    )
}

