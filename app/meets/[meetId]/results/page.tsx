import { Grid, GridCol } from '@mantine/core';
import { fetchTeams, fetchMeet, fetchMeetResults, fetchAgeGroups } from '@/app/lib/data';
import { MeetHeading, MeetScore, AgeGroupIterator } from '@/app/meets/[meetId]/MeetComponents';
import { Meet, DiverScore, AgeGroup } from '@/app/lib/definitions'

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
            <MeetHeading meet={meet} teams={teams}>Meet Results</MeetHeading>

            {/* Team Score */}
            {meet.scoresPublished && meet.meetType != 'Star' &&
                <MeetScore meet={meet} teams={teams} />
            }

            <AgeGroupIterator
                ageGroups={ageGroups}
                meet={meet}
                iteree={meetResults}
                field='diverAgeGroupId'
                GroupHeader={ResultsHeader}
                GroupElement={ResultsElement}
                groupSort={(a: DiverScore, b:DiverScore) => b.score - a.score}
            />
        </div>
    )
}

export const ResultsHeader = ({meet}: {meet: Meet}) =>
{
    return (
        <Grid columns={8}>
            <GridCol span={1} className='font-semibold'>Pool</GridCol>
            <GridCol span={3} className='font-semibold'>Diver</GridCol>
            <GridCol span={1} className="text-right font-semibold">Score</GridCol>
            <GridCol span={1} className="text-center font-semibold">
                {meet.meetType != 'Star' &&
                    'Points'
                }
            </GridCol>
        </Grid>
    )
}

export const ResultsElement = ({e, k, meet, ag }: {e: DiverScore, k:number, meet: Meet, ag: AgeGroup}) => {
    return (
            <Grid key={k} columns={8} className='hover:bg-slate-200'>
                <GridCol span={1} className='py-1'>{e.team}</GridCol>
                <GridCol span={3} className='py-1'>{e.firstName} {e.lastName}</GridCol>
                <GridCol span={1} className='py-1 text-right'>{e.score.toFixed(2)}</GridCol>
                <GridCol span={1} className="py-1 text-center">
                    {meet.meetType != 'Star' &&
                        (e.agRank.rankPoints || '')
                    }
                    {e.exhibition ? 'EX' : ''}
                </GridCol>
                <GridCol span={2} className='py-1'>
                    {e.diverAgeGroupId !== ag.id && ' ** Dive Up **'}
                    {e.diverAgeGroupScore && ` (${e.diverAgeGroupScore})`}
                </GridCol>
            </Grid>
    )
}

