import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'

import { fetchTeams, fetchSeasons, fetchDivisions, fetchCurrentSeasonId, fetchTeamsForSeason } from '@/app/lib/data';
import { DivisionAssignments } from './DivisionAssignments';
import Loading from '@/app/ui/Loading'
import { SeasonSelector } from '@/app/ui/SeasonSelector';


export default async function Page(props: {
    searchParams: Promise<{ 'season-id': string, active?: Boolean }>
}) {
    const seasons = await fetchSeasons();
    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();

    const searchParams = await props.searchParams;
    const currentSeasonId = await fetchCurrentSeasonId();

    // set this to either the specified season, the current season (if its absent) or null if it is the flag value of '_' (used for new season)
    const selectedSeasonId = searchParams['season-id']
        ? isNaN(parseInt(searchParams['season-id'])) ? undefined : parseInt(searchParams['season-id'])
        : currentSeasonId

    // need to test edge case where no seasons exist
    const divAssignments = await fetchTeamsForSeason(selectedSeasonId || currentSeasonId);

    return (
        <>
            <div className="flex gap-4 mb-8">
                {selectedSeasonId &&
                    <>
                        <SeasonSelector base="/seasons" selectedSeasonId={selectedSeasonId} />
                        <Link href='/seasons?season-id=_'>
                            <Button variant='outline' >Add New Season</Button>
                        </Link>
                    </>
                }

            </div>

            <Suspense fallback={Loading()} >
                <DivisionAssignments teams={teams} divisions={divisions} divAssignments={divAssignments} newSeason={!selectedSeasonId } />
            </Suspense>

        </>

    )
}




