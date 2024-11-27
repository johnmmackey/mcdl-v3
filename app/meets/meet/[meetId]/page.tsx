
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { fetchTeams, fetchMeetResults } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ meetId: number }> }) {
    const params = await props.params;

    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'poolcode');
    const results = await fetchMeetResults(params.meetId);

    const meetName = () => {
        const m = results.meet;

        return (m.name
            || (m.meetType === 'Dual' && `${kteams[m.visitingPool || '']?.name} at ${kteams[m.hostPool || '']?.name}`)
            || `Meet ID ${params.meetId}`
        );
    }

    const meetDateStr = () => format(results.meet.meetDate, 'PPP');

    return (
        <div>

            <h1 className="text-center text-2xl text-bold py-4">Meet Results for {meetName()}</h1>
            <h2 className="text-center text-xl text-bold pb-4">{meetDateStr()}</h2>

            {results.meet.meetType != 'Star' &&
                <Table className="w-96">
                    <TableBody>
                        {results.meet.meetsPools.map((ts, k) =>
                            <TableRow key={k}>
                                <TableCell className='py-1'>{kteams[ts.poolcode].name}</TableCell>
                                <TableCell className='py-1'>{ts.score.toFixed(1)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            }

            {results.ageGroups.map((ag, k) =>
                <div key={k} className='my-8'>
                    <Table striped>
                        <TableHead>
                            <TableHeadCell colSpan={5}>{ag.name}</TableHeadCell>
                        </TableHead>
                        <TableHead>
                            <TableHeadCell className="w-32">Pool</TableHeadCell>
                            <TableHeadCell className="w-96">Diver</TableHeadCell>
                            <TableHeadCell className="w-16">Score</TableHeadCell>
                            <TableHeadCell className="w-16 text-center">
                            {results.meet.meetType != 'Star' &&
                                'Points'
                            }
                            </TableHeadCell>
                            <TableHeadCell className="w-64"></TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {!results.diverScoresByAgeGrp[ag.id] &&
                                <TableRow>
                                    <TableCell colSpan={5} className='py-1'>
                                        <em>No Divers In This Age Group</em>
                                    </TableCell>
                                </TableRow>
                            }
                            {(results.diverScoresByAgeGrp[ag.id] || []).map((ds, k) =>
                                <TableRow key={k}>
                                    <TableCell className='py-1'>{ds.team}</TableCell>
                                    <TableCell className='py-1'>{ds.firstName} {ds.lastName}</TableCell>
                                    <TableCell className='py-1'>{ds.score.toFixed(2)}</TableCell>
                                    <TableCell className="py-1 text-center">
                                        {results.meet.meetType != 'Star' &&
                                            (ds.agRank.rankPoints || '')
                                        }
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
