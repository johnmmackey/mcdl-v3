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

type DialogNames = 'labels' | 'billing' | 'delete' | null;

export const MeetActionsDropDown = ({ meet }: { meet: MeetWithTeams }) => {
    const [openDialog, setOpenDialog] = useState(null as DialogNames);

    const handleDialogClose = () => {
        setOpenDialog(null);
    };

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
                        <DropdownMenuItem onClick={() => setOpenDialog('labels')}>Labels</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/meets/${meet.id}/edit`} className="text-sm">
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenDialog('delete')}>Delete</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <LabelsDialog
                isOpen={openDialog === 'labels'}
                onOpenChange={(open) => setOpenDialog(open ? 'labels' : null)}
                meetId={meet.id}
            />
            <DeleteDialog
                isOpen={openDialog === 'delete'}
                onOpenChange={(open) => setOpenDialog(open ? 'delete' : null)}
                meetId={meet.id}
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
    isOpen,
    meetId,
    onOpenChange,

}: {
    isOpen: boolean;
    meetId: number;
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

    const actionHandler = async () => {
        let l = await fetchLabels(meetId, labelSettings)
        await saveToFile(l, `meet-${meetId}-labels.pdf`);
    }

    return (
        <ActionDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Generate Labels"
            description="Generate and download labels for this meet."
            actionName="Generate"
            actionHandler={actionHandler}
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


const DeleteDialog = ({
    isOpen,
    meetId,
    onOpenChange,

}: {
    isOpen: boolean;
    meetId: number;
    onOpenChange: (open: boolean) => void;
}) => {
    const router = useRouter();

    const actionHandler = async () => {
        await deleteMeet(meetId);
        router.back();
    }

    return (
        <ActionDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Delete Meet"
            description="Are you sure you want to delete this meet?"
            actionName="Delete"
            actionHandler={actionHandler}
            dangerMode={true}
        >
            <p className="text-red-600">This action cannot be undone.</p>
        </ActionDialog>
    )
};
