import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Grid, GridCol, Button, Menu, MenuTarget, MenuDropdown, MenuItem, MenuDivider, MenuLabel } from '@mantine/core';
import { fetchTeams, fetchMeets, fetchCurrentSeasonId, fetchTeamsForSeason } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, MeetTeam } from '@/app/lib/definitions'
import { Suspense } from 'react';

import { IconChevronRight, IconPlus, IconX, IconSettings, IconChevronDown, IconPencil, IconTag, IconFileSpreadsheet, IconLogin2, IconClipboardData, IconDotsVertical } from '@tabler/icons-react';

export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number, active?: Boolean }>
}) {

    const searchParams = await props.searchParams;
    const currentSeasonId = await fetchCurrentSeasonId();

    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;


    return (
        <>
            <Grid>
                <GridCol span={3}>
                    <SeasonSelector base="/teams" selectedSeasonId={selectedSeasonId} />
                </GridCol>
            </Grid>

            <Suspense fallback={Loading()} >
                <Teams season={selectedSeasonId} />
            </Suspense>
        </>
    )
}

async function Teams(props: {
    season: number
}) {
    //const teams = await fetchTeams();
    //const kteams = keyBy(teams, 'id');
    const teamsForSeason = (await fetchTeamsForSeason(props.season)).sort((a, b) => (a.team.name > b.team.name) ? 1 : -1);

    return (
        <div style={{ maxWidth: '1000px' }}>
            <Grid columns={12}>
                <GridCol span={3} className='text-center font-semibold'>Team Name</GridCol>
                <GridCol span={1} className='text-center font-semibold'>Code</GridCol>
                <GridCol span={6} className='text-center font-semibold'>Address</GridCol>
            </Grid>
            {teamsForSeason.map((t, k) =>
                <div key={k}  >
                    <Grid columns={12}>
                        <GridCol span={3} className=''>{t.team.name}</GridCol>
                        <GridCol span={1} className='text-center'>{t.teamId}</GridCol>
                        <GridCol span={6} className=''>{t.team.address1 + ', ' + t.team.address2}</GridCol>
                    </Grid>

                </div>
            )}
        </div >
    )
}

