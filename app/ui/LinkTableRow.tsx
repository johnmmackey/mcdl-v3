'use client'
import { Table, TableRow, TableCell }  from 'flowbite-react';
import { useRouter } from 'next/navigation'
import React from 'react';

export function LinkTableRow({ className, children, href }: {  children: React.ReactNode, className: string, href:string }) {

    //console.log(className, children)
    const router = useRouter();
   
    return (
        <TableRow className={className} onClick={() => router.push(href)}>
           {children}
        </TableRow>
    )
}