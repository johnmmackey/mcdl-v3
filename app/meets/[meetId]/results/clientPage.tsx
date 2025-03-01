"use client"
import { useState, useEffect, use } from 'react';
import { Grid, GridCol, } from '@mantine/core';
import { fetchTeams, fetchMeet, fetchMeetResults, fetchAgeGroups } from '@/app/lib/data';
import { MeetHeading, MeetScore, AgeGroupGrid } from '@/app/meets/[meetId]/MeetComponents';
import { DiverScore, AgeGroup, Team, Meet } from '@/app/lib/definitions'
import { PublishButton } from './PublishButton';

export default function Page(props: { params: Promise<{ meetId: number }> }) {
    const params = use(props.params);
    const [teams, setTeams] = useState([] as Team[]);
    const [meet, setMeet] = useState({} as Meet);
    const [ageGroups, setAgeGroups] = useState([] as AgeGroup[]);
    const [meetResults, setMeetResults] = useState([] as DiverScore[]);

    useEffect(() => {

        Promise.all(
            [
                fetchTeams(),
                fetchMeet(params.meetId),
                fetchAgeGroups(),
                fetchMeetResults(params.meetId),
            ]
        )
            .then(d => {
                setTeams(d[0]); setMeet(d[1]); setAgeGroups(d[2]); setMeetResults(d[3])
                //const [teams, meet, ageGroups, meetResults] = d;
            })

    }, [params.meetId]);

    const handlePublish = () => {
        console.log('handling publish')
        fetchMeetResults(params.meetId)
            .then(r => setMeetResults(r));
    }


    return (
        <>
            {meet?.id && meetResults &&
                <div style={{ maxWidth: '800px' }}>
                    <MeetHeading meet={meet} teams={teams}>
                        {!meet.scoresPublished &&
                            <span className="text-red-500">Preliminary&nbsp;</span>
                        }
                        Meet Results
                    </MeetHeading>

                    {/* Fix: authorization issue here */}
                    <PublishButton meet={meet} onClick={handlePublish} />

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
            }

        </>
    )
}

const ResultsHeaderHOC = (meetType: string) => {
    const Header = () => {
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
    return Header;
}

const ResultsElement = ({ result, meetType, ag }: { result: DiverScore, meetType: string, ag: AgeGroup }) => {
    return (
        <Grid columns={8} className='hover:bg-slate-200'>
            <GridCol span={1} className='py-1'>{result.teamId}</GridCol>
            <GridCol span={3} className='py-1'><span className="text-lg font-semibold">{result.diver.lastName}</span>, {result.diver.firstName}</GridCol>
            <GridCol span={1} className='py-1 text-right'>{result.score.toFixed(2)}</GridCol>
            <GridCol span={1} className="py-1 text-center">
                {meetType != 'Star' &&
                    (result.points || '')
                }
                {result.exhibition ? 'EX' : ''}
            </GridCol>
            <GridCol span={2} className='py-1'>
                {result.ageGroupId !== result.diverAgeGroupId &&
                    <>
                        {` ** Dive Up ** `}
                        {result.scoreAgeGroup > 0 &&
                            `(${result.scoreAgeGroup.toFixed(2)})`
                        }
                    </>
                }
            </GridCol>
        </Grid>
    )
}

