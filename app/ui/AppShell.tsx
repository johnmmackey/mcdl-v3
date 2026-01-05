'use client';
import { AppShell, Group, Burger, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MyNavBar } from '@/app/ui/MyNavBar'
import { Session } from 'next-auth';
import Image from 'next/image'

export default function MyAppShell({
    children,
    session
}: Readonly<{
    children: React.ReactNode;
    session: Session | null
}>) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 80, offset: true}}
            navbar={{
                width: 300,
                breakpoint: 'md',
                collapsed: { mobile: !opened },
            }}
            padding={0}
        >
            <AppShell.Header className='z-10'>   {/* default z index is 100, which obscures popups */}
                <Group className="p-2">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="md"
                    />
                    <Image style={{ borderRadius: '30px' }} src='/diver.png' alt="diver" width={55} height={55}/>
                    <span className='text-2xl font-semibold'>MCDL</span>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p={"md"} onClick={toggle} >
                <MyNavBar session={session} toggle={toggle} />
            </AppShell.Navbar>

            <AppShell.Main>
                <ScrollArea h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))" >
                    <div className="p-4 pb-16" style={{ maxWidth: '1200px' }}>
                        {children}
                    </div>
                </ScrollArea>
            </AppShell.Main>
            <AppShell.Footer>
                <div className="text-center">
                Footer
                </div>
            </AppShell.Footer>
        </AppShell>
    )
}