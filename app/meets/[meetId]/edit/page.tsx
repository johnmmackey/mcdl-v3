import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Grid, GridCol, Button } from '@mantine/core';
import { fetchMeet, fetchTeams, fetchMeets, fetchCurrentSeasonId, fetchTeamSeasons } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, MeetTeam } from '@/app/lib/definitions'
import { Suspense } from 'react';

import { MeetForm } from './MeetForm'

export default async function Page(props: {params: Promise<{ meetId: string }> }) {
    const params = await props.params;
    const meetId = parseInt(params.meetId);
    const currentSeasonId = await fetchCurrentSeasonId();

    const meet = meetId
        ? await fetchMeet(meetId)
        : {
            id: 0,
            seasonId: currentSeasonId,
            parentMeet: null,
            name: '',
            meetDate: new Date(),
            entryDeadline: null,
            hostPool: '',
            meetType: '',
            divisionId: 1,
            coordinatorPool: null,
            scoresPublished: null,
            teams:[]
        }

    //const searchParams = await props.searchParams;

    const selectedSeasonId = currentSeasonId; //searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;
    const teamSeasons = await fetchTeamSeasons(selectedSeasonId);

    return (
        <MeetForm seasonId={currentSeasonId} teamSeasons={teamSeasons} meet={meet}></MeetForm>
    )
}


