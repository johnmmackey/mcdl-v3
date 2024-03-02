
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { SeasonDropdown } from '@/app/ui/SeasonDropdown';

export default async function Page({ params }: { params: { meet: string } }) {

    const teams = await (await fetch(`${process.env.DATA_URL}/teams`)).json();
    const kteams = keyBy(teams, 'poolcode');
    const results = await (await fetch(`${process.env.DATA_URL}/meetresults/${params.meet}`)).json();

    const meetName = () => {
        let m = results.meetInfo;

        return (m.name
        || (m.meetType === 'Dual' && `${kteams[m.visitingPool].name} at ${kteams[m.hostPool].name}`)
        || `Meet ID ${params.meet}`
        ) + ` (${format(m.meetDate, 'PPP')})`;
    }

    return (
        <div>
            <h1 className="text-center text-2xl text-bold py-4">Meet Results for {meetName()}</h1>
            <Table className="w-96">
                <TableBody>
                    {results.teamScores.map((ts:any, k:number) =>
                        <TableRow key={k}>
                            <TableCell className='py-1'>{kteams[ts.team].name}</TableCell>
                            <TableCell className='py-1'>{ts.score.toFixed(1)}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {results.ageGroups.map((ag: any, k:number) =>
                <div key={k} className='my-8'>
                    <Table striped>
                        <TableHead>
                            <TableHeadCell colSpan={5}>{ag.name}</TableHeadCell>
                        </TableHead>
                        <TableHead>
                            <TableHeadCell className="w-32">Pool</TableHeadCell>
                            <TableHeadCell className="w-96">Diver</TableHeadCell>
                            <TableHeadCell className="w-16">Score</TableHeadCell>
                            <TableHeadCell className="w-16 text-center">Points</TableHeadCell>
                            <TableHeadCell className="w-64"></TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {!results.diverScores[ag.id] &&
                                <TableRow>
                                    <TableCell colSpan={5} className='py-1'>
                                        <em>No Divers In This Age Group</em>
                                    </TableCell>
                                </TableRow>
                            }
                            {(results.diverScores[ag.id] || []).map((ds:any, k:number) =>
                                <TableRow key={k}>
                                    <TableCell className='py-1'>{ds.team}</TableCell>
                                    <TableCell className='py-1'>{ds.firstName} {ds.lastName}</TableCell>
                                    <TableCell className='py-1'>{ds.score.toFixed(2)}</TableCell>
                                    <TableCell className="py-1 text-center">
                                        {ds.agRank.rankPoints || ''}
                                        {ds.exhibition ? 'EX' : ''}
                                    </TableCell>
                                    <TableCell className='py-1'>
                                        {ds.diverAgeGroupId !== ag.id && ' ** Dive Up **'}
                                        {ds.diverAgeGroupScore && ` (${ds.diverAgeGroupScore})`}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
