import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { TableHead, TableCell } from '@/components/ui/table';
import { fetchTeams, fetchMeets, fetchCurrentSeasonId, fetchTeamsForSeason } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, MeetTeam, TeamSeason, Team } from '@/app/lib/definitions'
import { Suspense } from 'react';
import CrudGrid from '@/app/ui/crudGrid';


export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number, active?: Boolean }>
}) {
    const searchParams = await props.searchParams;
    const currentSeasonId = await fetchCurrentSeasonId();
    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;
   
    const teams = (await fetchTeamsForSeason(selectedSeasonId)).sort((a, b) => (((a.divisionId - b.divisionId) || (a.seed - b.seed))));

    return (
        <>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                    <SeasonSelector base="/seasons" selectedSeasonId={selectedSeasonId} />
                </div>
            </div>

            <Suspense fallback={Loading()} >
                <CrudGrid resources={teams} renderHeader={TeamHeader} renderRow={TeamRow} />
            </Suspense>

        </>
    )
}


function TeamHeader() {
    return (
        <>
            <TableHead>Division</TableHead>
            <TableHead>Seed</TableHead>
            <TableHead>Code</TableHead>
            <TableHead >Team Name</TableHead>


        </>
    )
}

function TeamRow(t: TeamSeason) {
    return (
        <>
            <TableCell>{t.divisionId}</TableCell>
            <TableCell>{t.seed}</TableCell>
            <TableCell>{t.team.id}</TableCell>
            <TableCell>{t.team.name}</TableCell>
        </>
    )
}