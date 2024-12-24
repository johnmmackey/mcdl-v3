"use client";
//import { Formik, Form, Field, ErrorMessage } from 'formik';
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
    /*
        const initialValues = meetResults.reduce( (acc, mr) => {
            acc[mr.diverId + '-score'] = mr.score;
            acc[mr.diverId + '-ex'] = !!mr.exhibition;
            acc[mr.diverId + '-du'] = !!(mr.ageGroupId != mr.diverAgeGroupId);
            acc[mr.diverId + '-wc'] = mr.diverAgeGroupScore || '';
            return acc;
        }, {});
    */
    //console.log(initialValues)

    const form = useForm();
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
    /*
        useEffect(() => {
            const { unsubscribe } = form.watch((value, {name, type}) => {
              console.log('***', value, name, type)
            })
            return () => unsubscribe()
          }, [form.watch])
    */
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <AgeGroupIterator
                ageGroups={ageGroups}
                meet={meet}
                iteree={meetEntries}
                field='ageGroupId'
                GroupHeader={ScoringHeader}
                GroupElement={ScoringElement}
                groupSort={(a: Entry, b: Entry) => strcmp(a.poolcode + a.lastName + a.firstName, b.poolcode + b.lastName + b.firstName)}
                form={form}
                initialValues={meetResults}
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

const ScoringElement = ({ ag, e, form, initialValues }: IGroupElement) => {
    const iV: DiverScore = initialValues?.find((iv: DiverScore) => iv.diverId === e.id);

    const iVEx = !!iV?.exhibition;
    const iVDu = iV && (iV.ageGroupId !== ag.id);

    let [duDisabled, setDuDisabled] = useState(iVEx);
    let [wcDisabled, setWcDisabled] = useState(iVEx || !iVDu);

    let ex = useWatch({
        control: form.control,
        name: e.id.toString() + '-ex',
        defaultValue: iVEx
    })
    let du = useWatch({
        control: form.control,
        name: e.id.toString() + '-du',
        defaultValue: iVDu
    })

    useEffect(() => {
        setDuDisabled(ex);
        setWcDisabled(ex || !du);
        if(ex)
            form.setValue(e.id.toString() + '-du', false)
        if(ex || !du)
            form.setValue(e.id.toString() + '-wc', '')
    }, [ex, du, setDuDisabled])

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
                <Checkbox defaultChecked={iVDu} {...form.register(e.id.toString() + '-du')} disabled={duDisabled} />
            </GridCol>

            <GridCol span={2} className='w-24'>
                <TextInput className='w-24' defaultValue={iV?.diverAgeGroupScore || ''} {...form.register(e.id.toString() + '-wc')} disabled={wcDisabled} />
            </GridCol>

        </Grid>
    )
}


/*
const initialState: Record<string, any> = {
    ex: !!iV?.exhibition,
    score: iV?.score || '',
    du: !!(iV && iV.ageGroupId !== ag.id),  //ageGroupId is where the diver SCORED, not the ageGroup of the diver
    wc: iV?.diverAgeGroupScore || ''
}
*/
//let [state, setState] = useState(initialState);
/*
let [ex, setEx] = useState(!!iV?.exhibition);
let [score, setScore] = useState(iV?.score || '');
let [du, setDu] = useState(!!(iV && iV.ageGroupId !== ag.id));
let [wc, setWc] = useState(iV?.diverAgeGroupScore || '');
const handleChangeEx = () => null;
const handleChangeDu = handleChangeEx
*/

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
//const a = useWatch({control: form.control, name: e.id.toString() + '-ex'});