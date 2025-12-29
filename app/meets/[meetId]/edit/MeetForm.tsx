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

/*

const nullToEmptyStr = (v: number | string | null | undefined) => v ?? '';
const numToStr = (v: number) => v.toString();

const toFormStr = (v: number | string | null | undefined) => {
    if (typeof v === "number")
        return v.toString();
    if (typeof v === "string")
        return v;
    return '';
};
*/

export const MeetForm = ({
    meet,
    seasons
}: Readonly<{
    meet: Meet,
    seasons: Season[]
}>) => {

    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s);

    // schema for the incoming data
    const inSchema = z.object({
        seasonId: z.number().transform((v) => v.toString()),
        meetDate: z.date(),
        meetType: z.string(),

        name: z.string().nullable().transform(val => val ?? ""),

        entryDeadline: z.date().nullable().transform((s) => s ?? new Date()),
        divisionId: z.coerce.string().nullable().transform(val => val ?? ""),
        hostPool: z.string().nullable().transform(val => val ?? ""),
        coordinatorPool: z.string().nullable().transform(val => val ?? ""),
        week: z.coerce.string().nullable().transform(val => val ?? ""),

        teams: z.object({ teamId: z.string() }).array().transform(ts => ts.map(t => t.teamId)).default([]),

        //parentMeet: z.number().nullable(),
        //scoresPublished: z.date().nullable()
    });

    // define the schema for the form - most things other than dates are strings
    const formValidationSchema = z.object({
        seasonId: z.string(),
        meetDate: z.date(),
        meetType: z.string(),

        name: z.string(),

        entryDeadline: z.date().nullable(),
        divisionId: z.string(),
        hostPool: z.string(),
        coordinatorPool: z.string(),
        week: z.string(),

        teams: z.string().array(),

        //parentMeet: z.number().nullable(),
        //scoresPublished: z.date().nullable()
    })
        .refine((data) => !['Dual', 'Qual'].includes(data.meetType) || data.week, {
            message: "Week not specified for Dual/Qual meet",
            path: ["week"], // path of error
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
            if (['Qual','Star', 'Div'].includes(val.meetType) && val.teams.length < 2) {
                ctx.addIssue({
                    code: "custom",
                    path: ['teams'],
                    message: `This meet type must have at least 2 teams`,
                });
            }
        });;

    /*
        // flatten teams to a simgple array of strings
        const outTeamsSchema = z.object({
            teams: z.string().array()
        }).transform(ts => ts.teams);
    
        let x = formValidationSchema.parse(meet);
    */
    type FormSchemaType = z.infer<typeof formValidationSchema>;

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            ...inSchema.parse(meet),

        }
    });

    const [seasonId, meetType] = useWatch({
        control: form.control,
        name: ["seasonId", "meetType"]
    })

    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);
    const router = useRouter();

    // Login to remove a team who is no longer active in the season if the season changes
    useEffect(() => {
        fetchTeamsForSeason(Number((form.getValues('seasonId'))))
            .then(r => {
                const ts = r.map(r => r.teamId).sort()
                setActiveTeamIds(ts);
                if (form.getValues('hostPool') && !ts.includes(form.getValues('hostPool')!))
                    form.setValue('hostPool', '');
                if (form.getValues('coordinatorPool') && !ts.includes(form.getValues('coordinatorPool')!))
                    form.setValue('coordinatorPool', '');
                form.setValue('teams', form.getValues('teams').filter((e: string) => ts.includes(e)));
            });
    }, [seasonId]);



    const onSubmit = (data: z.infer<FormSchemaType>) => {
        console.log('submitted', data);
        console.log(form.formState);
        return false;
        /*
        const outMeetData = outMeetSchema.parse(data);
        const outTeamsData = outTeamsSchema.parse(data);

        return (meet.id ? updateMeet(meet.id, outMeetData, outTeamsData) : createMeet(outMeetData, outTeamsData))
            //.then(updatedMeet => {console.log('updatedMeet', updatedMeet); return updateMeetTeams(updatedMeet.id, mTeams)})
            .then(() => router.push(`/meets`));
        */
    }



    const handleDelete = () => {
        if (meet.id)
            deleteMeet(meet.id)
                //.then(updatedMeet => {console.log('updatedMeet', updatedMeet); return updateMeetTeams(updatedMeet.id, mTeams)})
                .then(() => router.push(`/meets`));
    }

    return (
        <>
            <form id='meetForm' onSubmit={form.handleSubmit(onSubmit)}>

                <FormFieldSelect form={form} name="seasonId" label="Season ID" options={sortedSeasons.map(s => s.toString())} />
                <FormFieldDatePicker name="meetDate" label="Meet Date" form={form} />
                <FormFieldSelect form={form} name="meetType" label="Meet Type" options={['Dual', 'Qual', 'Div', 'Star']} />

                <FormFieldSelect form={form} name="hostPool" label="Host Pool" options={activeTeamIds} />

                {meetType !== 'Dual' &&
                    <FormFieldInput form={form} name="name" label="Meet Name" />
                }

                {
                    ['Dual', 'Qual'].includes(meetType) &&
                    <FormFieldSelect form={form} name="week" label="Week" options={['1', '2', '3', '4', '5', '6', '7', '8']} />
                }

                {
                    ['Dual', 'Div'].includes(meetType) &&
                    <FormFieldSelect form={form} name="divisionId" label="Division" options={['1', '2', '3', '4', '5']} />
                }

                {['Div', 'Star'].includes(meetType) &&
                    <>
                        <FormFieldDatePicker name="entryDeadline" label="Entry Deadline" form={form} />
                        <FormFieldSelect form={form} name="coordinatorPool" label="Coordinator Pool" options={activeTeamIds} />
                    </>
                }

                <FormFieldMultiSelect form={form} name="teams" label="Teams" options={activeTeamIds} />

                <Button className={'mt-4'} type="submit" disabled={false}>
                    Submit
                </Button>


            </form>
        </>
    )
}


/*
    const inSchema = z.object({
        seasonId: z.number(),
        name: z.string().nullable(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.number().nullable(),
        hostPool: z.string().nullable(),
        coordinatorPool: z.string().nullable(),
        teams: z.object({ teamId: z.string() }).array().transform(ts => ts.map(t => t.teamId)).default([])
    });
 
    const validationSchema = z.object({
        seasonId: z.number(),
        name: z.string().nullish(),
        meetDate: z.date().nullish(),
        entryDeadline: z.date().nullish(),
        meetType: z.string(),
        divisionId: z.number().nullish(),
        hostPool: z.string().nullable(),
        coordinatorPool: z.string().nullable(),
        teams: z.string().array()
    }).superRefine((val, ctx) => {
        if (val.meetType === 'Dual' && val.teams.length !== 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['teams'],
                message: `Dual Meets must have 2 teams`,
            });
        }
    });;
 
    const outMeetSchema = z.object({
        seasonId: z.number(),
        name: z.string(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.coerce.number(),
        hostPool: z.string(),
        coordinatorPool: z.string()
    });
 
 
    const validationSchema1 = z.object({
        seasonId: z.string(),
        name: z.string(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.number().nullable(),
        hostPool: z.string().nullable(),
        coordinatorPool: z.string().nullable(),
        teams: z.string().array()
    }).superRefine((val, ctx) => {
        if (val.meetType === 'Dual' && val.teams.length !== 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['teams'],
                message: `Dual Meets must have 2 teams`,
            });
        }
    });;
*/