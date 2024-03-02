'use client';

import { Button, Navbar } from 'flowbite-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link'

export const MyNavbar = () => {
    const pathName = usePathname();
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="https://www.mcdiving.org">
                {/*<img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />*/}
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MCDL</span>
            </Navbar.Brand>
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