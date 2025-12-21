import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { fetchTeams, fetchMeets, fetchCurrentSeasonId } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, MeetTeam } from '@/app/lib/definitions'
import { Suspense } from 'react';

import { IconDotsVertical } from '@tabler/icons-react';

export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number, active?: Boolean }>
}) {

    const searchParams = await props.searchParams;
    const currentSeasonId = await fetchCurrentSeasonId();

    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;


    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                    <SeasonSelector base="/meets" selectedSeasonId={selectedSeasonId} />
                </div>

                <div className="col-span-3">
                    <Link href={"/meets/_/edit"}><Button>Add New</Button></Link>
                </div>
            </div>

            <Suspense fallback={Loading()} key={`${searchParams['season-id']}`}>
                <Meets season={selectedSeasonId} />
            </Suspense>
        </>
    )
}

async function Meets(props: {
    season: number
}) {
    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'id');
    const meets = await fetchMeets(props.season);
    const smeets = sortBy(meets, ['meetDate', 'divisionId']);
    const gmeets = groupBy(smeets, e => format(e.meetDate, 'PPP'));

    const meetName = (m: Meet) => {
        if (m.name)
            return m.name;

        const visitingTeams = m.teams.filter(e => e.teamId !== m.hostPool).map(t => kteams[t.teamId].name);
        return visitingTeams.join(', ') + (m.hostPool ? ' @ ' + kteams[m.hostPool!].name : '');
    }
    const scoreStr = (m: Meet) => {
        if (!m.scoresPublished || !m.teams.length)
            return '';
        if (m.teams.length > 2)
            return 'Results';
        return (m.teams.find(e => e.teamId === m.visitingPool)?.score || 0)
            + ' - '
            + ((m.teams.find(e => e.teamId === m.hostPool)?.score) || 0);
    }

    return (
        <div style={{ maxWidth: '1000px' }}>
            {Object.entries(gmeets).map(([dt, meets], k1) =>
                <div key={k1} className="border-2 m-8 p-4" >

                    <div className="mb-4 font-bold">{dt}</div>

                    <div className="grid grid-cols-6 gap-4">
                        <div className='text-center font-semibold'>Division</div>
                        <div className='col-span-3text-center font-semibold'>Meet Name</div>
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <IconDotsVertical className="text-white group-hover:text-black" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>

                                        <Link href={`/meets/${m.id}/enter`}>
                                            <DropdownMenuItem>Enter Divers</DropdownMenuItem>
                                        </Link>
                                        <Link href={`/meets/${m.id}/scoring`}>
                                            <DropdownMenuItem>Enter Scores</DropdownMenuItem>
                                        </Link>
                                        <Link href={`/meets/${m.id}/roster`}>
                                            <DropdownMenuItem>Roster</DropdownMenuItem>
                                        </Link>
                                        <Link href={`/meets/${m.id}/labels`}>
                                            <DropdownMenuItem>Print Labels</DropdownMenuItem>
                                        </Link>
                                        <Link href={`/meets/${m.id}/results`}>
                                            <DropdownMenuItem>View Results</DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator />
                                        <Link href={`/meets/${m.id}/edit`}>
                                            <DropdownMenuItem>Edit Meet</DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>


                            </div>
                        </div>

                    )}
                </div>
            )}
        </div >
    )
}

