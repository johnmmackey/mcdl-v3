"use client";
import React from "react";
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

/**
 * A reusable dialog component for performing actions with confirmation.
 *
 * @component
 * @param {Object} props - The props for the ActionDialog component.
 * @param {boolean} [props.isOpen] - Controls whether the dialog is open or closed.
 * @param {function} [props.onOpenChange] - Callback function triggered when the dialog's open state changes.
 * @param {string} props.title - The title displayed at the top of the dialog.
 * @param {string} props.description - A brief description or message displayed in the dialog.
 * @param {string} props.actionName - The label for the action button.
 * @param {function} props.onAction - The function to execute when the action button is clicked. Should return a Promise.
 * @param {boolean} [props.dangerMode=false] - If true, the action button will have a destructive style.
 * @param {React.ReactNode} [props.children] - The trigger element for opening the dialog.
 * @param {React.ReactNode} [props.content] - Additional content to display inside the dialog.
 * 
 * @description
 * The ActionDialog component provides a modal dialog interface for confirming actions.
 * It includes a title, description, and action button, with optional danger styling.
 * The dialog can be controlled externally via the isOpen and onOpenChange props, or can manage its own state.
 * For uncontrolled mode, typically props.children contains a button - which will triggered the dialog.
 * The onAction prop allows for asynchronous operations when the action button is clicked.
 *
 * @example
 * <ActionDialog
 *   isOpen={isDialogOpen}
 *   onOpenChange={setDialogOpen}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   actionName="Delete"
 *   onAction={handleDelete}
 *   dangerMode={true}
 * >
 *   <Button>Open Dialog</Button>
 * </ActionDialog>
 */
export const ActionDialog = ({
    isOpen,
    onOpenChange,
    title,
    description,
    actionName,
    onAction,
    dangerMode = false,
    children,
    trigger,
}: {
    isOpen?: boolean,
    onOpenChange?: (open: boolean) => void,
    title: string;
    description: string;
    actionName: string;
    onAction: () => Promise<void>;
    dangerMode?: boolean;
    children?: React.ReactNode;
    trigger?: React.ReactNode;
}) => {
    const [isPending, startTransition] = useTransition();

    const handleAction = () => {
        startTransition(async () => {
            await onAction();
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleAction} variant={dangerMode ? "destructive" : "default"}>
                            {actionName}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
            <Processing open={isPending} />
        </Dialog>
    );
}