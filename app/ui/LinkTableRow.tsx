'use client'
import { TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation'
import React from 'react';

export function LinkTableRow({ className, children, href, inactive }: {  children: React.ReactNode, className?: string, href:string, inactive?: boolean}) {

    const router = useRouter();
       
    return (
        <TableRow className={className} onClick={(e) => {console.log(e);  !inactive && router.push(href)}}>
           {children}
        </TableRow>
    )
}