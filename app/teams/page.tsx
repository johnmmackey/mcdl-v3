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
import { Meet, MeetTeam, TeamSeason } from '@/app/lib/definitions'
import { Suspense } from 'react';
import CrudGrid from '@/app/ui/crudGrid';

import { IconChevronRight, IconPlus, IconX, IconSettings, IconChevronDown, IconPencil, IconTag, IconFileSpreadsheet, IconLogin2, IconClipboardData, IconDotsVertical } from '@tabler/icons-react';

export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number, active?: Boolean }>
}) {

    const searchParams = await props.searchParams;
    const currentSeasonId = await fetchCurrentSeasonId();

    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;
    const teamsForSeason = (await fetchTeamsForSeason(selectedSeasonId)).sort((a, b) => (a.team.name > b.team.name) ? 1 : -1);


    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                    <SeasonSelector base="/teams" selectedSeasonId={selectedSeasonId} />
                </div>
            </div>

  

            <Suspense fallback={Loading()} >
                <CrudGrid resources={teamsForSeason} renderHeader={TeamHeader} renderRow={TeamRow} />
            </Suspense>
            
        </>
    )
}


function TeamHeader() {
    return (
        <>
                <TableHead >Team Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Address</TableHead>
        </>
    )
}

function TeamRow(t: TeamSeason) {
    return (
        <>
            <TableCell>{t.team.name}</TableCell>
            <TableCell>{t.teamId}</TableCell>
            <TableCell>{t.team.address1 + ', ' + t.team.address2}</TableCell>
        </>
    )
}