"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, } from '@mantine/core';

import { Form, useForm, useWatch } from "react-hook-form"
import { DevTool } from "@hookform/devtools";
import { TextInput, Select, DateTimePicker } from "react-hook-form-mantine"

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
        name: z.string().default(''),
        meetDate: z.date().default(new Date()),
        entryDeadline: z.date().default(new Date()),
        meetType: z.string().default('Dual'),
        divisionId: z.coerce.string().default(''),
        hostPool: z.string().default(''),
        coordinatorPool: z.string().default('')
    });

    const validationSchema = z.object({
        seasonId: z.string(),
        name: z.string(),
        meetDate: z.date().nullish(),
        entryDeadline: z.date().nullish(),
        meetType: z.string(),
        divisionId: z.string(),
        hostPool: z.string(),
        coordinatorPool: z.string()
    });

    const outSchema = z.object({
        seasonId: z.coerce.number(),
        name: z.string().nullable(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.coerce.number().nullable(),
        hostPool: z.string().nullable(),
        coordinatorPool: z.string().nullable()
    })

    type FormSchemaType = z.infer<typeof validationSchema>;

    const { setValue, getValues, watch, control, formState: { errors } } = useForm<FormSchemaType>({
        resolver: zodResolver(validationSchema),
        defaultValues: inSchema.parse(meet ?? {})
    });

    const showEntryDeadline = ['Div', 'Star'].includes(watch('meetType'));

    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);

    useEffect(() => {
        console.log('fetching teams for ', watch('seasonId'))
        fetchTeamSeasons(parseInt(watch('seasonId')))
            .then(r => {
                const ts = r.map(r => r.teamId).sort()
                setActiveTeamIds(ts);
                console.log('resetting host and coordinator pool values')
                if(!ts.includes(getValues('hostPool')))
                    setValue('hostPool', '');
                if(!ts.includes(getValues('coordinatorPool')))
                    setValue('coordinatorPool', '');
                setMTeams(mTeams.filter(e => ts.includes(e)));
            });
    }, [watch('seasonId')]);


    const [mTeams, setMTeams] = useState<string[]>(meet?.teams.map(mt => mt.teamId) || []);
    const router = useRouter();

    const handleSubmit = ({ data }: { data: FormSchemaType }) => {
        console.log(data)
        const outData = outSchema.parse(data);

        return (meetId ? updateMeet(meetId, outData, mTeams) : createMeet(outData, mTeams))
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

                <TeamSelect teams={activeTeamIds} mTeams={mTeams} setMTeams={setMTeams} />
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


