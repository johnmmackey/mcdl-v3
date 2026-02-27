"use client";
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormFieldInput, FormFieldDatePicker, FormFieldSelect, FormFieldMultiSelect, FormSubmitCancelButtons } from '@/app/ui/FormFields';
import { toast } from 'sonner'

import { MeetCreateUpdateInput } from '@/app/lib/types/meet'
import { Season } from '@/app/lib/types/season';
import { fetchTeamsForSeason, updateMeet, createMeet, deleteMeet } from '@/app/lib/api';

import { Processing } from "@/app/ui/Processing"


// define the schema for the form
const formValidationSchema = z.object({
    seasonId: z.number(),
    meetDate: z.iso.datetime({ offset: true }),
    meetType: z.string(),

    customName: z.string().nullable(),

    entryDeadline: z.iso.datetime({ offset: true }).nullable(),
    divisionId: z.number().nullable(),
    hostPoolId: z.string().nullable(),
    coordinatorPoolId: z.string().nullable(),

    teamList: z.string().array()
})
    .refine((data) => !['Dual', 'Div'].includes(data.meetType) || data.divisionId, {
        message: "Division not specified for Dual/Div meet",
        path: ["divisionId"], // path of error
    })
    .refine((data) => !['Dual', 'Div'].includes(data.meetType) || data.divisionId, {
        message: "Division not specified for Dual/Div meet",
        path: ["divisionId"], // path of error
    })
    .superRefine((val, ctx) => {
        if (val.meetType === 'Dual' && val.teamList.length !== 2) {
            ctx.addIssue({
                code: "custom",
                path: ['teamList'],
                message: `Dual Meets must have 2 teams`,
            });
        }
        if (['Qual', 'Star', 'Div'].includes(val.meetType) && val.teamList.length < 2) {
            ctx.addIssue({
                code: "custom",
                path: ['teamList'],
                message: `This meet type must have at least 2 teams`,
            });
        }
        if (val.hostPoolId && !val.teamList.includes(val.hostPoolId))
            ctx.addIssue({
                code: "custom",
                path: ['hostPoolId'],
                message: `Host Pool is not a meet participant`,
            });
    });;



export const MeetForm = ({
    meetId,
    meet,
    seasons,
}: Readonly<{
    meetId?: number | null,
    meet: MeetCreateUpdateInput,
    seasons: Season[]
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);
    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s);

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: meet
    });

    const [seasonId, meetType, divisionId] = useWatch({
        control: form.control,
        name: ["seasonId", "meetType", "divisionId"]
    })

    // Logic to load relevant teams and remove a team who is no longer active in the season if the season changes
    useEffect(() => {
        if (['Qual', 'Star'].includes(meetType) && form.getValues('divisionId'))
            form.setValue('divisionId', null);
        fetchTeamsForSeason(Number((form.getValues('seasonId'))))
            .then(r => {
                //const ts = r.map(r => ([r.teamId, r.team.name])).sort((a, b) => a[0].localeCompare(b[0]));
                const ts = r.filter(r => !divisionId || r.divisionId === divisionId).map(r => r.teamId).sort((a, b) => a.localeCompare(b));
                setActiveTeamIds(ts);
                if (form.getValues('hostPoolId') && !ts.includes(form.getValues('hostPoolId')!))
                    form.setValue('hostPoolId', null);
                if (form.getValues('coordinatorPoolId') && !ts.includes(form.getValues('coordinatorPoolId')!))
                    form.setValue('coordinatorPoolId', null);
                form.setValue('teamList', form.getValues('teamList').filter((e: string) => ts.includes(e)));
            });
    }, [seasonId, divisionId, meetType]);

    const handleSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        startTransition(async () => {
            let r = await (meetId ? updateMeet(meetId, data) : createMeet(data));
            r.error ? toast.error(`Submission Failed`, { description: `${r.error.msg}` }) : router.push(`/meets`);
        });
    }

    return (
        <form id='meetForm' onSubmit={form.handleSubmit(handleSubmit)}>
            <FormFieldSelect form={form} name="seasonId" label="Season ID" options={sortedSeasons.map(s => s.toString())} valueAsNumber />
            <FormFieldDatePicker name="meetDate" label="Meet Date" form={form} />
            <FormFieldSelect form={form} name="meetType" label="Meet Type" options={['Dual', 'Qual', 'Div', 'Star', 'Exhib']} />

            {
                ['Dual', 'Div'].includes(meetType) &&
                <FormFieldSelect form={form} name="divisionId" label="Division" options={['1', '2', '3', '4', '5']} valueAsNumber />
            }


            <FormFieldSelect form={form} name="hostPoolId" label="Host Pool" options={[...activeTeamIds]} includeEmptyChoice nullForEmpty />

            {/*
            <FormFieldInput form={form} name="defaultName" label="Default Meet Name" disabled/>
            */}
            <FormFieldInput form={form} name="customName" label="Custom Meet Name" />


            {['Div', 'Star'].includes(meetType) &&
                <>
                    <FormFieldDatePicker name="entryDeadline" label="Entry Deadline" form={form} />
                    <FormFieldSelect form={form} name="coordinatorPoolId" label="Coordinator Pool" options={[...activeTeamIds]} includeEmptyChoice nullForEmpty />
                </>
            }

            <FormFieldMultiSelect form={form} name="teamList" label="Teams" options={activeTeamIds} />

            <FormSubmitCancelButtons cancelHref="/meets" />

            <Processing open={isPending} />
        </form>
    )
}




