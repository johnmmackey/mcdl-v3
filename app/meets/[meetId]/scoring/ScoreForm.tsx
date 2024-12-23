"use client";
//import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import { Grid, GridCol, NumberInput, Checkbox } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { AgeGroupIterator, IGroupElement, IGroupHeader } from '../MeetComponents';
import { AgeGroup, Meet, Team, Entry, DiverScore } from '@/app/lib/definitions';
import strcmp from '@/app/lib/strcmp'

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

    const initialValues = meetResults.reduce( (acc, mr) => {
        acc[mr.diverId + '-score'] = mr.score;
        acc[mr.diverId + '-ex'] = !!mr.exhibition;
        acc[mr.diverId + '-du'] = !!(mr.ageGroupId != mr.diverAgeGroupId);
        acc[mr.diverId + '-wc'] = mr.diverAgeGroupScore || '';
        return acc;
    }, {});

    console.log(initialValues)

    const form = useForm({
        mode: 'uncontrolled',
        initialValues
    })

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
                form={form}
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

const ScoringElement = ({ ag, e, form }: IGroupElement) => {

    const handleChangeEx = () => null;
    const handleChangeDu = handleChangeEx

/*    const handleChangeEx = (event: React.ChangeEvent<HTMLInputElement>) => {

        setEx(event.target.checked);

        // side effects
        if (event.target.checked) {
            setWc('');
            setDu(false);
        }
    }

    const handleChangeDu = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDu(event.target.checked);

        // side effects
        if (!event.target.checked)
            setWc('');
    }
*/
    return (
        <Grid columns={10} className='hover:bg-slate-200'>
            <GridCol span={1} className='mt-2'>{e.poolcode}</GridCol>
            <GridCol span={3} className='mt-2'>{e.firstName} {e.lastName}</GridCol>
            <GridCol span={1} className='mt-2'>
                <Checkbox onChange={handleChangeEx} {...form.getInputProps(e.id.toString() + '-ex', { type: 'checkbox' })} />
            </GridCol>
            <GridCol span={2}>
                <NumberInput className='w-24' {...form.getInputProps(e.id.toString() + '-score')} hideControls />
            </GridCol>
            <GridCol span={1} className='mt-2'>
                <Checkbox onChange={handleChangeDu} {...form.getInputProps(e.id.toString() + '-du', { type: 'checkbox' })}  />
            </GridCol>
            <GridCol span={2} className='w-24'>
                <NumberInput className='w-24' {...form.getInputProps(e.id.toString() + '-wc')} hideControls />
            </GridCol>
        </Grid>
    )
}

