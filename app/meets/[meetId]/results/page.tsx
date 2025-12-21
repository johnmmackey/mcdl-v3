import { fetchTeams, fetchMeet, fetchMeetResults, fetchAgeGroups } from '@/app/lib/data';
import { MeetHeading, MeetScore, AgeGroupGrid } from '@/app/meets/[meetId]/MeetComponents';
import { DiverScore, AgeGroup } from '@/app/lib/definitions'
import { PublishButton } from './PublishButton';

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

            {/* Fix: authorization issue here */}
            <PublishButton meet={meet} />

            {/* Team Score */}
            {meet.meetType != 'Star' &&
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

const ResultsHeaderHOC = (meetType: string) => {
    const Header = () => {
        return (
            <div className='grid grid-cols-8'>
                <div className='col-span-1 font-semibold'>Pool</div>
                <div className='col-span-3 font-semibold'>Diver</div>
                <div className="col-span-1 text-right font-semibold">Score</div>
                <div className="col-span-1 text-center font-semibold">
                    {meetType != 'Star' &&
                        'Points'
                    }
                </div>
            </div>
        )
    }
    return Header;
}

const ResultsElement = ({ result, meetType, ag }: { result: DiverScore, meetType: string, ag: AgeGroup }) => {
    return (
        <div className='grid grid-cols-8 hover:bg-slate-200'>
            <div className='col-span-1 py-1'>{result.teamId}</div>
            <div className='col-span-3 py-1'><span className="text-lg font-semibold">{result.diver.lastName}</span>, {result.diver.firstName}</div>
            <div className='col-span-1 py-1 text-right'>{result.score.toFixed(2)}</div>
            <div className="col-span-1 py-1 text-center">
                {meetType != 'Star' &&
                    (result.points || '')
                }
                {result.exhibition ? 'EX' : ''}
            </div>
            <div className='col-span-2 py-1'>
                {result.ageGroupId !== result.diverAgeGroupId &&
                    <>
                        {` ** Dive Up ** `}
                        {result.scoreAgeGroup > 0 &&
                            `(${result.scoreAgeGroup.toFixed(2)})`
                        }
                    </>
                }
            </div>
        </div>
    )
}

