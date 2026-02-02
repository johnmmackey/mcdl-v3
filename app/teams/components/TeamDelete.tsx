"use client";
import React, { useState } from "react";

import { ActionDialog } from "@/app/ui/ActionDialog";
import { useRouter } from "next/navigation";
import { deleteTeam } from "@/app/lib/api/teams";
import { toast } from "sonner";

export const TeamDelete = ({
    teamId,
    children,
}: {
    teamId: string;
    children: React.ReactElement<{ onClick?: () => void }>; // Ensure children can accept an onClick prop
}) => {

    const [isOpen, setOpenDialog] = useState<boolean>(false);

    const handleClick = () => {
        setOpenDialog(true);
    };

    return (
        <>
            {React.cloneElement(children, { onClick: handleClick })}
            <DeleteDialog
                teamId={teamId}
                isOpen={isOpen}
                onOpenChange={() => setOpenDialog(!isOpen)}
            />
        </>
    );
}

const DeleteDialog = ({
    isOpen,
    teamId,
    onOpenChange,

}: {
    isOpen: boolean;
    teamId: string;
    onOpenChange: (open: boolean) => void;
}) => {
    const router = useRouter();

    const actionHandler = async () => {
        const r = await deleteTeam(teamId);
        r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/teams`);
        router.back();
    }

    return (
        <ActionDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Delete Team"
            description="Are you sure you want to delete this team?"
            actionName="Delete"
            actionHandler={actionHandler}
            dangerMode={true}
        >
            <p className="text-red-600">This action cannot be undone.</p>
        </ActionDialog>
    )
};