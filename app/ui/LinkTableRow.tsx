'use client'
import { Table, TableRow, TableCell }  from 'flowbite-react';
import { useRouter } from 'next/navigation'
import React from 'react';

export function LinkTableRow({ className, children, href, inactive }: {  children: React.ReactNode, className?: string, href:string, inactive?: boolean}) {

    //console.log(className, children)
    const router = useRouter();
       
    return (
        <TableRow className={className} onClick={(e) => {console.log(e);  !inactive && router.push(href)}}>
           {children}
        </TableRow>
    )
}