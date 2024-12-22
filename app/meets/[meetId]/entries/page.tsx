
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableThead, TableTr, TableTh, TableTd, TableTbody } from '@mantine/core';
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
                    <TableTbody>
                        {results.meet.meetsPools.map((ts, k) =>
                            <TableTr key={k}>
                                <TableTd className='py-1'>{kteams[ts.poolcode].name}</TableTd>
                                <TableTd className='py-1'>{ts.score.toFixed(1)}</TableTd>
                            </TableTr>
                        )}
                    </TableTbody>
                </Table>
            }

            {results.ageGroups.map((ag, k) =>
                <div key={k} className='my-8'>
                    <Table striped>
                        <TableThead>
                            <TableTr>
                                <TableTh colSpan={5}>{ag.name}</TableTh>
                            </TableTr>
                        </TableThead>
                        <TableThead>
                            <TableTr>
                                <TableTh className="w-32">Pool</TableTh>
                                <TableTh className="w-96">Diver</TableTh>
                                <TableTh className="w-16">Score</TableTh>
                                <TableTh className="w-16 text-center">
                                    {results.meet.meetType != 'Star' &&
                                        'Points'
                                    }
                                </TableTh>
                                <TableTh className="w-64"></TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>
                            {!results.diverScoresByAgeGrp[ag.id] &&
                                <TableTr>
                                    <TableTd colSpan={5} className='py-1'>
                                        <em>No Divers In This Age Group</em>
                                    </TableTd>
                                </TableTr>
                            }
                            {(results.diverScoresByAgeGrp[ag.id] || []).map((ds, k) =>
                                <TableTr key={k}>
                                    <TableTd className='py-1'>{ds.team}</TableTd>
                                    <TableTd className='py-1'>{ds.firstName} {ds.lastName}</TableTd>
                                    <TableTd className='py-1'>{ds.score.toFixed(2)}</TableTd>
                                    <TableTd className="py-1 text-center">
                                        {results.meet.meetType != 'Star' &&
                                            (ds.agRank.rankPoints || '')
                                        }
                                        {ds.exhibition ? 'EX' : ''}
                                    </TableTd>
                                    <TableTd className='py-1'>
                                        {ds.diverAgeGroupId !== ag.id && ' ** Dive Up **'}
                                        {ds.diverAgeGroupScore && ` (${ds.diverAgeGroupScore})`}
                                    </TableTd>
                                </TableTr>
                            )}
                        </TableTbody>
                    </Table>
                </div>
            )}
        </div>
    )
}
