import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem } from 'flowbite-react';
import { LinkTableRow } from '@/app/ui/LinkTableRow';
import { fetchTeams, fetchMeets, fetchCurrentSeason } from '@/app/lib/data';
import { meetPermissions } from '@/app/lib/definitions';
import { SeasonalPage } from '@/app/ui/SeasonalPage';

export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number }>
}) {
    const searchParams = await props.searchParams;
    const currentSeason = await fetchCurrentSeason();

    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeason.id;
    const session = (await auth());

    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'poolcode');

    const meets = await fetchMeets(selectedSeasonId);
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

    return (
        <SeasonalPage base="/meets" heading="Meet Schedule & Results" selectedSeasonId={selectedSeasonId}>
            <Table striped>
                <TableHead>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Division</TableHeadCell>
                    <TableHeadCell>Meet Name</TableHeadCell>
                    <TableHeadCell>Score</TableHeadCell>
                    {session?.user &&
                        <TableHeadCell>Actions</TableHeadCell>
                    }
                </TableHead>
                <TableBody>
                    {Object.entries(gmeets).map(([dt, meets], k1) =>
                        meets.map((m, k2) =>
                            <TableRow key={k2}>
                                <TableCell className='py-2'>{format(m.meetDate, 'PPP')}</TableCell>
                                <TableCell className='pl-12 py-2'>{m.division || 'NDM'}</TableCell>
                                <TableCell className='py-2'>{meetName(m)}</TableCell>
                                <TableCell className='py-2'>
                                    <a href={`/meets/${m.id}`}>
                                        {scoreStr(m)}
                                    </a>
                                </TableCell>
                                {meetPermissions(session, m).length > 0 &&
                                    <TableCell>


                                        <div className="flex items-center gap-4">
                                            <Dropdown label="" size="sm">
                                                {meetPermissions(session, m).includes('viewRoster') &&
                                                    <>
                                                        <Link href={`/roster/${m.id}`}>
                                                            <DropdownItem>
                                                                View Roster
                                                            </DropdownItem>
                                                        </Link>
                                                        <DropdownItem>Labels</DropdownItem>
                                                        <DropdownItem>Scoring Worksheet</DropdownItem>
                                                    </>

                                                }
                                                {meetPermissions(session, m).includes('enterScores') &&
                                                    <DropdownItem>Enter Scores</DropdownItem>
                                                }
                                            </Dropdown>
                                        </div>
                                    </TableCell>
                                }
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </SeasonalPage>
    )
}
