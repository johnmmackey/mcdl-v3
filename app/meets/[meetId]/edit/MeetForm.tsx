"use client";
import React, { useState, } from 'react';
import { useRouter } from 'next/navigation';
import { Button, } from '@mantine/core';

import { Form, useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools";
import { TextInput, Select, DateTimePicker } from "react-hook-form-mantine"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Meet, MeetTeam, TeamSeason, MeetUpdateInput, MeetCreateInput, Season } from '@/app/lib/definitions'

import { TeamSelect } from './teamSelect';
import { updateMeet, createMeet, deleteMeet } from '@/app/lib/data';

const nullToEmptyStr = (v:number|string|null|undefined) => v ?? '';
const numToStr = (v:number) => v.toString();

const toFormStr = (v:number|string|null|undefined) => {
    if(typeof v === "number")
        return v.toString();
    if(typeof v === "string")
        return v;
    return '';
};

export const MeetForm = ({
    seasonId,
    teamSeasons,
    meet,
    meetId,
    teams,
    seasons
}: Readonly<{
    seasonId: number
    teamSeasons: TeamSeason[],
    meet: Meet | null,
    meetId: number | null,
    teams: string[],
    seasons: Season[]
}>) => {

    console.log(JSON.stringify(meet))

    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s.toString());

    const inSchema = z.object({
        seasonId: z.coerce.string().nullish().transform(toFormStr),
        name: z.string().nullish().transform(toFormStr),
        meetDate: z.date().default(new Date()),
        entryDeadline: z.date().default(new Date()),
        meetType: z.string().default('Dual'),
        divisionId: z.coerce.string().nullish().transform(toFormStr),
        hostPool: z.string().nullish().transform(toFormStr),
        coordinatorPool: z.string().nullish().transform(toFormStr)
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

    const validationSchema = z.object({
        seasonId: z.string(),
        name: z.string(),
        meetDate: z.date(),
        entryDeadline: z.date(),
        meetType: z.string(),
        divisionId: z.string(),
        hostPool: z.string(),
        coordinatorPool: z.string()
    });

    type FormSchemaType = z.infer<typeof validationSchema>;

    const { register, control, formState: { errors } } = useForm<FormSchemaType>({
        resolver: zodResolver(validationSchema),
        defaultValues: inSchema.parse(meet || {})
    });

    const [mTeams, setMTeams] = useState<string[]>(teams);
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
                <DateTimePicker
                    name="entryDeadline"
                    label="Entry Deadline"
                    placeholder="Pick date and time"
                    className="my-4"
                    control={control}
                />
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
                    name="meetType"
                    label="Meet Type"
                    className="my-4"
                    data={['Dual', 'Qual', 'Div', 'Star']}
                    control={control}
                />

                <Select
                    name="hostPool"
                    label="Host Pool"
                    className="my-4"
                    data={teamSeasons.map(e => e.teamId).sort()}
                    control={control}
                />
                <Select
                    name="coordinatorPool"
                    label="Coordinator Pool"
                    className="my-4"
                    data={teamSeasons.map(e => e.teamId).sort()}
                    control={control}
                />

                <TeamSelect teams={teamSeasons.map(e => e.teamId)} mTeams={mTeams} setMTeams={setMTeams} />
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


