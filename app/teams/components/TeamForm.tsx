"use client";
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button'
import { FormFieldInput, FormFieldCheckBox, FormSubmitCancelButtons } from '@/app/ui/FormFields';
import { toast } from 'sonner'

import { Team } from '@/app/lib/types/team'
import { updateTeam, createTeam } from '@/app/lib/api';

import { Processing } from "@/app/ui/Processing"

// These need to be nullable because the input "team" may have null values for these fields, and react-hook-form will throw an error if the default values don't match the schema

const formValidationSchema = z.object({
    id: z.string().min(1, "Team Code is required").max(5, "Team Code must be at most 5 characters").regex(/^[A-Z]+$/, "Team Code must be uppercase letters only"),
    name: z.string().min(4, "Team Name is required and must be at least 4 characters").regex(/^[A-Za-z0-9 -]+$/, "Team Name contains invalid characters").nullable(),
    clubName: z.string().nullable(),
    address1: z.string().nullable(),
    address2: z.string().nullable(),
    phone: z.string().max(20, "Phone number must be at most 20 characters").nullable(),
    url: z.url().or(z.literal('')).nullable(),
    archived: z.boolean(),
});

export const TeamForm = ({
    team,
}: Readonly<{
    team: Team,
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: team// inputSchema.parse(team)
    });

    const handleSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        startTransition(async () => {
            let r = await (team.id ? updateTeam(data) : createTeam(data));
            r.error ? toast.error(`Submission Failed`, { description: `${r.error.msg}` }) : router.push(`/teams`);
        });
    }

    return (
        <form id='teamForm' onSubmit={form.handleSubmit(handleSubmit)}>

            <FormFieldInput form={form} name="id" label="Team Code" disabled={!!team.id} />
            <FormFieldInput form={form} name="name" label="Team Name" />
            <FormFieldInput form={form} name="clubName" label="Club Name" />
            <FormFieldInput form={form} name="address1" label="Address 1" />
            <FormFieldInput form={form} name="address2" label="Address 2" />
            <FormFieldInput form={form} name="phone" label="Phone" />
            <FormFieldInput form={form} name="url" label="Website URL" />
            <FormFieldCheckBox form={form} name="archived" label="Archived" />
            

            <FormSubmitCancelButtons cancelHref="/teams" />

            <Processing open={isPending} />
        </form>
    )
}




