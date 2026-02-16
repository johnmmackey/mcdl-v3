"use client";

import { JSX, useState } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { ActionButton } from "@/app/ui/StandardButtons";
import { MeetWithTeamsAndScoreCount } from "@/app/lib/types";

import { ChevronDown } from "lucide-react";
import { usePermissions } from "@/app/lib/usePermissions";

import * as Dialogs from "./MeetActionsDialogs";

enum MeetState {
    UNSCORED,
    SCORED,
    PUBLISHED,
}

type MeetAction = {
    id: string;
    label: string;
    requiredPermission?: string;
    requiredMeetState?: MeetState[];
    route?: string;
    dialog?: (props: { meetId: number; open: boolean; onOpenChange: (open: boolean) => void }) => JSX.Element | null;
}

const meetActions: MeetAction[] = [
    {
        id: 'generateLabels',
        label: 'Generate Labels',
        requiredPermission: 'meet:generateLabels',
        dialog: Dialogs.LabelsDialog
    },
    {
        id: 'scoreMeet',
        label: 'Score Meet',
        requiredMeetState: [MeetState.UNSCORED, MeetState.SCORED],
        route: '/scoring',
    },
    {
        id: 'publish',
        label: 'Publish',
        requiredPermission: 'meet:publish',
        requiredMeetState: [MeetState.SCORED],
        dialog: Dialogs.PublishMeetDialog,
    },
    {
        id: 'unpublish',
        label: 'Unpublish',
        requiredPermission: 'meet:unpublish',
        requiredMeetState: [MeetState.PUBLISHED],
        dialog: Dialogs.UnPublishMeetDialog,
    },
    {
        id: 'edit',
        label: 'Edit',
        requiredPermission: 'meet:addOrUpdate',
        requiredMeetState: [MeetState.UNSCORED],
        route: '/edit',
    },
    {
        id: 'delete',
        label: 'Delete',
        requiredPermission: 'meet:delete',
        requiredMeetState: [MeetState.UNSCORED],
        dialog: Dialogs.DeleteMeetDialog,
    },
];

export const MeetActionsDropDown = ({ meet }: { meet: MeetWithTeamsAndScoreCount }) => {

    const [openDialog, setOpenDialog] = useState('');
    const [loading, hasPermission] = usePermissions('meets', meet.id);
    const router = useRouter();

    const meetState = meet.scoresPublished ? MeetState.PUBLISHED : (meet._count.scores > 0 ? MeetState.SCORED : MeetState.UNSCORED);

    // Make a list of the options available based on permissions and meet state
    const availableActions = meetActions.filter(action =>
        (!action.requiredPermission || hasPermission(action.requiredPermission))
        && (!action.requiredMeetState || action.requiredMeetState.includes(meetState)))

    const handleSelect = (action: MeetAction) => {
        if (action.dialog) {
            setOpenDialog(action.id);
        } else if (action.route) {
            router.push(`/meets/${meet.id}${action.route}`);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={loading} hidden={availableActions.length === 0}>
                    <ActionButton>
                        <span className="hidden md:inline">Actions</span>
                        <ChevronDown />
                    </ActionButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {availableActions.map(action => (
                            <DropdownMenuItem
                                key={action.id}
                                onSelect={() => handleSelect(action)}
                            >
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Inject the dialogs here */}
            {availableActions.filter(a => a.dialog).map(action => {
                const DialogComponent = action.dialog!;
                return (
                    <DialogComponent
                        key={action.id}
                        meetId={meet.id}
                        open={openDialog === action.id}
                        onOpenChange={(open) => setOpenDialog(open ? action.id : '')}
                    />
                );
            })}
        </>
    )
}
