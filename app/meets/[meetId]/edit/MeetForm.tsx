"use client";
import React, {useState,  } from 'react';
import { useRouter } from 'next/navigation';
import { Button, } from '@mantine/core';

import { Form, useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools";
import { TextInput, Select, DateTimePicker} from "react-hook-form-mantine"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Meet, MeetUpdate, MeetTeam, TeamSeason, MeetTeamUpdate } from '@/app/lib/definitions'
import { TeamSelect } from './teamSelect';
import { editMeet } from '@/app/lib/data';

export const MeetForm = ({
    seasonId,
    teamSeasons,
    meet
}: Readonly<{
    seasonId: number
    teamSeasons: TeamSeason[],
    meet: Meet
}>) => {

    const schema = z.object({
        name: z.string().nullable(),
        meetDate: z.date(),
        meetType: z.string(),
        divisionId: z.coerce.number().transform( v => v > 0 ? v : null),
        hostPool: z.string().transform(v => v.length ? v : null)
    });

    type FormSchemaType = z.infer<typeof schema>;

    const { register, control, formState: { errors } } = useForm<FormSchemaType>({
        resolver: zodResolver(schema),
        defaultValues: meet
    });

    const [mTeams, setMTeams] = useState<string[]>(meet.teams.map(e => e.teamId));
    const router = useRouter();

    const handleSubmit = ({ data }: { data: FormSchemaType }) => {

        console.log('in submit handler', data)
        console.log('meet teams', mTeams);

        const newMeet: MeetUpdate = {
            seasonId: seasonId,
            parentMeet: null,
            entryDeadline: null,
            coordinatorPool: null,
            ...data,
        };

        return editMeet(meet.id, newMeet, mTeams)
            .then(() => router.push(`/meets`))
    }

    return (
        <>
            <Form
                control={control}
                onSubmit={handleSubmit}
            >

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

                <TeamSelect teams={teamSeasons.map(e => e.teamId)} mTeams={mTeams} setMTeams={setMTeams} />
                <Button className={'mt-4'} type="submit" disabled={false}>
                    Submit
                </Button>


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


