import { fetchCurrentSeasonId, fetchMeet, fetchSeasons } from '@/app/lib/data';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'

import { fetchTeams, fetchDivisions, fetchTeamsForSeason } from '@/app/lib/data';

import { DivisionAssignments } from '../DivisionAssignments';

export default async function Page(props: {
    params: Promise<{ seasonId: string }>,
}) {
    const params = await props.params;

    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();
    const divAssignments = await fetchTeamsForSeason(Number(params.seasonId))


    return (
        <DivisionAssignments teams={teams} divisions={divisions} divAssignments={divAssignments} newSeason={false} />
    )
}
