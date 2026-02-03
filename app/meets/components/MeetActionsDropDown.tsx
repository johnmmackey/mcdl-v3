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

import { fetchLabels, deleteMeet } from "@/app/lib/api/meets"
import { saveToFile } from "@/app/lib/saveToFile"
import { ActionDialog } from "@/app/ui/ActionDialog";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";



export const MeetActionsDropDown = ({ meet }: { meet: MeetWithTeams }) => {
    const [showLabelsDialog, setShowLabelsDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <ActionButton>
                        <span className="hidden md:inline">Actions</span>
                        <ChevronDown />
                    </ActionButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setShowLabelsDialog(true)}>
                            Labels
                        </DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/meets/${meet.id}/edit`} className="text-sm">
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <LabelsDialog
                meetId={meet.id} 
                open={showLabelsDialog} 
                onOpenChange={setShowLabelsDialog} 
            />
            
            <DeleteMeetDialog 
                meetId={meet.id} 
                open={showDeleteDialog} 
                onOpenChange={setShowDeleteDialog} 
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
            content={
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
            }
            />
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
            content={<p className="text-red-600">This action cannot be undone.</p>}
            dangerMode
        />
    );
};

