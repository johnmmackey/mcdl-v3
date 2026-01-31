"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link"
import { fetchLabels } from "@/app/lib/api/meets"
import { Button } from "@/components/ui/button"
import { Processing } from "@/app/ui/Processing"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"

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


// Label options configuration
const labelOptions = [
    { id: 'spares-fill', label: 'Fill last sheet with spare labels' },
    { id: 'spares-extra', label: 'Generate extra spare labels' },
] as const;

type LabelOptionId = typeof labelOptions[number]['id'];

export const MeetActionsDropDown = ({ meet }: { meet: MeetWithTeams }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    
    // Single state object for all checkboxes
    const [labelSettings, setLabelSettings] = useState<Record<LabelOptionId, boolean>>({
        'spares-fill': false,
        'spares-extra': false,
    });

    // Single handler for all checkboxes
    const handleCheckboxChange = (id: LabelOptionId, checked: boolean) => {
        setLabelSettings(prev => ({ ...prev, [id]: checked }));
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleDialogSubmit = () => {
        startTransition(async () => {
            setIsDialogOpen(false);
            // labelSettings now contains all checkbox values
            console.log('Label settings:', labelSettings);
            let l = await fetchLabels(meet.id, labelSettings)
            await saveToFile(l, `meet-${meet.id}-labels.pdf`);
            //r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/meets`);
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <ActionButton>Actions</ActionButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleDialogOpen}>Labels</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/meets/${meet.id}/edit`} className="text-sm">
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate Labels</DialogTitle>
                        <DialogDescription>
                            <FieldGroup className="w-full max-w-xs">
                                <FieldSet>
                                    <FieldLegend variant="label">
                                        Label Options
                                    </FieldLegend>
                                    <FieldDescription>
                                        Select the label options you want to apply.
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
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleDialogClose} variant="outline">Cancel</Button>
                        <Button onClick={handleDialogSubmit} variant="outline">Generate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Processing open={isPending} />
        </>
    )
}



function saveToFile(data: Blob, fileName: string) {
    // Create a temporary download link
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}