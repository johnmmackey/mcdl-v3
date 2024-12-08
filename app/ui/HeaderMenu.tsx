"use client"
import { IconChevronDown } from '@tabler/icons-react';
import { Burger, Center, Container, Group, Menu, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderMenu.module.css';
import Link from 'next/link';

import { signIn, signOut } from "next-auth/react"

const links = [
    { link: '/', label: 'Home' },
    { link: '/standings', label: 'Standings' },
    { link: '/meets', label: 'Meets' },

    {
        link: '#1',
        label: 'Test',
        links: [
            { link: '/test', label: 'Cache Purge' },
            { link: '/divers/2023/CG', label: 'CG Divers - 2023' },
            { link: '/forums', label: 'Forums' },
        ],
    },

];

export const HeaderMenu = ({
    session,
    currentSeasonId
}: {
    session: any,
    currentSeasonId: number
}) => {
    const [opened, { toggle }] = useDisclosure(false);

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>
                <Link href={item.link}>
                    {item.label}
                </Link>
            </Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <a
                            href={link.link}
                            className={classes.link}
                            onClick={(event) => event.preventDefault()}
                        >
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size={14} stroke={1.5} />
                            </Center>
                        </a>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link
                key={link.label}
                href={link.link}
                className={classes.link}
            //onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Link>
        );
    });

    return (
        <header className={classes.header}>
            <Container size="md">
                <Group justify="space-between">
                    <div className={classes.inner}>
                        <Group gap={5} visibleFrom="sm">
                            {items}
                        </Group>
                        <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    </div>

                    <div>
                        <Menu trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                            <Menu.Target>
                                <Avatar alt={"A"} radius="xl" size={40} name={
                                    session?.user?.profile
                                        ? session.user.profile.givenName + ' ' + session.user.profile.familyName
                                        : undefined
                                }
                                />

                            </Menu.Target>
                            <Menu.Dropdown>
                                {!session?.user
                                    ? <Menu.Item onClick={() => signIn('cognito')}>
                                        Sign In
                                    </Menu.Item>
                                    : <Menu.Item onClick={() => signOut()}>
                                        Sign Out
                                    </Menu.Item>
                                }
                            </Menu.Dropdown>
                        </Menu>
                    </div>

                </Group>
            </Container>
        </header>
    );
}