"use client";

import React, { RefObject, useEffect, useRef } from 'react';
import { Grid, GridCol } from '@mantine/core';
import { useForm, SubmitHandler, useWatch, UseFormReturn } from "react-hook-form"
import { AgeGroupGrid, } from '../MeetComponents';
import { AgeGroup, Entry, DiverScore } from '@/app/lib/definitions';
import strcmp from '@/app/lib/strcmp'

type Inputs = Record<string, any>
type EntryWithResult = Entry & { result: DiverScore | null }

export default ({
    ageGroups,
    meetEntries,
    meetResults
}: Readonly<{
    ageGroups: AgeGroup[],
    meetEntries: Entry[],
    meetResults: DiverScore[]
}>) => {

    const form = useForm();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        let diverIds = data.diverId.flat();
        let scores = data.score.flat();
        let ex = data.ex.flat();
        let du = data.du.flat();
        let wc = data.wc.flat();

        let results = diverIds.map((d: number, k: number) => ({ diverId: d, score: scores[k], ex: ex[k], du: du[k], wc: wc[k] }));
        console.log(results);
    }

    const entriesWithResults: EntryWithResult[] = meetEntries.map(e =>
        ({ ...e, result: meetResults?.find((r: DiverScore) => r.diverId === e.id) || null })
    );

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <AgeGroupGrid
                GroupHeader={ScoringHeader}
                ageGroups={ageGroups}
                renderContent={(ag: AgeGroup) => {
                    return (
                        entriesWithResults
                            .filter(e => e.ageGroupId === (ag as AgeGroup).id)
                            .sort((a: Entry, b: Entry) => strcmp(a.poolcode + a.lastName + a.firstName, b.poolcode + b.lastName + b.firstName))
                            .map((entry, k) =>
                                <ScoringElement key={k} k={k} ag={ag} entry={entry} form={form} />
                            )
                    )
                }}
            />
            <button type="submit" disabled={false}>
                Submit
            </button>
        </form>
    )
}

const ScoringHeader = () => (
    <Grid className='font-semibold' columns={10}>
        <GridCol span={1}>Pool</GridCol>
        <GridCol span={3}>Diver</GridCol>
        <GridCol span={1}>EX</GridCol>
        <GridCol span={2}>Score</GridCol>
        <GridCol span={1}>DiveUp</GridCol>
        <GridCol span={2}>Wildcard</GridCol>
    </Grid>
)

const ScoringElement = ({ ag, entry, k, form }: { ag: AgeGroup, entry: EntryWithResult, k: number, form: UseFormReturn}) => {
    const iV = entry.result;

    const iVEx = !!iV?.exhibition;
    const iVDu = !!(iV && (iV.ageGroupId !== ag.id));

    let ex = useWatch({
        control: form.control,
        name: entry.id.toString() + '-ex',
        defaultValue: iVEx
    });

    let du = useWatch({
        control: form.control,
        name: entry.id.toString() + '-du',
        defaultValue: iVDu
    });

    useEffect(() => {
        if (ex)
            form.setValue('du.' + ag.id + '.' + k, false);
        if (ex || !du)
            form.setValue('wc.' + ag.id + '.' + k, '');
    }, [form, ex, du]);

    return (
        <Grid columns={10} className='hover:bg-slate-200'>
            <GridCol span={1} className='mt-2'>{entry.poolcode}</GridCol>
            <GridCol span={3} className='mt-2'><span className="text-lg font-semibold">{entry.lastName}</span>, {entry.firstName}</GridCol>

            <GridCol span={1} className='mt-2'>
                <input type="hidden" {...form.register('diverId.' + ag.id + '.' + k)} value={entry.id.toString()} />
                <input type="checkbox" defaultChecked={iVEx} {...form.register('ex.' + ag.id + '.' + k)} />
            </GridCol>

            <GridCol span={2}>
                <input
                    type="number"
                    className="w-24"
                    {...form.register('score.' + ag.id + '.' + k,
                        {
                            min: 0,
                            max: 999,
                            required: false,
                        }
                    )}
                    defaultValue={iV?.score || ''}
                    step={0.01}
                />
            </GridCol>

            <GridCol span={1} className='mt-2'>
                <input type="checkbox" defaultChecked={iVDu} {...form.register('du.' + ag.id + '.' + k)} disabled={ex} />
            </GridCol>

            <GridCol span={2}>
                <input
                    type="number"
                    className='w-24'
                    {...form.register('wc.' + ag.id + '.' + k,
                        {
                            min: 0,
                            max: 999,
                            required: false,
                        }
                    )}
                    defaultValue={iV?.diverAgeGroupScore || ''}
                    disabled={!du}
                    step={0.01}
                />
            </GridCol>
        </Grid>
    )
}

