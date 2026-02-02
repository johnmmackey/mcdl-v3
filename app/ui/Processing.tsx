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

export const Processing = ({
    open = true
}: Readonly<{
    open?: boolean
}>) => {
    return (
        <>
            {open &&
                <div className='fixed inset-0 bg-stone-100/70 z-100 flex justify-center items-center'>
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
                <AlertDialogTrigger asChild>
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