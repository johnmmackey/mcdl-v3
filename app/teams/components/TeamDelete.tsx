"use client";

import { ActionDialog } from "@/app/ui/ActionDialog";
import { useRouter } from "next/navigation";
import { deleteTeam } from "@/app/lib/api/teams";
import { toast } from "sonner";

export const DeleteTeamDialog = ({
    teamId,
    children
}: {
    teamId: string;
    children: React.ReactNode;
}) => {
    const router = useRouter();

    return (
        <ActionDialog
            title="Delete Team"
            description="Are you sure you want to delete this team?"
            actionName="Delete"
            onAction={async () => {
                const r = await deleteTeam(teamId);
                r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/teams`);
            }}
            dangerMode
            content={<p className="text-red-600">This action cannot be undone.</p>}
        >
            {children}
        </ActionDialog>
    );
};