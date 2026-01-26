import React from 'react';
import { Button } from "@/components/ui/button";

export const ActionButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <Button variant="outline" size="lg" className='text-blue-700 border-blue-400 border-2' {...props}>
            {children}
        </Button>
    );
}