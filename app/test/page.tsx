
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy'; <Table></Table>
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';

export default async function Page() {
    const season = await fetch(`${process.env.DATA_URL}/currentseason`).then(r => r.json());
    const teams = await fetch(`${process.env.DATA_URL}/teams`).then(r => r.json());
    const kteams = keyBy(teams, 'poolcode');
    const meets = await fetch(`${process.env.DATA_URL}/meets?season=2023`).then(r => r.json());
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
        <div>
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
                            <TableRow key={k2}>
                                <TableCell >{format(m.meetDate, 'PPP')}</TableCell>

                                <TableCell className='pl-12'>{m.division}</TableCell>
                                <TableCell>{meetName(m)}</TableCell>
                                <TableCell>{scoreStr(m)}</TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
