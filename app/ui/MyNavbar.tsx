'use client';

import { Navbar, Avatar, Dropdown } from 'flowbite-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link'
import { signIn, signOut } from "next-auth/react"

export const MyNavbar = ({
    session,
    currentSeasonId
}: {
    session: any,
    currentSeasonId: number
}) => {
    const pathName = usePathname();

    return (
        <Navbar className="bg-blue-100 sticky top-0 left-0 right-0 z-50 mb-4" fluid rounded >

            <Navbar.Brand href="https://www.mcdiving.org">
                {/*<img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />*/}
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MCDL</span>
            </Navbar.Brand>

            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar placeholderInitials={(session?.user?.profile) ? session.user.profile.givenName.slice(0, 1) + session.user.profile.familyName.slice(0, 1) : ""} size="sm" rounded />
                    }
                >
                    {session?.user?.profile &&
                        <Dropdown.Header>
                            <span className="block text-sm">{session.user.profile.givenName} {session.user.profile.familyName}</span>
                            <span className="block truncate text-sm font-medium">{session.user.email}</span>
                        </Dropdown.Header>
                    }
                    <Dropdown.Item>Placeholder</Dropdown.Item>
                    <Dropdown.Divider />
                    {session?.user?.profile &&

                        <Dropdown.Item onClick={() => signOut()}>Sign Out</Dropdown.Item>

                    }
                    {!session &&
                        <Dropdown.Item onClick={() => signIn('cognito')}>Sign In</Dropdown.Item>
                    }
                </Dropdown>
                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link as={Link} href="/" active={pathName === '/'}>
                    Home
                </Navbar.Link>
                <Navbar.Link as={Link} href="/">
                    About
                </Navbar.Link>
                <Dropdown
                    arrowIcon={true}
                    inline
                    label="Teams"
                >
                    <Dropdown.Header>
                        CG
                    </Dropdown.Header>

                    <Dropdown.Item href={`/divers/${currentSeasonId}/CG`}>Divers</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Placeholder</Dropdown.Item>
                </Dropdown>
                <Navbar.Link as={Link} href="/divers/2023/CG" active={pathName.substring(0, '/standings'.length) === '/divers'}>CGDivers</Navbar.Link>
                <Navbar.Link as={Link} href="/meets" active={pathName.substring(0, '/meets'.length) === '/meets'}>Meets</Navbar.Link>
                <Navbar.Link as={Link} href="/standings" active={pathName.substring(0, '/standings'.length) === '/standings'}>Standings</Navbar.Link>
                <Navbar.Link as={Link} href="/test" active={pathName === '/test'}>Test</Navbar.Link>
                <Navbar.Link as={Link} href="#">Contact</Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    );
}