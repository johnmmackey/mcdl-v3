"use client";

import { Grid, GridCol, Button, } from '@mantine/core';

import { Meet, MeetTeam, TeamSeason } from '@/app/lib/definitions'
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

import React, { useEffect, } from 'react';
import { Form, Control, useForm, SubmitHandler, useWatch, UseFormReturn, Controller } from "react-hook-form"
import { DevTool } from "@hookform/devtools";

import { TextInput, NumberInput, Select, DateTimePicker, Checkbox, DatePickerInput } from "react-hook-form-mantine"
import { TeamSelect } from './teamSelect';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";



export const MeetForm = ({
    seasonId,
    teamSeasons
}: Readonly<{
    seasonId: number
    teamSeasons: TeamSeason[]
}>) => {

    const schema = z.object({
        meetName: z.string(),
        meetDate: z.date(),
        meetType: z.string(),
        //divisionId: z.coerce.number().nullable()
        divisionId: z.coerce.number().nullable()
    });

    type FormSchemaType = z.infer<typeof schema>;

    const onSubmit: SubmitHandler<FormSchemaType> = (data) => {

        console.log('in submit handler', data)
    }


    const { register, control, handleSubmit, formState: { errors } } = useForm<FormSchemaType>({
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
                onSubmit={(e) => console.log('data', e.data)}
                onError={(e) => console.log('error', e)}

            //onSubmit={handleSubmit(onSubmit)}
            >
                {/*
                <Controller
                    name="meetName"
                    control={control}
                    render={({ field }) =>
                        <TextInput
                            className="my-4"
                            label="Meet Name"
                            placeholder="Meet Name"
                            {...field}
                        />
                    }
                />
*/}
                <TextInput
                    name="meetName"
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

                <TeamSelect teams={teamSeasons.map(e => e.teamId)} />
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


