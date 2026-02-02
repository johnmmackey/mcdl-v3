"use client";

import { ActionDialog3} from "@/app/ui/ActionDialog";
import { useRouter } from "next/navigation";
import { deleteTeam } from "@/app/lib/api/teams";
import { toast } from "sonner";

export const TeamDeleteAD = ({
    teamId,
    children
}: {
    teamId: string;
    children: React.ReactNode;
}) => {
    const router = useRouter();

    const actionHandler = async () => {
        const r = await deleteTeam(teamId);
        r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/teams`);
        router.back();
    }

    return (
        <ActionDialog3
            title="Delete Team"
            description="Are you sure you want to delete this team?"
            actionName="Delete"
            actionHandler={actionHandler}
            dangerMode={true}
            trigger={children}
        >
            <p className="text-red-600">This action cannot be undone.</p>
        </ActionDialog3>
    )
};