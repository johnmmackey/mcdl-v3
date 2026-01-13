'use client';

import React, { useState, useEffect, Children } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Grip } from 'lucide-react';

import { Team, Season, Division, TeamSeason } from '@/app/lib/definitions';
import { all } from 'micromatch';

//const divSlotIds = [1, 2, 3, 4, 5, 6];

/*
type DivSlotNode = {
    divId: number;
    slotId: number;
    team: Team;
}
*/
/*
const encodeCompositeId = (divId: number, slotId: number) => divId.toString() + '-' + slotId.toString();
const decodeCompositeId = (id: string): [number, number] => id.split('-').map((x: string) => parseInt(x)) as [number, number];

const keyByCompositeId = (nodes: DivSlotNode[]) => {
    const map: { [key: string]: DivSlotNode } = {};
    nodes.forEach(node => {
        const id = encodeCompositeId(node.divId, node.slotId);
        map[id] = node;
    });
    return map;
}
*/

type divSlotCount = {
    divId: number,
    slotCount: number
}

const transformIndexToDivSeed = (index: number, divSlotCounts: divSlotCount[]): [number, number] => {
    let prevDivTotal = 0;
    let divIndex = 0;
    while ((index + 1) > prevDivTotal + divSlotCounts[divIndex].slotCount && divIndex < divSlotCounts.length) {
        prevDivTotal += divSlotCounts[divIndex].slotCount;
        divIndex++;
    }
    const divSeed = index - (prevDivTotal) + 1;
    return [divSlotCounts[divIndex].divId, divSeed];
}

const transformDivSeedToIndex = (divId: number, seed: number, divSlotCounts: divSlotCount[]): number => {
    let index = divSlotCounts.reduce((acc, curr) => {
        if (curr.divId < divId) return acc + curr.slotCount;
        else return acc;
    }, 0);
    index += (seed - 1);
    return index;
}

export const TestDnD = ({
    teams,
    seasons,
    divisions,
    lastDivAssignments = [],
}: Readonly<{
    teams: Team[],
    seasons: Season[],
    divisions: Division[],
    lastDivAssignments: TeamSeason[]
}>) => {

    //const [assignedTeamsMappedByTeamId, setAssignedTeamsMappedByTeamId] = useState<{ [key: string]: DivSlotNode }>({});
    // maintain a helper state mapping by compositeId for easy lookup during rendering
    //const [assignedTeamsMappedByCompositeId, setAssignedTeamsMappedByCompositeId] = useState<{ [key: string]: DivSlotNode }>({});

    // build a array of divisions and slot counts based on lastDivAssignments
    let divSlotCounts: divSlotCount[] = [];
    divisions.forEach(d => {
        let slotCount = lastDivAssignments.filter(ts => ts.divisionId === d.id).length;
        divSlotCounts.push({ divId: d.id, slotCount });
    });


    // order an array of teams
    const divSeedSortedTeams = lastDivAssignments.toSorted((a, b) => a.divisionId - b.divisionId || a.seed - b.seed).map(ts => ts.teamId);

    // define the ordered list of teams.
    const [orderedTeams, setOrderedTeams] = useState<string[]>(divSeedSortedTeams);

    function handleDragEnd(event: any) {
        console.log(event);


        let newArr = [...orderedTeams];
        let indexOfDragged = orderedTeams.indexOf(event.active.id);
        console.log(indexOfDragged);
        if(indexOfDragged >= 0)
            newArr.splice(indexOfDragged, 1);

        if (event.over) {
            if(indexOfDragged === -1)
                // new elements coming in - pull last one
                newArr.splice(newArr.length - 1, 1);
            //insert the team at its new position
            newArr.splice(event.over.id, 0, event.active.id);
        }
        setOrderedTeams(newArr);








        return;

    }

    return (
            <DndContext onDragEnd={handleDragEnd} id={'DndContext'}>    {/*id seems to prevent SSR errors. Consider SSR: false */}



                <div className='flex gap-8'>

            <div>
                <Card className='mb-8'>
                    <CardHeader>
                        <CardTitle>Unassigned Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teams.filter(t => !orderedTeams.includes(t.id)).map((team, index) => (
                            <Item key={index}variant='outline' className='w-42 h-18 my-2 p-0'>
                                <ItemContent>
                                    <DraggableTeam key={team.id} id={team.id}> {team.id} </DraggableTeam>
                                </ItemContent>
                            </Item>
                        ))}

                    </CardContent>
                </Card>
            </div>

                    <div>
                        {divSlotCounts.map((d, index) => (
                            <Card key={index} className='mb-8'>
                                <CardHeader>
                                    <CardTitle>Division {d.divId}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {Array.from({ length: d.slotCount }).map((n, slotIndex) =>
                                        <Droppable key={slotIndex} id={transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)}>
                                            <Item variant='outline' className='w-42 h-18 my-2 p-0'>
                                                <ItemContent>
                                                    {orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)] &&
                                                        <DraggableTeam id={orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}>
                                                            {orderedTeams[transformDivSeedToIndex(d.divId, slotIndex + 1, divSlotCounts)]}
                                                        </DraggableTeam>
                                                    }

                                                </ItemContent>
                                            </Item>
                                        </Droppable>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </div>
            </DndContext>


    )

}

function DraggableTeam(props: { id: string, children: React.ReactNode }) {
    return (
        <Draggable id={props.id} className='w-32 m-2'>
            <Item variant="outline" size='sm' className='text-center cursor-move'>
                <ItemContent>
                    <ItemDescription>
                        {props.children}
                    </ItemDescription>
                </ItemContent>
            </Item>

        </Draggable>
    )
}

function Draggable(props: { id: string; className?: string, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={props.className}>
            {props.children}
        </div>
    );
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