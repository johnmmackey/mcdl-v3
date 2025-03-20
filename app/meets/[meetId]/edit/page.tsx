import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Grid, GridCol, Button } from '@mantine/core';
import { fetchMeet, fetchTeams, fetchMeets, fetchCurrentSeasonId, fetchTeamSeasons, fetchSeasons } from '@/app/lib/data';
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
    const meetId: number | null = parseInt(params.meetId) || null;
    const existingMeet = meetId ? await fetchMeet(meetId) : null;

    return (
        <MeetForm meet={existingMeet}  meetId={meetId} seasons={seasons} />
    )
}


