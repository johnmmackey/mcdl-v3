"use client";

import React, { useState, useEffect } from 'react';
import { Grid, GridCol, NumberInput, TextInput, Checkbox } from '@mantine/core';
import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import { AgeGroupIterator, IGroupElement, IGroupHeader } from '../MeetComponents';
import { AgeGroup, Meet, Team, Entry, DiverScore } from '@/app/lib/definitions';
import strcmp from '@/app/lib/strcmp'

type Inputs = Record<string, any>

export default ({
    ageGroups,
    meet,
    teams,
    meetEntries,
    meetResults
}: Readonly<{
    ageGroups: AgeGroup[],
    meet: Meet,
    teams: Team[],
    meetEntries: Entry[],
    meetResults: DiverScore[]
}>) => {

    const form = useForm();
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

    return (
        <form>
            <AgeGroupIterator
                ageGroups={ageGroups}
                meet={meet}
                iteree={meetEntries}
                field='ageGroupId'
                GroupHeader={ScoringHeader}
                GroupElement={ScoringElement}
                groupSort={(a: Entry, b: Entry) => strcmp(a.poolcode + a.lastName + a.firstName, b.poolcode + b.lastName + b.firstName)}
                eProps={{form, meetResults}}
            />
            <button type="submit" disabled={false}>
                Submit
            </button>

        </form>

    )
}



const ScoringHeader = () => (
    <Grid columns={10}>
        <GridCol span={1} className='font-semibold'>Pool</GridCol>
        <GridCol span={3} className='font-semibold'>Diver</GridCol>
        <GridCol span={1} className='font-semibold'>EX</GridCol>
        <GridCol span={2} className='font-semibold'>Score</GridCol>
        <GridCol span={1} className='font-semibold'>DiveUp</GridCol>
        <GridCol span={2} className='font-semibold'>Wildcard</GridCol>
    </Grid>
)

const ScoringElement = ({ ag, e, eProps: {form, meetResults} }: IGroupElement) => {
    const iV = meetResults?.find((iv: DiverScore) => iv.diverId === e.id);

    const iVEx = !!iV?.exhibition;
    const iVDu = iV && (iV.ageGroupId !== ag.id);

    let [ex, setEx] = useState(iVEx);
    let [du, setDu] = useState(iVDu);

    let exNew = useWatch({
        control: form.control,
        name: e.id.toString() + '-ex',
        defaultValue: iVEx
    });

    let duNew = useWatch({
        control: form.control,
        name: e.id.toString() + '-du',
        defaultValue: iVDu
    });

    useEffect(() => {
        setEx(exNew);
        setDu(duNew);
        if (exNew)
            form.setValue(e.id.toString() + '-du', false);
        if (exNew || !duNew)
            form.setValue(e.id.toString() + '-wc', '');
    }, [form, exNew, duNew, setEx, setDu]);

    if (e.id == 5384) {
        console.log('***', ex, du)
    }

    return (
        <Grid columns={10} className='hover:bg-slate-200'>
            <GridCol span={1} className='mt-2'>{e.poolcode}</GridCol>
            <GridCol span={3} className='mt-2'>{e.firstName} {e.lastName}</GridCol>

            <GridCol span={1} className='mt-2'>
                <Checkbox defaultChecked={iVEx} {...form.register(e.id.toString() + '-ex')} />
            </GridCol>
            <GridCol span={2}>
                <TextInput className='w-24' defaultValue={iV?.score || ''}{...form.register(e.id.toString() + '-score')} />
            </GridCol>

            <GridCol span={1} className='mt-2'>
                <Checkbox defaultChecked={iVDu} {...form.register(e.id.toString() + '-du')} disabled={ex} />
            </GridCol>

            <GridCol span={2} className='w-24'>
                <TextInput className='w-24' defaultValue={iV?.diverAgeGroupScore || ''} {...form.register(e.id.toString() + '-wc')} disabled={!du} />
            </GridCol>

        </Grid>
    )
}

