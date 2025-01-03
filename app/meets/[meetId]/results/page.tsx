import { Grid, GridCol } from '@mantine/core';
import { fetchTeams, fetchMeet, fetchMeetResults, fetchAgeGroups } from '@/app/lib/data';
import { MeetHeading, MeetScore, AgeGroupGrid } from '@/app/meets/[meetId]/MeetComponents';
import { DiverScore, AgeGroup } from '@/app/lib/definitions'

export default async function Page(props: { params: Promise<{ meetId: number }> }) {
    const params = await props.params;

    const [teams, meet, ageGroups, meetResults] = await Promise.all(
        [
            fetchTeams(),
            fetchMeet(params.meetId),
            fetchAgeGroups(),
            fetchMeetResults(params.meetId),
        ]
    );

    return (

        <div style={{ maxWidth: '800px' }}>
            <MeetHeading meet={meet} teams={teams}>
                {!meet.scoresPublished &&
                    <span className="text-red-500">Preliminary&nbsp;</span>
                }
                Meet Results
            </MeetHeading>

            {/* Team Score */}
            {meet.scoresPublished && meet.meetType != 'Star' &&
                <MeetScore meet={meet} teams={teams} />
            }


            <AgeGroupGrid
                GroupHeader={ResultsHeaderHOC(meet.meetType)}
                ageGroups={ageGroups}
                renderContent={(ag: AgeGroup) => {
                    return (
                        meetResults
                            .filter(e => e.ageGroupId === (ag as AgeGroup).id)
                            .sort((a: DiverScore, b: DiverScore) => b.score - a.score)
                            .map((result, k) =>
                                <ResultsElement key={k} ag={ag} result={result} meetType={meet.meetType} />
                            )
                    )
                }}
            />
        </div>
    )
}

const ResultsHeaderHOC = (meetType: string) =>
    () => {
        return (
            <Grid columns={8}>
                <GridCol span={1} className='font-semibold'>Pool</GridCol>
                <GridCol span={3} className='font-semibold'>Diver</GridCol>
                <GridCol span={1} className="text-right font-semibold">Score</GridCol>
                <GridCol span={1} className="text-center font-semibold">
                    {meetType != 'Star' &&
                        'Points'
                    }
                </GridCol>
            </Grid>
        )
    }

const ResultsElement = ({ result, meetType, ag }: { result: DiverScore, meetType: string, ag: AgeGroup }) => {
    return (
        <Grid columns={8} className='hover:bg-slate-200'>
            <GridCol span={1} className='py-1'>{result.team}</GridCol>
            <GridCol span={3} className='py-1'>{result.firstName} {result.lastName}</GridCol>
            <GridCol span={1} className='py-1 text-right'>{result.score.toFixed(2)}</GridCol>
            <GridCol span={1} className="py-1 text-center">
                {meetType != 'Star' &&
                    (result.agRank.rankPoints || '')
                }
                {result.exhibition ? 'EX' : ''}
            </GridCol>
            <GridCol span={2} className='py-1'>
                {result.diverAgeGroupId !== ag.id && ' ** Dive Up **'}
                {result.diverAgeGroupScore && ` (${result.diverAgeGroupScore})`}
            </GridCol>
        </Grid>
    )
}

