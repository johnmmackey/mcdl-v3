
import React from 'react';
import { Grid, GridCol } from '@mantine/core'
import { format } from 'date-fns';
import { AgeGroup, DiverScore, Meet, Team, Entry } from '@/app/lib/definitions';

export const MeetHeading = ({
    meet,
    teams,
    children,
}: Readonly<{
    meet: Meet,
    teams: Team[],
    children?: React.ReactNode
}>) => (
    <>
        <h1 className="text-center text-2xl text-bold pt-2">
            {
                meet.name
                || (meet.meetType === 'Dual' && `${team(teams, meet.visitingPool)?.name} (${meet.visitingPool}) at ${team(teams, meet.hostPool)?.name} (${meet.hostPool})`)
                || `Meet ID ${meet.id}`
            }
        </h1>
        <h2 className="text-center text-bold">
            {format(meet.meetDate, 'PPP')}
        </h2>
        <h2 className="text-center text-2xl text-bold py-4">
            {children}
        </h2>
    </>
)


export const MeetScore = ({
    meet,
    teams,
    children,
}: Readonly<{
    meet: Meet,
    teams: Team[],
    children?: React.ReactNode
}>) => (
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

export const AgeGroupGrid = ({
    ageGroups,
    GroupHeader,
    renderContent,
}: Readonly<{
    ageGroups: AgeGroup[],
    GroupHeader: React.FC,
    renderContent: any,
}>) => {
    return (
        <>
            {
                ageGroups.map((ageGroup, k1) => {
                    return (
                        <div key={k1} className='my-8'>
                            {/* Preset an age group title */}
                            <Grid columns={1}>
                                <GridCol span={1} className='font-bold text-xl'>{ageGroup.name}</GridCol>
                            </Grid>
                            <GroupHeader />
                            <Placeholder>
                                {
                                    renderContent(ageGroup)
                                }
                            </Placeholder>
                        </div>
                    )
                })
            }
        </>
    )
}

const Placeholder = ({
    children
}: Readonly<{
    children?: any
}>) => {
    return (
        (children instanceof Array ? children.length : children)
            ? children
            : <Grid>
                <GridCol span={4} offset={1}>
                    <em>No Divers In This Age Group</em>
                </GridCol>
            </Grid>
    )
}

const team = (teams: Team[], poolcode: string | null) => teams.find(e => e.poolcode === poolcode);

