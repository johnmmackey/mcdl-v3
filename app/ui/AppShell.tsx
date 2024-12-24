'use client';
import { AppShell, Group, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MyNavBar } from '@/app/ui/MyNavBar'

export default function MyAppShell({
    children,
    session
}: Readonly<{
    children: React.ReactNode;
    session: any
}>) {
    const [opened, { toggle }] = useDisclosure();
    return (
        <AppShell
            header={{ height: 80,  }}
            navbar={{
                width: 300,
                breakpoint: 'md',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group className="p-2">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="md"
                    />
                    <img style={{borderRadius: '30px'}} src='/diver.png' />
                    <span className='text-2xl font-semibold'>MCDL</span>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md" onClick={toggle}>
                <MyNavBar session={session} onClick={toggle}/>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    )
}