"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

import { fetchLabels, deleteMeet, setPublishedStatus } from "@/app/lib/api/meets"
import { saveToFile } from "@/app/lib/saveToFile"
import { ActionDialog } from "@/app/ui/ActionDialog";
import { toast } from "sonner";

// Label options configuration
const labelOptions = [
    { id: 'spares-fill', label: 'Fill last sheet with spare labels' },
    { id: 'spares-extra', label: 'Generate extra spare labels' },
] as const;

type LabelOptionId = typeof labelOptions[number]['id'];

export const LabelsDialog = ({
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
                r.error ?? toast.error(`Unpublish failed: ${r.error!.msg}`);
            }}
        >
            <p className="">This allows the meet scores to be changed.</p>
        </ActionDialog>
    );
};