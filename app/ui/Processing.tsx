import { useState, useEffect } from 'react'
import { Toaster, toast } from "sonner"
import { IconRefresh } from '@tabler/icons-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { GenericServerActionState } from '../lib/definitions';
import { Button } from '@mantine/core';

export const Processing = ({
    open = true
}: Readonly<{
    open?: boolean
}>) => {
    return (
        <>
            {open &&
                <div className='absolute top-0 left-0 w-full h-full bg-stone-100/70 z-100 flex justify-center items-center'>
                    <IconRefresh className="animate-spin text-gray-300" size={128} />
                </div>
            }
        </>
    );
}

export const AreYouSure = ({
    msg,
    onConfirm,
    children
}: Readonly<{
    msg: string | null,
    onConfirm: () => void,
    children: React.ReactNode
}>) => {
    return (
            <AlertDialog>
                <AlertDialogTrigger>
                        {children}
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {msg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
    )
}