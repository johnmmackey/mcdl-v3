'use client';
import { AppShell, Group, Burger, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MyNavBar } from '@/app/ui/MyNavBar'
import { Session } from 'next-auth';

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
            header={{ height: 80, }}
            navbar={{
                width: 300,
                breakpoint: 'md',
                collapsed: { mobile: !opened },
            }}
            padding={0}
        >
            <AppShell.Header>
                <Group className="p-2">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="md"
                    />
                    <img style={{ borderRadius: '30px' }} src='/diver.png' />
                    <span className='text-2xl font-semibold'>MCDL</span>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p={"md"} onClick={toggle} >
                <MyNavBar session={session} toggle={toggle} />
            </AppShell.Navbar>

            <AppShell.Main>
                <ScrollArea h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))" >
                    <div className="p-4 pb-16" style={{ maxWidth: '800px' }}>
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