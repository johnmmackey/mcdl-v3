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
    id,
    children,
    title = '',
    description = '',
    actionName = '',
    actionHandler = () => { },
    dangerMode = false,

}: {
    id: string,
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

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open ? id : '');
    }

    return (
        <Dialog open={isOpen === id} onOpenChange={handleOpenChange}>
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
    isOpen: string;
    onOpenChange: (open: string) => void;
}>({
    isOpen: '',
    onOpenChange: () => { }
});

export const ActionDialogProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState('');

    return (
        <ActionDialogContext.Provider value={{ isOpen, onOpenChange: setIsOpen }}>
            {children}
        </ActionDialogContext.Provider>
    )
}

export const ActionDialogTrigger = ({
    id,
    children,
}: {
    id: string;
    children: React.ReactElement<{ onClick?: () => void }>;
}) => {
    const { isOpen, onOpenChange } = React.useContext(ActionDialogContext);

    const handleClick = () => {
        onOpenChange(id);
    };

    return React.cloneElement(children, {
        onClick: handleClick,
    });
}