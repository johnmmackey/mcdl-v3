"use client";
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button'
import { FormFieldInput, FormFieldDatePicker, FormFieldSelect, FormFieldMultiSelect } from '@/app/ui/FormFields';
import { Toaster, toast } from 'sonner'

import { MeetWithTeams, Season } from '@/app/lib/definitions'
import { fetchTeamsForSeason, updateMeet, createMeet, deleteMeet } from '@/app/lib/data';

import { Processing, AreYouSure } from "@/app/ui/Processing"

const inputSchema = z.object({
    seasonId: z.number(),
    meetDate: z.iso.datetime({ offset: true }),
    meetType: z.string(),

    name: z.string().nullable(),

    entryDeadline: z.iso.datetime({ offset: true }).nullable(),
    divisionId: z.number().nullable(),
    hostPool: z.string().nullable(),
    coordinatorPool: z.string().nullable(),

    teamList: z.string().array()
});

// define the schema for the form
const formValidationSchema = inputSchema
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
        if (val.hostPool && !val.teamList.includes(val.hostPool))
            ctx.addIssue({
                code: "custom",
                path: ['hostPool'],
                message: `Host Pool is not a meet participant`,
            });
    });;



export const MeetForm = ({
    meet,
    seasons,
}: Readonly<{
    meet: Omit<MeetWithTeams, 'teams'> & { teamList: string[] },
    seasons: Season[]
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);
    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s);

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: inputSchema.parse(meet)//inputSchema.decode(meet)
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
                if (form.getValues('hostPool') && !ts.includes(form.getValues('hostPool')!))
                    form.setValue('hostPool', null);
                if (form.getValues('coordinatorPool') && !ts.includes(form.getValues('coordinatorPool')!))
                    form.setValue('coordinatorPool', null);
                form.setValue('teamList', form.getValues('teamList').filter((e: string) => ts.includes(e)));
            });
    }, [seasonId, divisionId, meetType]);

    const handleSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        startTransition(async () => {
            let r = await (meet.id ? updateMeet(meet.id, data) : createMeet(data));
            r.error ? toast.error(`Submission failed: ${r.error.msg}`) : router.push(`/meets`);
        });
    }

    const handleDelete = () => {
        startTransition(async () => {
            let r = await deleteMeet(meet.id!)
            r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/meets`);
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


                    <FormFieldSelect form={form} name="hostPool" label="Host Pool" options={[...activeTeamIds]} includeEmptyChoice nullForEmpty />


                    {meetType !== 'Dual' &&
                        <FormFieldInput form={form} name="name" label="Meet Name" />
                    }

                    {['Div', 'Star'].includes(meetType) &&
                        <>
                            <FormFieldDatePicker name="entryDeadline" label="Entry Deadline" form={form} />
                            <FormFieldSelect form={form} name="coordinatorPool" label="Coordinator Pool" options={[...activeTeamIds]} includeEmptyChoice nullForEmpty />
                        </>
                    }

                    <FormFieldMultiSelect form={form} name="teamList" label="Teams" options={activeTeamIds} />


            <div className='flex mx-4 my-4 gap-x-4'>
                <Button type="button" onClick={() => router.push('/meets')} disabled={false} variant='outline'>
                    Cancel
                </Button>

                <Button type="submit" variant="default" disabled={false} >
                    Submit
                </Button>

                {meet.id && !meet.scoresPublished &&
                    <AreYouSure msg="This action cannot be undone. Are you sure you want to permanently delete this meet?" onConfirm={handleDelete} >
                        <Button type="button" variant="destructive" >Delete Meet</Button>
                    </AreYouSure>
                }
            </div>


            <Processing open={isPending} />
        </form>
    )
}




