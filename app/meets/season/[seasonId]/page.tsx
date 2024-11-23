import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeadCell } from 'flowbite-react';
import { LinkTableRow } from '@/app/ui/LinkTableRow';
import { fetchTeams, fetchMeets } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ seasonId: number }> }) {
    const params = await props.params;

    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'poolcode');
    const meets = await fetchMeets(params.seasonId);
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
        <Table striped>
            <TableHead>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Division</TableHeadCell>
                <TableHeadCell>Meet Name</TableHeadCell>
                <TableHeadCell>Score</TableHeadCell>
            </TableHead>
            <TableBody>
                {Object.entries(gmeets).map(([dt, meets], k1) =>
                    meets.map((m, k2) =>
                        <LinkTableRow key={k2} className='cursor-pointer hover:bg-slate-400 hover:text-white' href={`/meets/meet/${m.id}`}>
                            <TableCell className='py-2'>{format(m.meetDate, 'PPP')}</TableCell>
                            <TableCell className='pl-12 py-2'>{m.division || 'NDM'}</TableCell>
                            <TableCell className='py-2'>{meetName(m)}</TableCell>
                            <TableCell className='py-2'>{scoreStr(m)}</TableCell>
                        </LinkTableRow>
                    )
                )}
            </TableBody>
        </Table>
    )
}
