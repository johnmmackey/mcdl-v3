
import React from 'react';
import { MeetWithTeams } from '@/app/lib/types/meet';
import { AgeGroup } from '@/app/lib/types/diver';


export const MeetScore = ({
    meet,
}: Readonly<{
    meet: MeetWithTeams
}>) => (
    <div style={{ width: '300px' }} className="border-solid border-2 p-4">
        {meet
            .teams
            .sort((a, b) => b.score - a.score)
            .map((ts, k) =>
                <div key={k} className='grid grid-cols-4 '>
                    <div className='col-span-3 text-left font-semibold '>
                        <span >{ts.team.name}</span>
                    </div>
                    <div className='col-span-1 text-right font-semibold'>
                        <span className='font-mono'>{ts.score.toFixed(1)}</span>
                    </div>
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


