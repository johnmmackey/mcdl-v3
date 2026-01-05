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

export const ErrorToast = ({
    actionState
}: Readonly<{
    actionState: GenericServerActionState<any>
}>) => {
        const [lastErrorSeq, setLastErrorSeq] = useState(0);
        useEffect( () => {
            if(actionState.error && actionState.error.seq > lastErrorSeq) {
                toast.error(actionState.error.msg);
                setLastErrorSeq(actionState.error.seq);
            }
        }, [actionState.error])
    return (
            <Toaster richColors closeButton position='top-center'/>
    );
}

export const AreYouSure = ({
    msg,
    sure,
    notSure,
    open = true
}: Readonly<{
    msg: string | null,
    sure: () => void,
    notSure: () => void,
    open: boolean
}>) => {
    return (
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {msg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={notSure}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={sure}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
    )
}