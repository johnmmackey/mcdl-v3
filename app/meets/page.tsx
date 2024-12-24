import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Grid, GridCol } from '@mantine/core';
import { fetchTeams, fetchMeets, fetchCurrentSeason } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, MeetPool } from '@/app/lib/definitions'
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
    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'poolcode');
    const meets = await fetchMeets(props.season);
    const smeets = sortBy(meets, ['meetDate', 'division']);
    const gmeets = groupBy(smeets, e => format(e.meetDate, 'PPP'));

    const meetName = (m: Meet) => m.name || (m.hostPool && m.visitingPool && `${kteams[m.visitingPool].name} at ${kteams[m.hostPool].name}`);
    const scoreStr = (m: Meet) => {
        if (!m.scoresPublished || !m.meetsPools.length)
            return '';
        if (m.meetsPools.length > 2)
            return 'Results';
        return m.meetsPools.find(e => e.poolcode === m.visitingPool)?.score
            + ' - '
            + m.meetsPools.find(e => e.poolcode === m.hostPool)?.score;
    }

    return (
        <div style={{ maxWidth: '1000px' }}>
            {Object.entries(gmeets).map(([dt, meets], k1) =>
                <div key={k1} className="border-2 m-8 p-4" >

                    <div className="mb-4 font-bold">{dt}</div>

                    <Grid columns={5}>
                        <GridCol span={1} className='text-center font-semibold'>Division</GridCol>
                        <GridCol span={3} className='text-center font-semibold'>Meet Name</GridCol>
                        <GridCol span={1} className='text-center font-semibold'>Score</GridCol>
                    </Grid>

                    {meets.map((m, k2) =>
                        <Link key={k2} href={`/meets/${m.id}/scoring`}>
                            <Grid key={k2} className='hover:bg-slate-200' columns={5} >
                                <GridCol span={1} className='text-center'>{m.division || 'NDM'}</GridCol>
                                <GridCol span={3} className=''>
                                    <div>{meetName(m)}</div>
                                </GridCol>
                                <GridCol span={1} className='text-center'>
                                    <div>{scoreStr(m)}</div>
                                </GridCol>
                            </Grid>
                        </Link>
                    )}
                </div>
            )}
        </div >
    )
}

