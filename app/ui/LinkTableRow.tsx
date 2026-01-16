'use client'
import { TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation'
import React from 'react';

export function LinkTableRow({
    className = 'hover:bg-slate-200 cursor-pointer',
    children,
    href = '#',
    inactive = false
}: {
    className?: string,
    children?: React.ReactNode,
    href?:string,
    inactive?: boolean
}) {

    const router = useRouter();
       
    return (
        <TableRow className={className} onClick={(e) => {!inactive && router.push(href)}}>
           {children}
        </TableRow>
    )
}