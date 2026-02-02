'use client';

import React, { useState, useEffect, Children } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from '@/components/ui/button'

import { Team, Season, Division, TeamSeasonWithTeam, TeamSeasonCreateInput, DivisionAssignment } from '@/app/lib/types';

type divSlotCount = {
    divId: number,
    slotCount: number
}

// Find total number of seeding slots across all divisions
const totalSeedSlots = (divSlotsCount: divSlotCount[]) => {
    let count = divSlotsCount.reduce((acc: number, d: divSlotCount) => {
        return acc + d.slotCount
    }, 0);
    return count;
}

// get an ordered array of the deepest seed indexs for all divisions
const getDeepestSeedIndexs = (divSlotCounts: divSlotCount[]): number[] =>
    [1, 2, 3, 4, 5, 6].slice(0, Math.max(...divSlotCounts.map(d => d.slotCount), 0));

// transform an overall index (into the ordered teams array) into a [divisionId, seed] reference
const transformIndexToDivSeed = (index: number, divSlotCounts: divSlotCount[]): [number, number] => {
    if (index < 0 || index >= totalSeedSlots(divSlotCounts))
        throw new Error(`transformIndexToDivSeed - out of range - index of ${index} vs ${totalSeedSlots(divSlotCounts)}`)

    let prevDivTotal = 0;
    let divIndex = 0;
    while ((index + 1) > prevDivTotal + divSlotCounts[divIndex].slotCount && divIndex < divSlotCounts.length) {
        prevDivTotal += divSlotCounts[divIndex].slotCount;
        divIndex++;
    }
    const divSeed = index - (prevDivTotal) + 1;
    return [divSlotCounts[divIndex].divId, divSeed];
}

// the inverse - transform a [divisionId, seed] into an index in the ordered teams array
const transformDivSeedToIndex = (divId: number, seed: number, divSlotCounts: divSlotCount[]): number => {
    let index = divSlotCounts.reduce((acc, curr) => {
        if (curr.divId < divId) return acc + curr.slotCount;
        else return acc;
    }, 0);
    index += (seed - 1);
    return index;
}

export const DivisionAssignments = ({
    teams,
    divisions,
    divAssignments = [],
    editMode = false,
    onChange
}: Readonly<{
    teams: Team[],
    divisions: Division[],
    divAssignments: DivisionAssignment[],
    editMode?: boolean,
    onChange?: (newAssignments: TeamSeasonCreateInput[]) => void   
}>) => {
    // build a array of divisions and slot counts based on divAssignments
    const [divSlotCounts, setDivSlotsCounts] = useState(divisions
        .map(d =>
        ({
            divId: d.id,
            slotCount: divAssignments.filter(ts => ts.divisionId === d.id).length
        }))
        .filter(dsc => dsc.slotCount)
    );
    const [orderedTeams, setOrderedTeamsLocally] = useState(divAssignments.toSorted((a, b) => a.divisionId - b.divisionId || a.seed - b.seed).map(ts => ts.teamId));

    const setOrderedTeams = (newOrderedTeams: string[]) => {
        setOrderedTeamsLocally(newOrderedTeams);
        // set up a data structure to send to the onChange handler
        if (onChange) {
            let newAssignments: TeamSeasonCreateInput[] = [];
            newOrderedTeams.forEach((teamId, index) => {
                let [divId, seed] = transformIndexToDivSeed(index, divSlotCounts);
                newAssignments.push({
                  teamId: teamId,
                    divisionId: divId,
                    seed: seed,
                });
            })
            onChange(newAssignments);
        }
        return;
    }

    const teamsKeyedById: Record<string, Team> = teams.reduce((acc, team) => {
        acc[team.id] = team;
        return acc;
    }, {} as Record<string, Team>);

    const handleSlotCountChange = (divId: number, val: number) => {
        let newDSC = [...divSlotCounts];
        let target = newDSC.find(e => e.divId === divId);
        if (target)
            target.slotCount = val;
        setDivSlotsCounts(newDSC)
        // potentially truncate the teams array (if there are less slots available now)
        setOrderedTeams(orderedTeams.slice(0, totalSeedSlots(divSlotCounts)));

    }

    const handleDragEnd = (event: DragEndEvent) => {
        let newArr = [...orderedTeams];
        let indexOfDragged = orderedTeams.indexOf(event.active.id as string);

        // if currently seeded, pull it out of old spot
        if (indexOfDragged >= 0)
            newArr.splice(indexOfDragged, 1);

        // if dropped in a seed box, put it in (pushing all subsequent elements one position along)
        if (event.over)
            newArr.splice(Number(event.over.id), 0, event.active.id as string);

        // possible we have pushed beyond the end of the available slots so truncate
        newArr.slice(0, totalSeedSlots(divSlotCounts))
        setOrderedTeams(newArr);
    }

    const clearAll = () => setOrderedTeams([]);
    const addDivision = () => {
        let highestCurrentDivisionId = Math.max(...divSlotCounts.map(d => d.divId), 0);
        setDivSlotsCounts([...divSlotCounts, { divId: highestCurrentDivisionId + 1, slotCount: 6 }]);
    }
    const deleteLastDivision = () => {
        let newSlots = divSlotCounts.slice(0, divSlotCounts.length - 1);
        setDivSlotsCounts(newSlots);
        setOrderedTeams(orderedTeams.slice(0, totalSeedSlots(newSlots)));
    }

    return (
        <DndContext onDragEnd={handleDragEnd} id={'DndContext'}>    {/*id seems to prevent SSR errors. Consider SSR: false */}
            {editMode &&
                <div className='flex justify-center gap-2 mb-4'>
                    <Button variant='outline' type='button' onClick={clearAll}>Clear All</Button>
                    <Button variant='outline' type='button' onClick={addDivision}>Add A Division</Button>
                    <Button variant='outline' type='button' onClick={deleteLastDivision}>Delete Last Division</Button>
                </div>
            }

            {/* Header */}
            <div className='w-full flex gap-0' >
                <Box xtraClassName='hidden sm:block'>&nbsp;</Box>
                {divSlotCounts.map(d =>
                    <Box key={d.divId}><span className='hidden xl:block'>Division</span><span className='hidden max-xl:block'>Div</span>&nbsp;{d.divId}</Box>
                )}
            </div>

            {/* Team count selector */}
            {editMode &&
                <div className='w-full flex gap-0' >
                    <Box xtraClassName='hidden sm:block'>&nbsp;</Box>
                    {divSlotCounts.map(d =>
                        <Box key={d.divId}>
                            <div>
                                <div className='flex justify-center text-sm'># Teams</div>
                                <div className='flex justify-center mb-4' >
                                    <Select
                                        key={d.divId}
                                        value={d.slotCount.toString()}
                                        onValueChange={val => handleSlotCountChange(d.divId, Number(val))}
                                    >
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="# teams" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {[2, 3, 4, 5, 6].map(n => (
                                                <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </Box>
                    )}
                </div >
            }

            {getDeepestSeedIndexs(divSlotCounts).map(seedIndex =>
                <div key={seedIndex} className='w-full flex gap-0'>
                    <Box xtraClassName='hidden sm:flex'>
                        <span className='pl-8'>Seed {seedIndex}</span>
                    </Box>
                    {divSlotCounts.map(d => ({ ...d, slotIndex: transformDivSeedToIndex(d.divId, seedIndex, divSlotCounts) })).map(d =>
                        <DroppableBox key={d.divId} dropId={d.slotIndex} hidden={seedIndex > d.slotCount}>
                            {seedIndex <= d.slotCount
                                ? (orderedTeams[d.slotIndex]
                                    ? <DraggableTeam
                                        id={orderedTeams[d.slotIndex]}
                                        label={orderedTeams[d.slotIndex]}
                                        fullName={teamsKeyedById[orderedTeams[d.slotIndex]]?.name || ''}
                                        draggable={editMode}
                                    />
                                    : <span></span>
                                )
                                : <span>N/A</span>
                            }
                        </DroppableBox>
                    )}
                </div>
            )}

            {editMode &&
                <div className='mt-4'>
                    <Card className='mb-8 w-full'>
                        <CardHeader>
                            <CardTitle>Unassigned Teams</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-wrap'>
                            {teams.filter(t => !orderedTeams.includes(t.id)).map((team, index) => (

                                <DraggableTeam key={team.id} id={team.id} label={team.id} fullName={teamsKeyedById[team.id]?.name || ''} draggable={true} />

                            ))}

                        </CardContent>
                    </Card>
                </div>
            }
        </DndContext >
    )
}

const Box = (props: { xtraClassName?: string | undefined, ref?: React.Ref<HTMLDivElement>, style?: Record<string, any>, children?: React.ReactNode }) => {
    return (
        <div className={'w-full max-w-50 min-h-[62px] p-0 m-1 flex justify-center items-center ' + (props.xtraClassName || '')} ref={props.ref} style={props.style} >
            {props.children}
        </div>
    )
}

function DroppableBox(props: { dropId: number, hidden?: boolean, children?: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.dropId,
        disabled: props.hidden || false
    });
    const style = {
        backgroundColor: isOver ? '#D3D3D3' : undefined,
        //width: 100, height: 100, marginBottom: 20, border: '2px dashed black'
    };

    return (
        <Box ref={setNodeRef} xtraClassName={'border ' + (props.hidden ? 'invisible' : '')} style={style}>
            {props.children}
        </Box>
    );
}

function DraggableTeam(props: { id: string, label: string, fullName: string, draggable: boolean }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
        disabled: !props.draggable
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={'w-16 xl:w-40 m-2 p-2 text-center border-2 border-solid rounded-lg bg-slate-200 ' + (props.draggable ? 'cursor-move' : '')}
        >
            <div >{props.label}</div>
            <div className='max-xl:hidden mx-2 text-sm truncate'>{props.fullName}</div>
        </div>
    )
}