"use client";
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button'
import { FormFieldInput, FormFieldCheckBox } from '@/app/ui/FormFields';
import { toast } from 'sonner'

import { Team } from '@/app/lib/types/team'
import { updateTeam, createTeam } from '@/app/lib/api';

import { Processing } from "@/app/ui/Processing"

const formValidationSchema = z.object({
    id: z.string().min(1, "Team Code is required").max(5, "Team Code must be at most 5 characters").regex(/^[A-Z]+$/, "Team Code must be uppercase letters only"),
    name: z.string().min(4, "Team Name is required and must be at least 4 characters").regex(/^[A-Za-z0-9 -]+$/, "Team Name contains invalid characters"),
    clubName: z.string(),
    address1: z.string(),
    address2: z.string(),
    phone: z.string().max(20, "Phone number must be at most 20 characters"),
    url: z.url().or(z.literal('')),
    archived: z.boolean(),
});

const  inputSchema = formValidationSchema
    .omit({ id: true, name: true })
    .extend({
        id: z.string(),
        name: z.string(),
    })  
;


export const TeamForm = ({
    team,
}: Readonly<{
    team: Team,
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: inputSchema.parse(team)
    });


    const handleSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        startTransition(async () => {
            let r = await (team.id ? updateTeam(data) : createTeam(data));
            r.error ? toast.error(`Submission failed: ${r.error.msg}`) : router.push(`/teams`);
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
            

            <div className='flex mx-4 my-4 gap-x-4'>
                <Button type="button" onClick={() => router.push('/teams')} disabled={false} variant='outline'>
                    Cancel
                </Button>

                <Button type="submit" variant="default" disabled={false} >
                    Submit
                </Button>

            </div>

            <Processing open={isPending} />
        </form>
    )
}




