
import React from 'react';
import { Grid, GridCol } from '@mantine/core'
import { format } from 'date-fns';
import { AgeGroup, Meet, Team } from '@/app/lib/definitions';

export const MeetHeading = ({
    meet,
    teams,
    children,
}: Readonly<{
    meet: Meet,
    teams: Team[],
    children?: React.ReactNode
}>) => {

    const meetName = () =>
        meet.name
        || (meet.meetType === 'Dual' && `${team(teams, meet.visitingPool)?.name} at ${team(teams, meet.hostPool)?.name}`)
        || `Meet ID ${meet.id}`;

    const meetDateStr = () => format(meet.meetDate, 'PPP');

    return (
        <>
            <h1 className="text-center text-2xl text-bold pt-2">{meetName()}</h1>
            <h2 className="text-center text-bold">{meetDateStr()}</h2>
            <h2 className="text-center text-2xl text-bold py-4">
                {children}
            </h2>
        </>
    )
}

export const MeetScore = ({
    meet,
    teams,
    children,
}: Readonly<{
    meet: Meet,
    teams: Team[],
    children?: React.ReactNode
}>) => {

    return (
        <div style={{ maxWidth: '300px' }} className="border-solid border-2 p-4">
            {meet
                .meetsPools
                .sort((a, b) => b.score - a.score)
                .map((ts, k) =>
                    <Grid key={k} columns={4}>
                        <GridCol span={3} className='text-left font-semibold'>
                            {team(teams, ts.poolcode)?.name}</GridCol>
                        <GridCol span={1} className='text-right font-semibold'>{ts.score.toFixed(1)}</GridCol>
                    </Grid>
                )
            }
        </div>
    )
}

export const AgeGroupIterator = ({
    ageGroups,
    meet,
    iteree,
    field,
    GroupHeader,
    GroupElement,
    groupSort
}: Readonly<{
    ageGroups: AgeGroup[],
    meet: Meet,
    iteree: any[],
    field: string,
    GroupHeader: React.FC<{ meet: Meet }>,
    GroupElement: React.FC<{ meet: Meet, ag: AgeGroup, e:any, k:number }>,
    groupSort: (a: any, b: any) => number
}>) => {

    return (
        <>
            {
                ageGroups.map((ag, k) =>
                    <div key={k} className='my-8'>
                        <Grid key={k} columns={1}>
                            <GridCol span={1} className='font-bold text-xl'>{ag.name}</GridCol>
                        </Grid>

                        {!iteree
                            .filter(e => e[field] === ag.id)
                            .length
                            ? <Grid>
                                <GridCol span={4} offset={1}>
                                    <em>No Divers In This Age Group</em>
                                </GridCol>
                            </Grid>

                            : <>
                                <GroupHeader meet={meet} />
                                {iteree
                                    .filter(e => e[field] === ag.id)
                                    .sort(groupSort)
                                    .map( (e, k) =>
                                        <GroupElement meet={meet} e={e} ag={ag} k={k}/>
                                    )
                                }
                            </>
                        }
                    </div>
                )
            }
        </>
    )
}

function team(teams: Team[], poolcode: string | null) {
    return teams.find(e => e.poolcode === poolcode);
}
