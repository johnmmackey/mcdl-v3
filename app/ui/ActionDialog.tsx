import { useTransition } from "react";

import { Button } from "@/components/ui/button"
import { Processing } from "@/app/ui/Processing"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

export const ActionDialog = ({
    isOpen,
    onOpenChange,
    children,
    title = '',
    description = '',
    actionName = '',
    actionHandler = () => { },
}: {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    children: React.ReactNode,
    title: string,
    description: string,
    actionName: string,
    actionHandler: () => void,
}) => {
        const [isPending, startTransition] = useTransition();

    const handleAction = () => {
        startTransition(async () => {
            await actionHandler();
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={handleAction} variant="outline">{actionName}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
            <Processing open={isPending} />
        </Dialog>
    )
}
