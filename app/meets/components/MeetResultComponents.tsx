
import React from 'react';
import { MeetWithTeams } from '@/app/lib/types/meet';
import { AgeGroup } from '@/app/lib/types/diver';
import { LabelValue } from '@/app/ui/LabelValue';


export const MeetScore = ({
    meet,
}: Readonly<{
    meet: MeetWithTeams
}>) => (
        <div className='grid grid-cols-[auto_auto_1fr] gap-x-4 gap-y-0 mt-8 mx-8'>
            {meet
                .teams
                .sort((a, b) => b.score - a.score)
                .map((ts, k) =>
                    <>
                    <div key={ts.teamId} className=''>
                        <strong>{ts.team.name}</strong>
                    </div>
                    <div key={ts.teamId + '-score'} className='text-right '>
                        <span className='font-mono'>{ts.score.toFixed(1)}</span>
                    </div>
                    <div key={ts.teamId + '-padding'} className='text-left '>
                        <span className='font-mono'>&nbsp;</span>
                    </div>
                    </>
                )
            }
        </div>
)

export const MeetScore2 = ({
    meet,
}: Readonly<{
    meet: MeetWithTeams
}>) => (
<div className="grid grid-cols-[auto_1fr] gap-4">
  <div className="bg-gray-200 p-4">

    This column adjusts to the size of its content.
  </div>
  <div className="bg-gray-300 p-4">

    This column takes up the remaining space.
  </div>
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


