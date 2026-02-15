"use client";

import { useState } from "react";
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

import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"

import { ActionButton } from "@/app/ui/StandardButtons";
import { MeetWithTeams } from "@/app/lib/types";

import { fetchLabels, deleteMeet, setPublishedStatus } from "@/app/lib/api/meets"
import { saveToFile } from "@/app/lib/saveToFile"
import { ActionDialog } from "@/app/ui/ActionDialog";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/app/lib/usePermissions";



export const MeetActionsDropDown = ({ meet }: { meet: MeetWithTeams }) => {

    const [openDialog, setOpenDialog] = useState('');
    const [loading, hasPermission] = usePermissions('meets', meet.id);
    const router = useRouter();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={loading} hidden={
                    !hasPermission('meet:generateLabels')
                    && (!hasPermission('meet:publish') || !!meet.scoresPublished)
                    && !hasPermission('meet:unpublish')
                    && !hasPermission('meet:addOrUpdate')
                    && !hasPermission('meet:delete')
                }>
                    <ActionButton>
                        <span className="hidden md:inline">Actions</span>
                        <ChevronDown />
                    </ActionButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>

                        <DropdownMenuItem onSelect={() => setOpenDialog('labels')} hidden={!hasPermission('meet:generateLabels')}>
                            Labels
                        </DropdownMenuItem>

                        <DropdownMenuItem hidden={!hasPermission('meet:scoreMeet')|| !!meet.scoresPublished} onClick={() => router.push(`/meets/${meet.id}/scoring`)}>

                                Score

                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => setOpenDialog('publish')} hidden={!!meet.scoresPublished || !hasPermission('meet:publish')}>
                            Publish
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => setOpenDialog('unpublish')} hidden={!meet.scoresPublished || !hasPermission('meet:unpublish')}>
                            Unpublish
                        </DropdownMenuItem>

                        <DropdownMenuItem hidden={!hasPermission('meet:addOrUpdate')}>
                            <Link href={`/meets/${meet.id}/edit`} className="text-sm">
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => setOpenDialog('delete')} hidden={!hasPermission('meet:delete')}>
                            Delete
                        </DropdownMenuItem>

                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <LabelsDialog
                meetId={meet.id}
                open={openDialog === 'labels'}
                onOpenChange={(open) => setOpenDialog(open ? 'labels' : '')}
            />

            <DeleteMeetDialog
                meetId={meet.id}
                open={openDialog === 'delete'}
                onOpenChange={(open) => setOpenDialog(open ? 'delete' : '')}
            />
            <PublishMeetDialog
                meetId={meet.id}
                open={openDialog === 'publish'}
                onOpenChange={(open) => setOpenDialog(open ? 'publish' : '')}
            />
            <UnPublishMeetDialog
                meetId={meet.id}
                open={openDialog === 'unpublish'}
                onOpenChange={(open) => setOpenDialog(open ? 'unpublish' : '')}
            />
        </>
    )
}


// Label options configuration
const labelOptions = [
    { id: 'spares-fill', label: 'Fill last sheet with spare labels' },
    { id: 'spares-extra', label: 'Generate extra spare labels' },
] as const;

type LabelOptionId = typeof labelOptions[number]['id'];

const LabelsDialog = ({
    meetId,
    open,
    onOpenChange
}: {
    meetId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {

    // Single state object for all checkboxes
    const [labelSettings, setLabelSettings] = useState<Record<LabelOptionId, boolean>>({
        'spares-fill': false,
        'spares-extra': false,
    });

    // Single handler for all checkboxes
    const handleCheckboxChange = (id: LabelOptionId, checked: boolean) => {
        setLabelSettings(prev => ({ ...prev, [id]: checked }));
    };

    if (!open) return null;

    return (
        <ActionDialog
            isOpen={open}
            onOpenChange={onOpenChange}
            title="Generate Labels"
            description="Generate and download labels for this meet."
            actionName="Generate"
            onAction={async () => {
                let l = await fetchLabels(meetId, labelSettings)
                await saveToFile(l, `meet-${meetId}-labels.pdf`);
            }}
        >
            <FieldGroup className="w-full max-w-xs">
                <FieldSet>
                    <FieldDescription>
                        Select options:
                    </FieldDescription>
                    <FieldGroup className="gap-3">
                        {labelOptions.map(option => (
                            <Field key={option.id} orientation="horizontal">
                                <Checkbox
                                    id={option.id}
                                    checked={labelSettings[option.id]}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange(option.id, checked === true)
                                    }
                                />
                                <FieldLabel
                                    htmlFor={option.id}
                                    className="font-normal"
                                >
                                    {option.label}
                                </FieldLabel>
                            </Field>
                        ))}
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </ActionDialog>
    )
};



export const DeleteMeetDialog = ({
    meetId,
    open,
    onOpenChange
}: {
    meetId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const router = useRouter();

    if (!open) return null;

    return (
        <ActionDialog
            isOpen={open}
            onOpenChange={onOpenChange}
            title="Delete Meet"
            description="Are you sure you want to delete this meet?"
            actionName="Delete"
            onAction={async () => {
                const r = await deleteMeet(meetId);
                r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.back();
            }}
            dangerMode
        >
            <p className="text-red-600">This action cannot be undone.</p>
        </ActionDialog>
    );
};

export const PublishMeetDialog = ({
    meetId,
    open,
    onOpenChange
}: {
    meetId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    if (!open) return null;

    return (
        <ActionDialog
            isOpen={open}
            onOpenChange={onOpenChange}
            title="Publish Meet"
            description="Are you sure you want to publish this meet?"
            actionName="Publish"
            onAction={async () => {
                const r = await setPublishedStatus(meetId, true);
                r.error && toast.error(`Publish failed: ${r.error.msg}`);
            }}
        >
            <p className="">This finalizes the meet and makes the results publically visible.</p>
        </ActionDialog>
    );
};

export const UnPublishMeetDialog = ({
    meetId,
    open,
    onOpenChange
}: {
    meetId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const router = useRouter();

    if (!open) return null;

    return (
        <ActionDialog
            isOpen={open}
            onOpenChange={onOpenChange}
            title="Unpublish Meet"
            description="Are you sure you want to UNPUBLISH this meet?"
            actionName="Unpublish"
            onAction={async () => {
                const r = await setPublishedStatus(meetId, false);
                r.error ?? toast.error(`Unpublish failed: ${r.error!.msg}`) ;
            }}
        >
            <p className="">This allows the meet scores to be changed.</p>
        </ActionDialog>
    );
};