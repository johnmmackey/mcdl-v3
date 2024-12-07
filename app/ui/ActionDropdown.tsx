'use client'
import { Dropdown } from 'flowbite-react';
import { useRouter } from 'next/navigation'
import React from 'react';

export function ActionDropdown() {

    //console.log(className, children)
    const router = useRouter();

    return (
        <span onClick={e => {console.log('dropdown clicked'); e.stopPropagation()}}>
        <Dropdown inline={true}>
            <Dropdown.Item>1</Dropdown.Item>
            <Dropdown.Item>2</Dropdown.Item>
        </Dropdown>
        </span>
    )
}