"use client";
import { useState } from "react";

import { ActionDialog } from "@/app/ui/ActionDialog";
import { useRouter } from "next/navigation";
import { deleteTeam } from "@/app/lib/api/teams";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";


export const TeamDelete = ({
    teamId
}: {
    teamId: string;
}) => {
    type DialogNames = 'delete' | null;


    const [openDialog, setOpenDialog] = useState(null as DialogNames);

    const handleDialogClose = () => {
        setOpenDialog(null);
    };

    return (
        <>
            <Button size="icon" variant="outline" onClick={() => setOpenDialog('delete')}><Trash2 /></Button>
            <DeleteDialog
                teamId={teamId}
                isOpen={openDialog === 'delete'}
                onOpenChange={(open) => setOpenDialog(open ? 'delete' : null)}
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