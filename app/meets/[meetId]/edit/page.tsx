import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';

import { fetchCurrentSeasonId, fetchMeet, fetchSeasons } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, MeetCreateInput, MeetTeam } from '@/app/lib/definitions'
import { Suspense } from 'react';

import { MeetForm } from './MeetForm'

export default async function Page(props: {
    params: Promise<{ meetId: string }>,
    searchParams: Promise<{ 'season-id': number }>
}) {
    const params = await props.params;
    const seasons = await fetchSeasons();
    const currentSeasonId = await fetchCurrentSeasonId();
    const meetId = parseInt(params.meetId) || null;
    const meet = meetId
                    ? await fetchMeet(meetId)
                    : {
                        id: 0,
                        seasonId: currentSeasonId,
                        name: null,
                        parentMeet: null,
                        meetDate: new Date(),
                        entryDeadline: null,
                        hostPool: null,
                        visitingPool: null,
                        coordinatorPool: null,
                        meetType: 'Dual',
                        divisionId: null,
                        week: null,
                        scoresPublished: null,
                        teams: [] 
                    } as Meet;

    console.log('meet', meet);

    return (
        <MeetForm meet={meet}  meetId={meetId} seasons={seasons} />
    )
}

