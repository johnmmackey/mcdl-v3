"use client";

import React, { RefObject, useEffect, useRef } from 'react';
import { Grid, GridCol } from '@mantine/core';
import { useForm, SubmitHandler, useWatch, UseFormReturn } from "react-hook-form"
import { AgeGroupGrid, } from '../MeetComponents';
import { AgeGroup, Entry, DiverScore } from '@/app/lib/definitions';
import strcmp from '@/app/lib/strcmp'
import styles from './scoreForm.module.css';

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

    const form = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        let results = data.f.flat();
        console.log('Results:', results);
    }

    const entriesWithResults: EntryWithResult[] = meetEntries.map(e =>
        ({ ...e, result: meetResults?.find((r: DiverScore) => r.diverId === e.id) || null })
    );

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
        <GridCol span={1} className="text-center">Pool</GridCol>
        <GridCol span={3}>Diver</GridCol>
        <GridCol span={1} className="text-center">EX</GridCol>
        <GridCol span={2} className="text-center">Score</GridCol>
        <GridCol span={1} className="text-center">DiveUp</GridCol>
        <GridCol span={2} className="text-center">Wildcard</GridCol>
    </Grid>
)

const ScoringElement = ({ ag, entry, k, form }: { ag: AgeGroup, entry: EntryWithResult, k: number, form: UseFormReturn }) => {
    const iV = entry.result;
    const errors = (form.formState.errors?.f as unknown as Array<any>)?.[ag.id]?.[k];

    const iVEx = !!iV?.exhibition;
    const iVDu = !!(iV && (iV.ageGroupId !== ag.id));

    let ex = useWatch({
        control: form.control,
        name: fName(ag.id, k, 'ex'),
        defaultValue: iVEx
    });

    let du = useWatch({
        control: form.control,
        name: fName(ag.id, k, 'du'),
        defaultValue: iVDu
    });

    useEffect(() => {
        if (ex)
            form.setValue(fName(ag.id, k, 'du'), false);
        if (ex || !du)
            form.setValue(fName(ag.id, k, 'wc'), '');
    }, [form, ex, du]);

    return (
        <Grid columns={10} className='hover:bg-slate-200'>
            <GridCol span={1} className='text-center'>{entry.poolcode}</GridCol>
            <GridCol span={3} className=''><span className="text-lg font-semibold">{entry.lastName}</span>, {entry.firstName}</GridCol>

            <GridCol span={1} className='text-center'>
                <input type="hidden" {...form.register(fName(ag.id, k, 'diverId'))} value={entry.id.toString()} />
                <input className={styles.scoreInput} type="checkbox" defaultChecked={iVEx} {...form.register(fName(ag.id, k, 'ex'))} />
            </GridCol>

            <GridCol span={2} className='text-center'>
                <input
                    type="number"
                    className={`${styles.scoreInput} ${errors?.score ? styles.scoreError : ''}`}
                    {...form.register(fName(ag.id, k, 'score'),
                        {
                            min: { value: 0, message: 'Must be > 0 or blank' },
                            max: { value: 999, message: 'Max Score is 999' },
                            pattern: { value: /^\d{1,3}(\.\d{1,2})?$/, message: 'Max 2 decimal places' },
                            required: false,
                        }
                    )}
                    defaultValue={iV?.score || ''}
                />
                {errors?.score &&
                    <div className='text-red-500'>{errors.score.message}</div>
                }
            </GridCol>

            <GridCol span={1} className='text-center'>
                <input className={styles.scoreInput} type="checkbox" defaultChecked={iVDu} {...form.register(fName(ag.id, k, 'du'))} disabled={ex} />
            </GridCol>

            <GridCol span={2} className='text-center'>
                <input
                    type="number"
                    className={`${styles.scoreInput} ${errors?.wc ? styles.scoreError : ''}`}
                    {...form.register(fName(ag.id, k, 'wc'),
                        {
                            min: { value: 0, message: 'Must be > 0 or blank' },
                            max: { value: 999, message: 'Max Score is 999' },
                            pattern: { value: /^\d{1,3}(\.\d{1,2})?$/, message: 'Max 2 decimal places' },
                            required: false,
                        }
                    )}
                    defaultValue={iV?.diverAgeGroupScore || ''}
                    disabled={!du}
                    step={0.01}
                />
                {errors?.wc &&
                    <div className='text-red-500'>{errors.wc.message}</div>
                }
            </GridCol>
        </Grid>
    )
}

const fName = (agId: number, k: number, cat: string): string => `f.${agId}.${k}.${cat}`