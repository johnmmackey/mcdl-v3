"use client";

import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Grid, GridCol, Button, } from '@mantine/core';
//import { TextInput } from '@mantine/form'
import { fetchTeams, fetchMeets, fetchCurrentSeasonId } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, MeetTeam, TeamSeason } from '@/app/lib/definitions'
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

import React, { useEffect, } from 'react';
import { Form, useForm, SubmitHandler, useWatch, UseFormReturn } from "react-hook-form"
import { DevTool } from "@hookform/devtools";

import { TextInput, Select, DateTimePicker, Checkbox } from "react-hook-form-mantine"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    meetName: z.string().nullable(),
    meetDate: z.date(),
    meetType: z.string(),
    divisionId: z.number().nullable(),
    teams: z.string().array()
});

type FormSchemaType = z.infer<typeof schema>;

export const MeetForm = ({
    seasonId,
    teamSeasons
}: Readonly<{
    seasonId: number
    teamSeasons: TeamSeason[]
}>) => {

    /*
        const form = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });
        const router = useRouter();
    */
    const onSubmit: SubmitHandler<any> = (data) => {

        console.log('in submit handler', data)
    }


    const { control } = useForm<FormSchemaType>({
        resolver: zodResolver(schema),
        defaultValues: {
            meetName: '',
            meetType: 'Dual',
            divisionId: null
        }
    });

    return (
        <>
            <Form
                control={control}
                onSubmit={(e) => onSubmit(e)}
                onError={(e) => console.log(e)}
            >
                <TextInput
                    className="my-4"
                    label="Meet Name"
                    placeholder="Meet Name"
                    name={"meetName"}
                    control={control}
                />

                <DateTimePicker
                    label="Meet Date"
                    placeholder="Pick date and time"
                    control={control}
                    name="meetDate"
                    className="my-4"
                />

                <Select
                    label="Division"
                    className="my-4"
                    data={["1", "2", "3", "4", "5"]}
                    name="divisionId"
                    control={control}
                />

                <Select
                    label="Meet Type"
                    className="my-4"
                    data={['Dual', 'Qual', 'Div', 'Star']}
                    name="meetType"
                    control={control}
                />

                <Button className={'mt-4'} type="submit" disabled={false}>
                    Submit
                </Button>

                {teamSeasons.map((ts, k) =>
                    <Checkbox
                        key={k}
                        name="teams"
                        control={control}
                        label={ts.teamId}
                    />

                )}
            </Form>
            <DevTool control={control} placement="top-left" />
        </>
    )
}


