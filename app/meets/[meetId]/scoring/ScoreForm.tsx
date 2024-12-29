"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Grid, GridCol, TextInput, Checkbox } from '@mantine/core';
import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import { AgeGroupIterator, IGroupElement, IGroupHeader } from '../MeetComponents';
import { AgeGroup, Meet, Team, Entry, DiverScore } from '@/app/lib/definitions';
import strcmp from '@/app/lib/strcmp'
import { NumberInput } from '@/app/ui/MyNumberInput'

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

const ScoringElement = ({ ag, e, k, eProps: {form, meetResults} }: IGroupElement) => {
    const iV = meetResults?.find((iv: DiverScore) => iv.diverId === e.id);
    const ref = useRef(null);

    const iVEx = !!iV?.exhibition;
    const iVDu = iV && (iV.ageGroupId !== ag.id);

    let ex = useWatch({
        control: form.control,
        name: e.id.toString() + '-ex',
        defaultValue: iVEx
    });

    let du = useWatch({
        control: form.control,
        name: e.id.toString() + '-du',
        defaultValue: iVDu
    });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          event.preventDefault();
            alert('pressed on element '+k)
        }
      };

    useEffect(() => {
        if (ex)
            form.setValue(e.id.toString() + '-du', false);
        if (ex || !du)
            form.setValue(e.id.toString() + '-wc', '');
    }, [form, ex, du]);

    return (
        <Grid columns={10} className='hover:bg-slate-200'>
            <GridCol span={1} className='mt-2'>{e.poolcode}</GridCol>
            <GridCol span={3} className='mt-2'><span className="text-lg font-semibold">{e.lastName}</span>, {e.firstName}</GridCol>

            <GridCol span={1} className='mt-2'>
                <Checkbox defaultChecked={iVEx} {...form.register(e.id.toString() + '-ex')} />
            </GridCol>
            <GridCol span={2}>
                <NumberInput
                    id={'score-index-'+k.toString()}
                    className='w-16'
                    control={form.control}
                    defaultValue={iV?.score || ''}
                    name={e.id.toString() + '-score'}
                    onKeyDown={handleKeyDown}
                    hideControls
                />
            </GridCol>

            <GridCol span={1} className='mt-2'>
                <Checkbox defaultChecked={iVDu} {...form.register(e.id.toString() + '-du')} disabled={ex} />
            </GridCol>

            <GridCol span={2}>
                <NumberInput
                    className='w-16'
                    control={form.control}
                    defaultValue={iV?.diverAgeGroupScore || ''}
                    name={e.id.toString() + '-wc'}
                    onKeyDown={handleKeyDown}
                    disabled={!du}
                    hideControls
                />
            </GridCol>

        </Grid>
    )
}

