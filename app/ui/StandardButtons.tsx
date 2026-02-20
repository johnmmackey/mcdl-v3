import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { IconPlus } from '@tabler/icons-react';

export const ActionButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <Button variant="outline" size="lg" className='text-blue-700 border-blue-400 border-2' {...props}>
            {children}
        </Button>
    );
}

export const CancelButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <Button variant="outline" size="lg" className='border-2' {...props}>
            {children}
        </Button>
    );
}



// because it happens so much
export const NewButton = ({
    href
}: {
    href: string
}) => 
        <Link href={href} >
            <ActionButton><IconPlus size={24} />New</ActionButton>
        </Link>
