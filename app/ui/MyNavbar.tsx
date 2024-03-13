'use client';

import { Navbar, Avatar, Dropdown } from 'flowbite-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link'

export const MyNavbar = ({
    session
  }:{
    session: any
  }) => {
    const pathName = usePathname();

    return (
        <Navbar className="bg-blue-100" fluid rounded >

            <Navbar.Brand href="https://www.mcdiving.org">
                {/*<img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />*/}
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MCDL</span>
            </Navbar.Brand>

            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar placeholderInitials={session ? session.profile.givenName.slice(0,1) + session.profile.familyName.slice(0,1) : ""} size="sm" rounded />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                    </Dropdown.Header>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Earnings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
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
                <Navbar.Link as={Link} href="/meets" active={pathName.substring(0, '/meets'.length) === '/meets'}>Meets</Navbar.Link>
                <Navbar.Link as={Link} href="/standings" active={pathName.substring(0, '/standings'.length) === '/standings'}>Standings</Navbar.Link>
                <Navbar.Link as={Link} href="/test" active={pathName === '/test'}>Test</Navbar.Link>
                <Navbar.Link as={Link} href="#">Contact</Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    );
}