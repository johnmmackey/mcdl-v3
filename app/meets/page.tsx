import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableThead, TableTr, TableTh, TableTd, TableTbody } from '@mantine/core';
import { fetchTeams, fetchMeets, fetchCurrentSeason } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import { ActionDropdown } from '../ui/ActionDropdown';
import Loading from './loading'
import PageTitle from '@/app/ui/PageTitle'
import { Suspense } from 'react';

export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number, active?: Boolean }>
}) {

    const searchParams = await props.searchParams;
    const currentSeason = await fetchCurrentSeason();

    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeason.id;

    return (
        <>
            <SeasonSelector base="/meets" selectedSeasonId={selectedSeasonId} />
            <Suspense fallback={Loading()} key={`${searchParams['season-id']}`}>
                <Meets season={selectedSeasonId} />
            </Suspense>
        </>
    )
}

async function Meets(props: {
    season: number
}) {

    const session = await auth();

    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'poolcode');
    const meets = await fetchMeets(props.season);
    const smeets = sortBy(meets, ['meetDate', 'division']);
    const gmeets = groupBy(smeets, e => format(e.meetDate, 'PPP'));

    const meetName = (m: any) => m.name || (m.hostPool && m.visitingPool && `${kteams[m.visitingPool].name} at ${kteams[m.hostPool].name}`);
    const scoreStr = (m: any) => {
        if (!m.scoresPublished || !m.meetsPools.length)
            return '';
        if (m.meetsPools.length > 2)
            return 'Full Results';
        return m.meetsPools.find((e: any) => e.poolcode === m.visitingPool)?.score
            + ' - '
            + m.meetsPools.find((e: any) => e.poolcode === m.hostPool)?.score;
    }
    //inactive={!userCan('meet', m, 'viewResults', session)}
    return (
        <Table striped>
            <TableThead>
                <TableTr>
                    <TableTh>Date</TableTh>
                    <TableTh>Division</TableTh>
                    <TableTh>Meet Name</TableTh>
                    <TableTh>Score</TableTh>
                    {session?.user &&
                        <TableTh>Actions</TableTh>
                    }
                </TableTr>
            </TableThead>
            <TableTbody>
                {Object.entries(gmeets).map(([dt, meets], k1) =>
                    meets.map((m, k2) =>
                        <TableTr key={k2} className='hover:bg-slate-200'>
                            <TableTd className='py-2'>{format(m.meetDate, 'PPP')}</TableTd>
                            <TableTd className='pl-12 py-2'>{m.division || 'NDM'}</TableTd>
                            <TableTd className='py-2'>
                                <Link href={`/meets/${m.id}`}>
                                    <div className='w-96'>{meetName(m)}</div>
                                </Link>
                            </TableTd>
                            <TableTd className='py-2'>
                                <Link href={`/meets/${m.id}`}>
                                    <div className='w-16'>{scoreStr(m)}</div>
                                </Link>
                            </TableTd>

                            <TableTd>
                                {session &&
                                    <ActionDropdown />
                                }

                            </TableTd>

                        </TableTr>
                    )
                )}
            </TableTbody>
        </Table>

    )
}

function MeetsSkeleton() {
    return (
        <div>Skeleton</div>
    )
}