'use client'

import Link from 'next/link'

import {
    ChartNoAxesCombinedIcon,
} from 'lucide-react'

import {
    IconHome,
    IconChartBarPopular,
    IconFiles,
    IconKey,
    IconLogin,
    IconSettings,
    IconUsersGroup,
    IconCalendar
} from '@tabler/icons-react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar
} from '@/components/ui/sidebar'

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

const links = [
    { link: '/', label: 'Home', icon: IconHome },
    { link: '/teams', label: 'Teams', icon: IconUsersGroup },
    { link: '/seasons', label: 'Seasons', icon: IconCalendar },
    { link: '/meets', label: 'Meets', icon: IconDiver },
    { link: '/standings', label: 'Standings', icon: IconChartBarPopular },
    { link: '/resources', label: 'Resources', icon: IconFiles },
    { link: '/users', label: 'Users', icon: IconKey },

    { link: '/test', label: 'Test Page', icon: IconSettings },
    { link: '/test2', label: 'Test Page 2', icon: IconSettings },
];

export const MySidebar = () => {
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    } = useSidebar()

    const handleClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }

    return (
        <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
            <SidebarHeader>
                Header
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href='/' />
                                </SidebarMenuButton>
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
                                        <Link href={item.link} onClick={handleClick}>
                                            <item.icon stroke={1.5} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}