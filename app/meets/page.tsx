import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableThead, TableTr, TableTh, TableTd, TableTbody } from '@mantine/core';
import { LinkTableRow } from '@/app/ui/LinkTableRow';
import { fetchTeams, fetchMeets, fetchCurrentSeason } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonalPage } from '@/app/ui/SeasonalPage';
import { ActionDropdown } from '../ui/ActionDropdown';

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

    console.log('testing userCan')
    console.log(`userCan view Results: `, userCan('meet', meets[0], 'viewResults', session));

    return (
        <SeasonalPage base="/meets" heading="Meet Schedule & Results" selectedSeasonId={selectedSeasonId}>
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
                            <LinkTableRow key={k2} href={`/meets/${m.id}`} className='cursor-pointer hover:bg-slate-200' inactive={!userCan('meet', m, 'viewResults', session)}> 
                                <TableTd className='py-2'>{format(m.meetDate, 'PPP')}</TableTd>
                                <TableTd className='pl-12 py-2'>{m.division || 'NDM'}</TableTd>
                                <TableTd className='py-2'>{meetName(m)}</TableTd>
                                <TableTd className='py-2'>
                                    <a href={`/meets/${m.id}`}>
                                        {scoreStr(m)}
                                    </a>
                                </TableTd>
                                {false && //meetPermissions(session, m).length > 0 &&
                                    <TableTd>


                                        <div className="flex items-center gap-4">
blah
                                        </div>
                                    </TableTd>
                                }
                                <TableTd>
                                <ActionDropdown />
                                </TableTd>
                            </LinkTableRow>
                        )
                    )}
                </TableTbody>
            </Table>
        </SeasonalPage>
    )
}
