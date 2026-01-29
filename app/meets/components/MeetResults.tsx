import { fetchTeams, fetchMeet, fetchMeetResults, fetchAgeGroups } from '@/app/lib/data';
import { MeetScore, AgeGroupGrid } from '@/app/meets/components/MeetResultComponents';
import { DiverScore, AgeGroup } from '@/app/lib/definitions'
import { PublishButton } from '@/app/meets/components/PublishButton';
import { MeetWithTeams } from '@/app/lib/types';

export async function MeetResults(props: { meet: MeetWithTeams }) {


    const [ageGroups, meetResults] = await Promise.all(
        [
            fetchAgeGroups(),
            fetchMeetResults(props.meet.id),
        ]
    );

    return (
        <div style={{ maxWidth: '800px' }}>

            {/* Fix: authorization issue here */}
            <div className='flex justify-between'>
 
                <div>
                    {/* Team Score */}
                    {props.meet.meetType != 'Star' &&

                        <MeetScore meet={props.meet} />
                    }
                </div>
                               <PublishButton meet={props.meet} />
            </div>
            <AgeGroupGrid
                GroupHeader={ResultsHeaderHOC(props.meet.meetType)}
                ageGroups={ageGroups}
                renderContent={(ag: AgeGroup) => {
                    return (
                        meetResults
                            .filter(e => e.ageGroupId === (ag as AgeGroup).id)
                            .sort((a: DiverScore, b: DiverScore) => b.score - a.score)
                            .map((result, k) =>
                                <ResultsElement key={k} ag={ag} result={result} meetType={props.meet.meetType} />
                            )
                    )
                }}
            />
        </div >
    )
}

const ResultsHeaderHOC = (meetType: string) => {
    const Header = () => {
        return (
            <div className='grid grid-cols-8'>
                <div className='col-span-1 font-semibold text-lg'>Pool</div>
                <div className='col-span-3 font-semibold text-lg'>Diver</div>
                <div className="col-span-1 text-right font-semibold text-lg">Score</div>
                <div className="col-span-1 text-center font-semibold text-lg">
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
            <div className='col-span-1'>{result.teamId}</div>
            <div className='col-span-3'><span className="font-semibold">{result.diver.lastName}</span>, {result.diver.firstName}</div>
            <div className='col-span-1 text-right font-mono'>{result.score.toFixed(2)}</div>
            <div className="col-span-1 text-center">
                {meetType != 'Star' &&
                    <span className='font-mono'>{result.points || ''}</span>
                }
                {result.exhibition ? 'EX' : ''}
            </div>
            <div className='col-span-2'>
                {result.ageGroupId !== result.diverAgeGroupId &&
                    <>
                        {` ** Dive Up ** `}
                        {result.scoreAgeGroup > 0 &&
                            <span className='font-mono'>{`(${result.scoreAgeGroup.toFixed(2)})`}</span>
                        }
                    </>
                }
            </div>
        </div>
    )
}

