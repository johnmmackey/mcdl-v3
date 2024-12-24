'use client';
import { useState } from 'react';
import { Avatar } from '@mantine/core';
import Link from 'next/link'
import { Session } from 'next-auth';
import {
    IconHome,
    IconScubaDiving,
    IconFileDescription,
    Icon2fa,
    IconBellRinging,
    IconDatabaseImport,
    IconFingerprint,
    IconKey,
    IconLogin,
    IconLogout,
    IconReceipt2,
    IconSettings,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import { signIn, signOut } from "next-auth/react"

import classes from './MyNavBar.module.css';

const data = [
    { link: '/', label: 'Home', icon: IconHome },
    { link: '/meets', label: 'Meets', icon: IconScubaDiving },
    { link: '/standings', label: 'Standings', icon: IconFileDescription },
    { link: '', label: 'Security', icon: IconFingerprint },
    { link: '', label: 'SSH Keys', icon: IconKey },
    { link: '', label: 'Databases', icon: IconDatabaseImport },
    { link: '', label: 'Authentication', icon: Icon2fa },
    { link: '', label: 'Other Settings', icon: IconSettings },
];

export function MyNavBar({ session, toggle }: { session: Session | null, toggle: ()=>void }) {
    const [active, setActive] = useState('Home');

    const links = data.map((item) => (
        <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                //event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <nav className={classes.navbar} onClick={toggle}>
            <div className={classes.navbarMain}>
                {links}
            </div>

            <div className={classes.footer}>
                {!session?.user
                    ? <div className={classes.link} onClick={(event) => signIn('cognito')}>
                        <IconLogin className={classes.linkIcon} stroke={1.5} />
                        <span>Login</span>
                    </div>
                    : <>


                        <div className={classes.link} onClick={(event) => signOut()}>
                        <Avatar color="cyan" radius="xl" className="mr-2">
                            {session.user.profile.givenName[0] + session.user.profile.familyName[0]}
                        </Avatar>
                            <span>Logout</span>
                        </div>
                    </>
                }


            </div>
        </nav>
    );
}