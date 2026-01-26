import { Suspense } from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button"

import { MeetWithTeams } from '@/app/lib/definitions'
import { fetchTeams, fetchMeets, fetchCurrentSeasonId } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'

import { MeetDisplayName } from './components/MeetDisplayName';

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
                    <Link href={"/meets/_/edit"}><Button variant='outline'>Add New</Button></Link>
                </div>
            </div>

            <Suspense fallback={Loading()} key={`${searchParams['season-id']}`}>
                <MeetList season={selectedSeasonId} />
            </Suspense>
        </>
    )
}

async function MeetList(props: {
    season: number
}) {
    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'id');
    const meets = await fetchMeets(props.season);
    const smeets = sortBy(meets, ['meetDate', 'divisionId']);
    const gmeets = groupBy(smeets, e => format(e.meetDate, 'PPP'));

    const scoreStr = (m: MeetWithTeams) => {
        if (!m.scoresPublished || !m.teams.length)
            return '';
        if (m.teams.length > 2)
            return 'Results';
        return (m.teams.find(e => e.teamId !== m.hostPoolId)?.score || 0)
            + ' - '
            + ((m.teams.find(e => e.teamId === m.hostPoolId)?.score) || 0);
    }

    return (
        <div style={{ maxWidth: '1000px' }}>
            {Object.entries(gmeets).map(([dt, meets], k1) =>
                <div key={k1} className="border-2 m-8 p-4" >

                    <div className="mb-4 font-bold">{dt}</div>

                    <div className="grid grid-cols-6 gap-4">
                        <div className='text-center font-semibold'>Division</div>
                        <div className='col-span-3 text-center font-semibold'>Meet Name</div>
                        <div className='text-center font-semibold'>Score</div>
                    </div>
                    {meets.map((m, k2) =>
                        <Link href={'/meets/' + m.id} key={m.id} className='group hover:bg-slate-200 grid grid-cols-6 gap-4 py-1 border-t' >
                            <div className='text-center'>{m.divisionId && m.divisionId < 99 ? m.divisionId : 'NDM'}</div>
                            <div className='col-span-3'>
                                <MeetDisplayName meet={m} />
                            </div>
                            <div className='text-center'>
                                <div>{scoreStr(m)}</div>
                            </div>

                        </Link>

                    )}
                </div >
            )}
        </div>
    )
}