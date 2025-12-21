
import React from 'react';
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
    <div className="sticky top-0 z-50 bg-white">
        <h1 className="text-center text-2xl text-bold pt-2">
            {
                meet.name
                || (meet.meetType === 'Dual' && `${team(teams, meet.visitingPool || null)?.name} (${meet.visitingPool}) at ${team(teams, meet.hostPool)?.name} (${meet.hostPool})`)
                || `Meet ID ${meet.id}`
            }
        </h1>
        <h2 className="text-center text-bold">
            {format(meet.meetDate, 'PPP')}
        </h2>
        <h2 className="text-center text-2xl text-bold py-4">
            {children}
        </h2>
    </div>
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
            .teams
            .sort((a, b) => b.score - a.score)
            .map((ts, k) =>
                <div key={k} className='grid grid-cols-4'>
                    <div className='col-span-3 text-left font-semibold'>
                        {team(teams, ts.teamId)?.name}</div>
                    <div className='col-span-1 text-right font-semibold'>{ts.score.toFixed(1)}</div>
                </div>
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
                            <div className='grid grid-cols-1'>
                                <div className='col-span-1 font-bold text-xl'>{ageGroup.name}</div>
                            </div>
                            <div className='ml-4'>
                                <GroupHeader />
                                <Placeholder>
                                    {
                                        renderContent(ageGroup)
                                    }
                                </Placeholder>
                            </div>
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
            : <div className='grid grid-cols-1'>
                <div className='col-span-1'>
                    <em>No Divers In This Age Group</em>
                </div>
            </div>
    )
}

const team = (teams: Team[], teamId: string | null) => teams.find(e => e.id === teamId);

