'use client'

import { useActionState, useTransition } from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button"

import { fetchTeams, fetchMeets, fetchCurrentSeasonId, deleteMeet } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, GenericServerActionStatePlaceHolder, Team } from '@/app/lib/definitions'
import { Suspense } from 'react';

import { MeetDropDownMenu } from './MeetDropDownMenu';

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Dictionary } from 'lodash';


export function MeetListClient(props: {
    season: number,
    kteams: Dictionary<Team>,
    gmeets: Dictionary<Meet[]>
}) {


    const meetName = (m: Meet) => {
        if (m.name)
            return m.name;

        const visitingTeams = m.teams.filter(e => e.teamId !== m.hostPool).map(t => props.kteams[t.teamId].name);
        return visitingTeams.join(', ') + (m.hostPool ? ' @ ' + props.kteams[m.hostPool!].name : '');
    }
    const scoreStr = (m: Meet) => {
        if (!m.scoresPublished || !m.teams.length)
            return '';
        if (m.teams.length > 2)
            return 'Results';
        return (m.teams.find(e => e.teamId !== m.hostPool)?.score || 0)
            + ' - '
            + ((m.teams.find(e => e.teamId === m.hostPool)?.score) || 0);
    }


    const [delState, delFormAction] = useActionState(deleteMeet, GenericServerActionStatePlaceHolder);
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: number) => {
        startTransition(() => {
            delFormAction(id);
        });
    }


    return (
        <>
            {isPending &&
                <Loading />
            }
            {
                delState.error &&
                <div className="flex justify-center items-start">
                    <Alert variant="destructive" className="max-w-xl">
                        <AlertCircleIcon />
                        <AlertTitle>Unable to complete the operation</AlertTitle>
                        <AlertDescription>
                            <p>{delState.error}</p>
                        </AlertDescription>
                    </Alert>
                </div>
            }
            {!isPending &&
                <div style={{ maxWidth: '1000px' }}>
                    {Object.entries(props.gmeets).map(([dt, meets], k1) =>
                        <div key={k1} className="border-2 m-8 p-4" >

                            <div className="mb-4 font-bold">{dt}</div>

                            <div className="grid grid-cols-6 gap-4">
                                <div className='text-center font-semibold'>Division</div>
                                <div className='col-span-3 text-center font-semibold'>Meet Name</div>
                                <div className='text-center font-semibold'>Score</div>
                            </div>
                            {meets.map((m, k2) =>
                                <div key={k2} className='group hover:bg-slate-200 grid grid-cols-6 gap-4' >
                                    <div className='text-center'>{m.divisionId && m.divisionId < 99 ? m.divisionId : 'NDM'}</div>
                                    <div className='col-span-3'>
                                        <div>{meetName(m)}</div>
                                    </div>
                                    <div className='text-center'>
                                        <div>{scoreStr(m)}</div>
                                    </div>
                                    <div className='text-center'>
                                        <MeetDropDownMenu meet={m} onDelete={handleDelete} />
                                    </div>
                                </div>

                            )}
                        </div>
                    )}
                </div >
            }
        </>
    )
}

