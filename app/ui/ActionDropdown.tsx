//'use client'
import { Menu, MenuTarget, MenuDropdown, MenuItem } from '@mantine/core';
import Link from 'next/link'
//import { useRouter } from 'next/navigation'
import {
    IconChevronDown,
} from '@tabler/icons-react';
import React from 'react';

const base='/meets';
const actionMap = [
    {'name': 'Edit', 'href': '/edit'},
    {'name': 'Print', 'href': '/print'}
]

export function ActionDropdown() {

    //console.log(className, children)
    //const router = useRouter();

    return (
        <Menu transitionProps={{ exitDuration: 0 }} withinPortal>
            <MenuTarget>
                <IconChevronDown size={18} stroke={1.5} />
            </MenuTarget>
            <MenuDropdown>
                {actionMap.map((s, k) =>
                    <MenuItem key={k}>
                        <Link href={base + `?season-id=${s.href}`}>{s.name}</Link>
                    </MenuItem>
                )}
            </MenuDropdown>
        </Menu>
    )
}

