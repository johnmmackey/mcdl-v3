"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Season } from '@/app/lib/definitions'
import { Meet } from '@/app/lib/Meet';
import { fetchTeamsForSeason, updateMeet, createMeet, deleteMeet } from '@/app/lib/data';


import { Button } from '@/components/ui/button'
import { FormFieldInput, FormFieldDatePicker, FormFieldSelect, FormFieldMultiSelect } from '@/app/ui/FormFields';

const intToStringCodec = z.codec(
    z.number().nullable(),
    z.string(),
    {
        decode: (v) => v !== null ? v.toString() : "",
        encode: (v) => v ? parseInt(v) : null
    }
)

const intToStringNNCodec = z.codec(
    z.number(),
    z.string(),
    {
        decode: (v) => v !== null ? v.toString() : "",
        encode: (v) => parseInt(v)
    }
)

const ioSchema = z.object({
    seasonId: intToStringNNCodec,
    meetDate: z.iso.datetime({ offset: true }),
    meetType: z.string(),

    name: z.string().nullable(),

    entryDeadline: z.iso.datetime({ offset: true }),
    divisionId: z.number().nullable(),
    hostPool: z.string().nullable(), 
    coordinatorPool: z.string().nullable(),

    teams: z.codec(
        z.object({ teamId: z.string() }).array(),
        z.string().array(),
        {
            decode: (ts) => ts.map(t => t.teamId),
            encode: (ts) => ts.map(t => ({ teamId: t }))
        }
    )
});

// define the schema for the form
const formValidationSchema = z.object({
    seasonId: z.string(),
    meetDate: z.iso.datetime(),
    meetType: z.string(),

    name: z.string().nullable(),

    entryDeadline: z.iso.datetime(),
    divisionId: z.number().nullable(),
    hostPool: z.string().nullable(),
    coordinatorPool: z.string().nullable(),

    teams: z.string().array(),

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
        if (val.meetType === 'Dual' && val.teams.length !== 2) {
            ctx.addIssue({
                code: "custom",
                path: ['teams'],
                message: `Dual Meets must have 2 teams`,
            });
        }
        if (['Qual', 'Star', 'Div'].includes(val.meetType) && val.teams.length < 2) {
            ctx.addIssue({
                code: "custom",
                path: ['teams'],
                message: `This meet type must have at least 2 teams`,
            });
        }
    });;



export const MeetForm = ({
    meet,
    seasons,
}: Readonly<{
    meet: Meet,
    seasons: Season[]
}>) => {
    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);
    const router = useRouter();

    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s);

    const onSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        const encData = ioSchema.omit({teams: true}).encode(data);
        console.log('Submitting meet data:', encData);

        if(['Star', 'Qual'].includes(data.meetType))
            encData.divisionId = null;

        const newMeet = await (meet.id
            ? updateMeet(meet.id, encData, data.teams)
            : createMeet(encData, data.teams)
        );

        router.push(`/meets`);
    }

//console.log('MeetForm render with meet:', meet);
//console.log('encoded meet data:', ioSchema.decode(meet));

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: ioSchema.decode(meet)
    });

    const [seasonId, meetType] = useWatch({
        control: form.control,
        name: ["seasonId", "meetType"]
    })


    // Logic to load relevant teams and remove a team who is no longer active in the season if the season changes
    useEffect(() => {
        fetchTeamsForSeason(Number((form.getValues('seasonId'))))
            .then(r => {
                //const ts = r.map(r => ([r.teamId, r.team.name])).sort((a, b) => a[0].localeCompare(b[0]));
                const ts = r.map(r => r.teamId).sort((a, b) => a.localeCompare(b));
                setActiveTeamIds(ts);
                if (form.getValues('hostPool') && !ts.includes(form.getValues('hostPool')!))
                    form.setValue('hostPool', null);
                if (form.getValues('coordinatorPool') && !ts.includes(form.getValues('coordinatorPool')!))
                    form.setValue('coordinatorPool', null);
                form.setValue('teams', form.getValues('teams').filter((e: string) => ts.includes(e)));
            });
    }, [seasonId]);

    return (
        <>
            <form id='meetForm' onSubmit={form.handleSubmit(onSubmit)}>

                <FormFieldSelect form={form} name="seasonId" label="Season ID" options={sortedSeasons.map(s => s.toString())} />
                <FormFieldDatePicker name="meetDate" label="Meet Date" form={form} />
                <FormFieldSelect form={form} name="meetType" label="Meet Type" options={['Dual', 'Qual', 'Div', 'Star']} />

                <FormFieldSelect form={form} name="hostPool" label="Host Pool" options={[...activeTeamIds]} includeEmptyChoice nullForEmpty />

                {meetType !== 'Dual' &&
                    <FormFieldInput form={form} name="name" label="Meet Name" />
                }

                {
                    ['Dual', 'Div'].includes(meetType) &&
                    <FormFieldSelect form={form} name="divisionId" label="Division" options={['1', '2', '3', '4', '5']} includeEmptyChoice nullForEmpty valueAsNumber />
                }

                {['Div', 'Star'].includes(meetType) &&
                    <>
                        <FormFieldDatePicker name="entryDeadline" label="Entry Deadline" form={form} />
                        <FormFieldSelect form={form} name="coordinatorPool" label="Coordinator Pool" options={[...activeTeamIds]} includeEmptyChoice nullForEmpty/>
                    </>
                }

                <FormFieldMultiSelect form={form} name="teams" label="Teams" options={activeTeamIds} />

                <Button type="button" onClick={() => console.log(form.getValues())}>Dump</Button>

                <Button className={'mt-4'} type="submit" disabled={false}>
                    Submit
                </Button>


            </form>
        </>
    )
}


