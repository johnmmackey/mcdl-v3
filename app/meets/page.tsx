import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Grid, GridCol, Button, Menu, MenuTarget, MenuDropdown, MenuItem, MenuDivider, MenuLabel } from '@mantine/core';
import { fetchTeams, fetchMeets, fetchCurrentSeasonId, fetchTeamSeasons } from '@/app/lib/data';
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
                    <SeasonSelector base="/meets" selectedSeasonId={selectedSeasonId} />
                </GridCol>

                <GridCol span={3}>
                    <Link href={"/meets/_/edit"}><Button>Add New</Button></Link>
                </GridCol>
            </Grid>

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
    const smeets = sortBy(meets, ['meetDate', 'division']);
    const gmeets = groupBy(smeets, e => format(e.meetDate, 'PPP'));

    const meetName = (m: Meet) => m.name || (m.hostPool && m.visitingPool && `${kteams[m.visitingPool].name} at ${kteams[m.hostPool].name}`);
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

                    <Grid columns={6}>
                        <GridCol span={1} className='text-center font-semibold'>Division</GridCol>
                        <GridCol span={3} className='text-center font-semibold'>Meet Name</GridCol>
                        <GridCol span={1} className='text-center font-semibold'>Score</GridCol>
                    </Grid>

                    {meets.map((m, k2) =>
                            <Grid key={k2} className='group hover:bg-slate-200' columns={6} >
                                <GridCol span={1} className='text-center'>{m.divisionId && m.divisionId < 99 ? m.divisionId : 'NDM'}</GridCol>
                                <GridCol span={3} className=''>
                                    <div>{meetName(m)}</div>
                                </GridCol>
                                <GridCol span={1} className='text-center'>
                                    <div>{scoreStr(m)}</div>
                                </GridCol>
                                <GridCol span={1} className='text-center'>
                                        <Menu shadow="md" width={200}>
                                            <MenuTarget>
                                                <IconDotsVertical className="text-white group-hover:text-black"/>
                                            </MenuTarget>

                                            <MenuDropdown>
                                                <Link href={`/meets/${m.id}/enter`}>
                                                    <MenuItem leftSection={<IconLogin2 size={14} />}>
                                                        Enter Divers
                                                    </MenuItem>
                                                </Link>
                                                <Link href={`/meets/${m.id}/scoring`}>
                                                    <MenuItem leftSection={<IconClipboardData size={14} />} >
                                                        Enter Scores
                                                    </MenuItem>
                                                </Link>
                                                <Link href={`/meets/${m.id}/roster`}>
                                                    <MenuItem leftSection={<IconPlus size={14} />}>
                                                        Roster
                                                    </MenuItem>
                                                </Link>
                                                <Link href={`/meets/${m.id}/labels`}>
                                                    <MenuItem leftSection={<IconTag size={14} />} >
                                                        Print Labels
                                                    </MenuItem>
                                                </Link>
                                                <Link href={`/meets/${m.id}/results`}>
                                                    <MenuItem leftSection={<IconFileSpreadsheet size={14} />} >
                                                        View Results
                                                    </MenuItem>
                                                </Link>
                                                <MenuDivider />
                                                <MenuLabel>Admin</MenuLabel>
                                                <Link href={`/meets/${m.id}/edit`}>
                                                    <MenuItem leftSection={<IconPencil size={14} />} >
                                                        Edit Meet
                                                    </MenuItem>
                                                </Link>

                                            </MenuDropdown>
                                        </Menu>

                                </GridCol>
                            </Grid>

                    )}
                </div>
            )}
        </div >
    )
}

