"use client";

import React, { useEffect, } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler, useWatch, UseFormReturn } from "react-hook-form"
import { AgeGroupGrid, } from '../MeetComponents';
import { Meet, AgeGroup, Entry, DiverScore } from '@/app/lib/definitions';
import { scoreMeet } from '@/app/lib/data'
import strcmp from '@/app/lib/strcmp'
import styles from './scoreForm.module.css';
import { Divide } from 'lucide-react';

type Inputs = Record<string, any>
type EntryWithResult = Entry & { result: DiverScore | null };

const errorMatrix: Record<string, any> = {
    score: {
        max: '< 999',
        min: '>= 0',
        pattern: 'Max 2 decimal places',
    },
    wc: {
        max: '< 999',
        min: '>= 0',
        pattern: '<= 2 decimal places',
        lessThanScore: '<= Score',
    }
}

const ScoreForm = ({
    meet,
    ageGroups,
    meetEntries,
    meetResults
}: Readonly<{
    meet: Meet,
    ageGroups: AgeGroup[],
    meetEntries: Entry[],
    meetResults: DiverScore[]
}>) => {

    const form = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });
    const router = useRouter();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log('*** in submit handler')
        console.log(data.f.flat().length)
        let results = data
            .f
            .flat()
            .filter((e: any) => e.score !== '')
            .map((e: any) => ({
                diverId: Number(e.diverId),
                ex: e.ex,
                score: Number(e.score),
                du: e.du,
                wc: e.wc === '' ? 0 : Number(e.wc)
            }))

        console.log('Results:', results.length);
        return scoreMeet(meet.id, results)
            .then(() => router.push(`/meets/${meet.id}/results`))
    }

    const entriesWithResults: EntryWithResult[] = meetEntries.map(e =>
        ({ ...e, result: meetResults?.find((r: DiverScore) => r.diverId === e.diverId) || null })
    );

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <AgeGroupGrid
                GroupHeader={ScoringHeader}
                ageGroups={ageGroups}
                renderContent={(ag: AgeGroup) => {
                    return (
                        entriesWithResults
                            .filter(e => e.diver.seasons[0].ageGroupId === (ag as AgeGroup).id)
                            .sort((a: Entry, b: Entry) => strcmp(a.diver.teamId + a.diver.lastName + a.diver.firstName, b.diver.teamId + b.diver.lastName + b.diver.firstName))
                            .map((entry, k) =>
                                <ScoringElement key={k} k={k} ag={ag} entry={entry} form={form} meet={meet} />
                            )
                    )
                }}
            />

            <Button type="submit" disabled={false}>
                Submit
            </Button>
        </form>
    )
}

const ScoringHeader = () => (
    <div className='font-semibold grid grid-cols-10'>
        <div className="text-center">Pool</div>
        <div className='col-span-3'>Diver</div>
        <div className="text-center">EX</div>
        <div className="col-span-2 text-center">Score</div>
        <div className="text-center">DiveUp</div>
        <div className="col-span-2 text-center">Wildcard</div>
    </div>
)

const ScoringElement = ({ ag, entry, k, form, meet }: { ag: AgeGroup, entry: EntryWithResult, k: number, form: UseFormReturn, meet: Meet }) => {
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
    }, [form, ex, du, ag.id, k]);

    return (
        <div className='grid grid-cols-10 hover:bg-slate-200'>
            <div className='text-center'>{entry.diver.teamId}</div>
            <div className=''><span className="text-lg font-semibold">{entry.diver.lastName}</span>, {entry.diver.firstName}</div>

            <div className='text-center'>
                <input type="hidden" {...form.register(fName(ag.id, k, 'diverId'))} value={entry.diverId.toString()} />
                <input className={styles.scoreInput} type="checkbox" defaultChecked={iVEx} {...form.register(fName(ag.id, k, 'ex'))} disabled={meet.meetType !== 'Dual' && meet.meetType !== 'Multidual'} />
            </div>

            <div className='col-span-2 text-center'>
                <input
                    type="number"
                    className={`${styles.scoreInput} ${errors?.score ? styles.scoreError : ''}`}
                    {...form.register(fName(ag.id, k, 'score'),
                        {
                            min: -1,
                            max: 999,
                            pattern: /^\-?\d{1,3}(\.\d{1,2})?$/,
                            required: false,
                        }
                    )}
                    defaultValue={iV?.score || ''}
                />
                {errors?.score &&
                    <div className='text-red-500'>{errorMatrix['score'][errors.score.type]}</div>
                }
            </div>

            <div className='text-center'>
                <input className={styles.scoreInput} type="checkbox" defaultChecked={iVDu} {...form.register(fName(ag.id, k, 'du'))} disabled={ex || !ag.nextGroup || meet.meetType !== 'Dual'} />
            </div>

            <div className='col-span-2 text-center'>
                <input
                    type="number"
                    className={`${styles.scoreInput} ${errors?.wc ? styles.scoreError : ''}`}
                    {...form.register(fName(ag.id, k, 'wc'),
                        {
                            min: { value: 0, message: 'Must be > 0 or blank' },
                            max: { value: 999, message: 'Max Score is 999' },
                            pattern: { value: /^\d{1,3}(\.\d{1,2})?$/, message: 'Max 2 decimal places' },
                            required: false,
                            validate: {
                                lessThanScore: v => v <= form.getValues(fName(ag.id, k, 'score'))
                            }
                        }
                    )}
                    defaultValue={iV?.scoreAgeGroup || ''}
                    disabled={!du || !ag.nextGroup || meet.meetType !== 'Dual'}
                    step={0.01}
                />
                {errors?.wc &&
                    <div className='text-red-500'>{errorMatrix['wc'][errors.wc.type]}</div>
                }
            </div>
        </div>
    )
}

const fName = (agId: number, k: number, cat: string): string => `f.${agId}.${k}.${cat}`

export default ScoreForm