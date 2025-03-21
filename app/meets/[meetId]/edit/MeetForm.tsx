"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, } from '@mantine/core';

import { Form, useForm, useWatch } from "react-hook-form"
import { DevTool } from "@hookform/devtools";
import { TextInput, Select, DateTimePicker, MultiSelect } from "react-hook-form-mantine"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Meet, MeetTeam, TeamSeason, MeetUpdateInput, MeetCreateInput, Season } from '@/app/lib/definitions'

import { TeamSelect } from './teamSelect';
import { fetchTeamSeasons, updateMeet, createMeet, deleteMeet } from '@/app/lib/data';

const nullToEmptyStr = (v: number | string | null | undefined) => v ?? '';
const numToStr = (v: number) => v.toString();

const toFormStr = (v: number | string | null | undefined) => {
    if (typeof v === "number")
        return v.toString();
    if (typeof v === "string")
        return v;
    return '';
};

class zx {
    static string(): z.ZodEffects<z.ZodString, string, unknown> {
      return z.preprocess((arg) => {
        if (arg === null || arg === undefined) {
          return "";
        }
  
        if (typeof arg === "string") {
          return arg;
        }
        if (typeof arg === "number") {
          return arg.toString();
        }
  
        return "";
      }, z.string());
    }
  }

export const MeetForm = ({
    meet,
    meetId,
    seasons
}: Readonly<{
    meet: Meet | null,
    meetId: number | null,
    seasons: Season[]
}>) => {

    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s.toString());

    const inSchema = z.object({
        seasonId: z.coerce.string().default('2025'),
        name: zx.string(),
        meetDate: z.date().default(new Date()),
        entryDeadline: z.date().nullable().default(new Date()),
        meetType: z.string().default('Dual'),
        divisionId: zx.string(),
        hostPool: zx.string(),
        coordinatorPool: zx.string(),
        teams: z.object({teamId: z.string()}).array().transform(ts => ts.map(t => t.teamId)).default([])
    });

    const validationSchema = z.object({
        seasonId: z.string(),
        name: z.string(),
        meetDate: z.date().nullish(),
        entryDeadline: z.date().nullish(),
        meetType: z.string(),
        divisionId: z.string(),
        hostPool: z.string(),
        coordinatorPool: z.string(),
        teams: z.string().array()
    });

    const outMeetSchema = z.object({
        seasonId: z.coerce.number(),
        name: z.string(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.coerce.number(),
        hostPool: z.string(),
        coordinatorPool: z.string()
    });

    // flatten teams to a simgple array of strings
    const outTeamsSchema = z.object({
        teams: z.string().array()
    }).transform(ts => ts.teams);

    type FormSchemaType = z.infer<typeof validationSchema>;

    const { setValue, getValues, watch, control, formState: { errors } } = useForm<FormSchemaType>({
        resolver: zodResolver(validationSchema),
        defaultValues: inSchema.parse(meet ?? {})
    });

    const showEntryDeadline = ['Div', 'Star'].includes(watch('meetType'));
    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        console.log('fetching teams for ', watch('seasonId'))
        fetchTeamSeasons(parseInt(watch('seasonId')))
            .then(r => {
                const ts = r.map(r => r.teamId).sort()
                setActiveTeamIds(ts);
                if(!ts.includes(getValues('hostPool')))
                    setValue('hostPool', '');
                if(!ts.includes(getValues('coordinatorPool')))
                    setValue('coordinatorPool', '');
                setValue('teams', getValues('teams').filter(e => ts.includes(e)));
            });
    }, [watch('seasonId')]);

    const handleSubmit = ({ data }: { data: FormSchemaType }) => {
        console.log(data)
        const outMeetData = outMeetSchema.parse(data);
        const outTeamsData = outTeamsSchema.parse(data);

        return (meetId ? updateMeet(meetId, outMeetData, outTeamsData) : createMeet(outMeetData, outTeamsData))
            //.then(updatedMeet => {console.log('updatedMeet', updatedMeet); return updateMeetTeams(updatedMeet.id, mTeams)})
            .then(() => router.push(`/meets`));
    }

    const handleDelete = () => {
        if (meetId)
            deleteMeet(meetId)
                //.then(updatedMeet => {console.log('updatedMeet', updatedMeet); return updateMeetTeams(updatedMeet.id, mTeams)})
                .then(() => router.push(`/meets`));
    }

    return (
        <>
            <Form
                control={control}
                onSubmit={handleSubmit}
            >
                <Select
                    name="seasonId"
                    label="Season"
                    className="my-4"
                    data={sortedSeasons}
                    control={control}
                    disabled={!!meetId}
                />

                <TextInput
                    name="name"
                    className="my-4"
                    label="Meet Name"
                    placeholder="Meet Name"
                    control={control}
                />

                <DateTimePicker
                    name="meetDate"
                    label="Meet Date"
                    placeholder="Pick date and time"
                    className="my-4"
                    control={control}
                />

                <Select
                    name="meetType"
                    label="Meet Type"
                    className="my-4"
                    data={['Dual', 'Qual', 'Div', 'Star']}
                    control={control}
                />

                {showEntryDeadline &&
                    <DateTimePicker
                        name="entryDeadline"
                        label="Entry Deadline"
                        placeholder="Pick date and time"
                        className="my-4"
                        control={control}
                    />
                }

                <Select
                    name="divisionId"
                    label="Division"
                    className="my-4"
                    data={[
                        { value: "", label: "Non-divisional Meet" },
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" }
                    ]}
                    control={control}
                />

                <Select
                    name="hostPool"
                    label="Host Pool"
                    className="my-4"
                    data={[{value: '', label: '<none>'}].concat(activeTeamIds.map(e => ({label: e, value: e})))}
                    control={control}
                />

                <Select
                    name="coordinatorPool"
                    label="Coordinator Pool"
                    className="my-4"
                    data={[{value: '', label: '<none>'}].concat(activeTeamIds.map(e => ({label: e, value: e})))}
                    control={control}
                />

                <MultiSelect
                    name="teams"
                    label="Teams"
                    className="my-4"
                    data={activeTeamIds}
                    control={control}
                />
                <Button className={'mt-4'} type="submit" disabled={false}>
                    Submit
                </Button>

                {meetId &&
                    <Button className={'mt-4'} disabled={false} variant='danger' onClick={handleDelete}>
                        Delete Meet
                    </Button>
                }

            </Form>
            {/*
            <DevTool control={control} placement="top-right" />
            */}
            <div>
                {JSON.stringify(errors)}
            </div>
        </>
    )
}


