"use client";

import { ActionDialog } from "@/app/ui/ActionDialog";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/lib/api/users";
import { toast } from "sonner";

export const DeleteUserDialog = ({
    userId,
    trigger
}: {
    userId: string;
    trigger: React.ReactNode;
}) => {
    const router = useRouter();

    return (
        <ActionDialog
            title="Delete User"
            description="Are you sure you want to delete this user?"
            actionName="Delete"
            onAction={async () => {
                const r = await deleteUser(userId);
                r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/users`);
            }}
            dangerMode
            trigger={trigger}
        >
            <p className="text-red-600">This action cannot be undone.</p>
        </ActionDialog>
    );
};