'use client';
import { useState } from 'react';
import {
  Avatar,
} from "@/components/ui/avatar"
import Link from 'next/link'
import { Session } from 'next-auth';
import {
    IconHome,
    IconChartBarPopular,
    IconFiles,
    IconKey,
    IconLogin,
    IconSettings,
    IconUsersGroup,
} from '@tabler/icons-react';
import { signIn, signOut } from "next-auth/react"

import classes from './MyNavBar.module.css';

const data = [
    { link: '/', label: 'Home', icon: IconHome },
    { link: '/teams', label: 'Teams', icon: IconUsersGroup },
    { link: '/meets', label: 'Meets', icon: IconDiver },
    { link: '/standings', label: 'Standings', icon: IconChartBarPopular },
    { link: '/resources', label: 'Resources', icon: IconFiles },
    { link: '/users', label: 'Users', icon: IconKey },

    { link: '/test', label: 'Test Page', icon: IconSettings },
];

export function MyNavBar({ session, toggle }: { session: Session | null, toggle: () => void }) {
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
                            <Avatar className="rounded-lg mr-2">
                                { (session.user.givenName[0] + session.user.familyName[0] ) 
                                    || (session.user.email && session.user.email[0].toUpperCase())
                                }
                            </Avatar>
                            <span>Logout</span>
                        </div>
                    </>
                }


            </div>
        </nav>
    );
}

function IconDiver(props: {className: string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            className={'tabler-icon ' + props.className}
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M19 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
            <path d="M2 2l3 3l1.5 4l3.5 2l6 2l1 4l2.5 3"></path>
        </svg>
    )
}


//className="tabler-icon tabler-icon-scuba-diving MyNavBar-module__COLxwG__linkIcon"

