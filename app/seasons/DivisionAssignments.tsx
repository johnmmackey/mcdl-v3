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

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from '@/components/ui/button'

import { Team, Season, Division, TeamSeason } from '@/app/lib/definitions';

type divSlotCount = {
    divId: number,
    slotCount: number
}

const transformIndexToDivSeed = (index: number, divSlotCounts: divSlotCount[]): [number, number] => {
    if (index < 0 || index >= seedSlots(divSlotCounts))
        throw new Error(`transformIndexToDivSeed - out of range - index of ${index} vs ${seedSlots(divSlotCounts)}`)

    let prevDivTotal = 0;
    let divIndex = 0;
    while ((index + 1) > prevDivTotal + divSlotCounts[divIndex].slotCount && divIndex < divSlotCounts.length) {
        prevDivTotal += divSlotCounts[divIndex].slotCount;
        divIndex++;
    }
    const divSeed = index - (prevDivTotal) + 1;
    return [divSlotCounts[divIndex].divId, divSeed];
}

const seedSlots = (divSlotsCount: divSlotCount[]) => {
    let count = divSlotsCount.reduce((acc: number, d: divSlotCount) => {
        return acc + d.slotCount
    }, 0);
    return count;
}

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
}: Readonly<{
    teams: Team[],
    divisions: Division[],
    divAssignments: TeamSeason[]
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

console.log(`inside: ${divAssignments.length} divlength: ${JSON.stringify(divSlotCounts)}`)

    // define the ordered list of teams.
    const [orderedTeams, setOrderedTeams] = useState<string[]>(
        divAssignments.toSorted((a, b) => a.divisionId - b.divisionId || a.seed - b.seed).map(ts => ts.teamId)
    );

    // define a flag whether we are editing
    const [editing, setEditing] = useState(false);

    const handleSlotCountChange = (divId: number, val: number) => {
        let newDSC = [...divSlotCounts];
        let target = newDSC.find(e => e.divId === divId);
        if (target)
            target.slotCount = val;
        setDivSlotsCounts(newDSC)
        // potentially truncate the teams array (if there are less slots available now)
        setOrderedTeams(orderedTeams.slice(0, seedSlots(divSlotCounts)));
    }

    const handleDragEnd = (event: DragEndEvent) => {
        console.log(event.active)
        let newArr = [...orderedTeams];
        let indexOfDragged = orderedTeams.indexOf(event.active.id as string);
        console.log(indexOfDragged);

        // if currently seeded, pull it out of old spot
        if (indexOfDragged >= 0)
            newArr.splice(indexOfDragged, 1);

        // if dropped in a seed box, put it in (pushing all subsequent elements one position along)
        if (event.over)
            newArr.splice(Number(event.over.id), 0, event.active.id as string);

        // possible we have pushed beyond the end of the available slots so truncate
        setOrderedTeams(newArr.slice(0, seedSlots(divSlotCounts)));
        return;
    }

    const clearAll = () => setOrderedTeams([]);
    const addDivision = () => {
        let highestCurrentDivisionId = Math.max(...divSlotCounts.map(d => d.divId));
        setDivSlotsCounts([...divSlotCounts, { divId: highestCurrentDivisionId ? highestCurrentDivisionId + 1 : 1, slotCount: 6 }]);
    }
    const deleteLastDivision = () => {
        let newSlots = divSlotCounts.slice(0, divSlotCounts.length - 1);
        setDivSlotsCounts(newSlots);
        setOrderedTeams(orderedTeams.slice(0, seedSlots(newSlots)));
    }



    return (
        <DndContext onDragEnd={handleDragEnd} id={'DndContext'}>    {/*id seems to prevent SSR errors. Consider SSR: false */}
        <div>inside: {divAssignments.length} divlength: {JSON.stringify(divSlotCounts)}</div>
            <div className='flex justify-center gap-2 mb-4'>
                <Button variant='outline' onClick={clearAll}>Clear All</Button>
                <Button variant='outline' onClick={addDivision}>Add A Division</Button>
                <Button variant='outline' onClick={deleteLastDivision}>Delete Last Division</Button>
            </div>
            <div className='flex w-full justify-center gap-8 flex-wrap'>

                {divSlotCounts.map((d, index) => (
                    <Card key={d.divId} className='mb-8'>
                        <CardHeader>
                            <CardTitle className='text-center'>Division {d.divId}</CardTitle>
                        </CardHeader>
                        <CardDescription>
                            <div className='flex justify-center text-sm'># Teams:</div>
                            <div className='flex justify-center'>
                                <Select
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

                        </CardDescription>
                        <CardContent className='px-2 md:p-8'>
                            {Array.from({ length: d.slotCount }).map((n, slotIndex) =>
                                <Droppable key={slotIndex} id={transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)}>
                                    <div className='w-24 min-h-[62px] my-2 p-0 flex justify-center border rounded-lg'>
                                        {orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]
                                            ? <DraggableTeam
                                                id={orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}
                                                label={orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}
                                                fullName={(teams.find(t => t.id === orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)])?.name) || ''}
                                            />
                                            : <span className='mt-3 text-lg opacity-20'>Seed {slotIndex + 1}</span>
                                        }
                                    </div>
                                </Droppable>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div>
                <Card className='mb-8 w-full'>
                    <CardHeader>
                        <CardTitle>Unassigned Teams</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-wrap'>
                        {teams.filter(t => !orderedTeams.includes(t.id)).map((team, index) => (

                            <DraggableTeam key={team.id} id={team.id} label={team.id} fullName={team.name || ''} />

                        ))}

                    </CardContent>
                </Card>
            </div>
        </DndContext>
    )
}

function DraggableTeam(props: { id: string, label: string, fullName: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    }
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    ref={setNodeRef}
                    style={style}
                    {...listeners}
                    {...attributes}
                    className='w-16 m-2 p-2 text-center cursor-move border-2 border-solid rounded-lg bg-slate-200' // border-grey-500/50'
                >
                    {props.label}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{props.fullName}</p>
            </TooltipContent>
        </Tooltip>
    )
}

function Droppable(props: { id: number, children?: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        borderRadius: '8px',
        backgroundColor: isOver ? '#D3D3D3' : undefined,
        //width: 100, height: 100, marginBottom: 20, border: '2px dashed black'
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}