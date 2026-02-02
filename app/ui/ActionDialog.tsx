"use client";
import React, { useState } from "react";
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
    dangerMode = false,
}: {
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    children: React.ReactNode,
    title: string,
    description: string,
    actionName: string,
    actionHandler: () => void,
    dangerMode?: boolean,
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
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleAction} variant={dangerMode ? "destructive" : "outline"}>{actionName}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
            <Processing open={isPending} />
        </Dialog>
    )
}

export const ActionDialog2 = ({
    children,
    title = '',
    description = '',
    actionName = '',
    actionHandler = () => { },
    dangerMode = false,

}: {
    children: React.ReactNode,
    title: string,
    description: string,
    actionName: string,
    actionHandler: () => void,
    dangerMode?: boolean,

}) => {

    const [isPending, startTransition] = useTransition();

    const handleAction = () => {
        startTransition(async () => {
            await actionHandler();
        });
    };

    const { isOpen, onOpenChange } = React.useContext(ActionDialogContext);

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
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleAction} variant={dangerMode ? "destructive" : "outline"}>{actionName}</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
                <Processing open={isPending} />
            </Dialog>

    )
}




const ActionDialogContext = React.createContext<{
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}>({
    isOpen: false,
    onOpenChange: () => { }
});

export const ActionDialogProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);



    return (
        <ActionDialogContext.Provider value={{ isOpen, onOpenChange: setIsOpen }}>
            {children}
        </ActionDialogContext.Provider>
    )
}

export const ActionDialogTrigger = ({
    children,
}: {
    children: React.ReactElement<{ onClick?: () => void }>;
}) => {
    const { isOpen, onOpenChange } = React.useContext(ActionDialogContext);

    const handleClick = () => {
        onOpenChange(!isOpen);
    };

    return React.cloneElement(children, {
        onClick: handleClick,
    });
}