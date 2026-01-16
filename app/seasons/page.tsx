import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'

import { fetchTeams, fetchSeasons, fetchDivisions, fetchCurrentSeasonId, fetchTeamsForSeason } from '@/app/lib/data';
import { DivisionAssignments } from './DivisionAssignments';
import Loading from '@/app/ui/Loading'
import { SeasonSelector } from '@/app/ui/SeasonSelector';


export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number, active?: Boolean }>
}) {
    const seasons = await fetchSeasons();
    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();

    const searchParams = await props.searchParams;
    const currentSeasonId = await fetchCurrentSeasonId();
    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;

    // need to test edge case where no seasons exist
    const divAssignments = await fetchTeamsForSeason(selectedSeasonId);


    return (

                <>
        
                    <div className="flex gap-4 mb-2">

                            <SeasonSelector base="/seasons" selectedSeasonId={selectedSeasonId} />
                            <Link href='/seasons?season-id=_'>
                                <Button variant='outline' >Add New Season</Button>
                                </Link>
                    </div>
        
                    <Suspense fallback={Loading()} >
                        <DivisionAssignments teams={teams} divisions={divisions} divAssignments={divAssignments} />
                    </Suspense>
        
                </>
        
    )
}




