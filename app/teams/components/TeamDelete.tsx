"use client";

import { ActionDialog2 } from "@/app/ui/ActionDialog";
import { useRouter } from "next/navigation";
import { deleteTeam } from "@/app/lib/api/teams";
import { toast } from "sonner";

export const TeamDelete = ({
    teamId,

}: {
    teamId: string;
}) => {
    const router = useRouter();

    const actionHandler = async () => {
        const r = await deleteTeam(teamId);
        r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/teams`);
        router.back();
    }

    return (
        <ActionDialog2
            id="team-delete-trigger"
            title="Delete Team"
            description="Are you sure you want to delete this team?"
            actionName="Delete"
            actionHandler={actionHandler}
            dangerMode={true}

        >
            <p className="text-red-600">This action cannot be undone.</p>
        </ActionDialog2>
    )
};