"use client";
//import { Formik, Form, Field, ErrorMessage } from 'formik';
import React, { useState } from 'react';
import { Grid, GridCol, NumberInput, Checkbox } from '@mantine/core';
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
}>) => (
    <form>
        <AgeGroupIterator
            ageGroups={ageGroups}
            meet={meet}
            iteree={meetEntries}
            field='ageGroupId'
            GroupHeader={ScoringHeader}
            GroupElement={ScoringElement}
            groupSort={(a: Entry, b: Entry) => strcmp(a.poolcode + a.lastName + a.firstName, b.poolcode + b.lastName + b.firstName)}
            initialValues={meetResults}
        />
        <button type="submit" disabled={false}>
            Submit
        </button>
    </form>

);



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

const ScoringElement = ({ ag, e, initialValues }: IGroupElement) => {
    const iV: DiverScore = initialValues?.find(iv => iv.diverId === e.id);

    /*
    const initialState: Record<string, any> = {
        ex: !!iV?.exhibition,
        score: iV?.score || '',
        du: !!(iV && iV.ageGroupId !== ag.id),  //ageGroupId is where the diver SCORED, not the ageGroup of the diver
        wc: iV?.diverAgeGroupScore || ''
    }
*/
    //let [state, setState] = useState(initialState);
    let [ex, setEx] = useState(!!iV?.exhibition);
    let [score, setScore] = useState(iV?.score || '');
    let [du, setDu] = useState(!!(iV && iV.ageGroupId !== ag.id));
    let [wc, setWc] = useState(iV?.diverAgeGroupScore || '');


    const handleChangeEx = (event: React.ChangeEvent<HTMLInputElement>) => {

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

    return (
        <Grid columns={10} className='hover:bg-slate-200'>
            <GridCol span={1} className='mt-2'>{e.poolcode}</GridCol>
            <GridCol span={3} className='mt-2'>{e.firstName} {e.lastName}</GridCol>
            <GridCol span={1} className='mt-2'>
                <Checkbox onChange={handleChangeEx} name={e.id.toString() + '-ex'} checked={ex} />
            </GridCol>
            <GridCol span={2}>
                <NumberInput className='w-24' onChange={setScore} name={e.id.toString() + '-score'} value={score} hideControls />
            </GridCol>
            <GridCol span={1} className='mt-2'>
                <Checkbox onChange={handleChangeDu} name={e.id.toString() + '-du'} checked={du} disabled={ex} />
            </GridCol>
            <GridCol span={2} className='w-24'>
                <NumberInput onChange={setWc} className='w-24' name={e.id.toString() + '-wc'} value={wc} disabled={!du || ex} hideControls />
            </GridCol>
        </Grid>
    )
}

