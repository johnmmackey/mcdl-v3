"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Meet, Season } from '@/app/lib/definitions'
import { fetchTeamsForSeason, updateMeet, createMeet, deleteMeet } from '@/app/lib/data';


import { Button } from '@/components/ui/button'
import { FormFieldInput, FormFieldDatePicker, FormFieldSelect, FormFieldMultiSelect } from '@/app/ui/FormFields';

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
    meet: Omit<Meet, 'teams'> & { teamList: string[] },
    seasons: Season[]
}>) => {
    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);
    const router = useRouter();

    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s);

    const onSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        await (meet.id
            ? updateMeet(meet.id, data)
            : createMeet(data)
        );

        router.push(`/meets`);
    }

    //console.log('MeetForm render with meet:', meet);
    //console.log('encoded meet data:', ioSchema.decode(meet));

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: inputSchema.decode(meet)//inputSchema.decode(meet)
    });

    const [seasonId, meetType, divisionId] = useWatch({
        control: form.control,
        name: ["seasonId", "meetType", "divisionId"]
    })
    console.log('rendering')


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

    return (
        <>
            <form id='meetForm' onSubmit={form.handleSubmit(onSubmit)}>

                <FormFieldSelect form={form} name="seasonId" label="Season ID" options={sortedSeasons.map(s => s.toString())} valueAsNumber />
                <FormFieldDatePicker name="meetDate" label="Meet Date" form={form} />
                <FormFieldSelect form={form} name="meetType" label="Meet Type" options={['Dual', 'Qual', 'Div', 'Star']} />

                {
                    ['Dual', 'Div'].includes(meetType) &&
                    <FormFieldSelect form={form} name="divisionId" label="Division" options={['1', '2', '3', '4', '5']} valueAsNumber />
                }

                {(divisionId || ['Qual', 'Star'].includes(meetType)) &&
                    <>
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
                    </>
                }

                <Button type="button" onClick={() => console.log(form.getValues())}>Dump</Button>

                <Button className={'mt-4'} type="submit" disabled={false}>
                    Submit
                </Button>


            </form>
        </>
    )
}


