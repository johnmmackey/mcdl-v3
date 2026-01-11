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

import { Grip } from 'lucide-react';

import { Team, Season, Division } from '@/app/lib/definitions';
import { de } from 'date-fns/locale';

const divSlotIds = [1, 2, 3, 4, 5, 6];

type DivSlotNode = {
    divId: number;
    slotId: number;
    team: Team;
}

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

const keyByTeamId = (nodes: DivSlotNode[]) => {
    const map: { [key: string]: DivSlotNode } = {};
    nodes.forEach(node => {
        map[node.team.id] = node;
    });
    return map;
}

export const TestDnD = ({
    teams,
    seasons,
    divisions
}: Readonly<{
    teams: Team[],
    seasons: Season[],
    divisions: Division[]
}>) => {

    const [assignedTeamsMappedByCompositeId, setAssignedTeamsMappedByCompositeId] = useState<{ [key: string]: DivSlotNode }>({});
    const [assignedTeamsMappedByTeamId, setAssignedTeamsMappedByTeamId] = useState<{ [key: string]: DivSlotNode }>({});

    function handleDragEnd(event: any) {
        console.log(event);
        let draggedTeam = teams.find(t => t.id === event.active.id);
        if(!draggedTeam) throw new Error('Dragged team not found: ' + event.active.id);

        if (event.over) {
            let [divId, slotId] = decodeCompositeId(event.over.id);
            console.log('dropping in div', divId, 'slot', slotId);

            // copy the existing states
            let newAssignedTeamsMappedByCompositeId = { ...assignedTeamsMappedByCompositeId };
            let newAssignedTeamsMappedByTeamId = { ...assignedTeamsMappedByTeamId };

            // see if there is an existing team in the slot, and if so, bump it.
            if (newAssignedTeamsMappedByCompositeId[event.over.id]) {
                let teamInTargetSlot = newAssignedTeamsMappedByCompositeId[event.over.id].team;
                // remove existing team from teamId map
                delete newAssignedTeamsMappedByTeamId[teamInTargetSlot.id];
                // remove existing team from compositeId map
                delete newAssignedTeamsMappedByCompositeId[event.over.id];
            }

            // see if the dragged team is already assigned to a different slot, and if so, remove it from there.
            if (newAssignedTeamsMappedByTeamId[draggedTeam.id]) {
                let oldNode = newAssignedTeamsMappedByTeamId[draggedTeam.id];
                // remove existing team from teamId map
                delete newAssignedTeamsMappedByTeamId[draggedTeam.id];
                // remove existing team from compositeId map
                delete newAssignedTeamsMappedByCompositeId[encodeCompositeId(oldNode.divId, oldNode.slotId)];
            }

            // assign dragged team to the new slot

            const newNode: DivSlotNode = {
                divId: divId,
                slotId: slotId,
                team: draggedTeam
            };
            newAssignedTeamsMappedByCompositeId[event.over.id] = newNode;
            newAssignedTeamsMappedByTeamId[draggedTeam.id] = newNode;


            // update states
            setAssignedTeamsMappedByCompositeId(newAssignedTeamsMappedByCompositeId);
            setAssignedTeamsMappedByTeamId(newAssignedTeamsMappedByTeamId);

        } else {
            console.log('dropped outside any droppable area');
            // remove from assigned teams if it was assigned
            if (assignedTeamsMappedByTeamId[draggedTeam!.id]) {
                let newAssignedTeamsMappedByCompositeId = { ...assignedTeamsMappedByCompositeId };
                let newAssignedTeamsMappedByTeamId = { ...assignedTeamsMappedByTeamId };

                let nodeToRemove = assignedTeamsMappedByTeamId[draggedTeam!.id];
                let compositeIdToRemove = encodeCompositeId(nodeToRemove.divId, nodeToRemove.slotId);

                delete newAssignedTeamsMappedByCompositeId[compositeIdToRemove];
                delete newAssignedTeamsMappedByTeamId[draggedTeam!.id];

                // update states
                setAssignedTeamsMappedByCompositeId(newAssignedTeamsMappedByCompositeId);
                setAssignedTeamsMappedByTeamId(newAssignedTeamsMappedByTeamId);
            }
        }

    }

    return (

        <DndContext onDragEnd={handleDragEnd} id={'DndContext'}>    {/*id seems to prevent SSR errors. Consider SSR: false */}
            <div className='flex gap-10'>
                <div >
                    {teams.filter(t => !assignedTeamsMappedByTeamId[t.id]).map(team => (
                        <DraggableTeam key={team.id} id={team.id}> {team.name} </DraggableTeam>
                    ))}
                </div>
                <div>
                    {divisions.map((d) => (
                        <div key={d.id}>
                            <h2 > Division {d.id} </h2>
                            {divSlotIds.map((slot) =>
                                <Droppable key={slot} id={encodeCompositeId(d.id, slot)}>
                                    <div style={{ width: 400, height: 100, border: '2px dashed gray' }} className='p-4'>

                                        {assignedTeamsMappedByCompositeId[encodeCompositeId(d.id, slot)] &&
                                            <DraggableTeam id={assignedTeamsMappedByCompositeId[encodeCompositeId(d.id, slot)].team.id}>
                                                {assignedTeamsMappedByCompositeId[encodeCompositeId(d.id, slot)].team.name}
                                            </DraggableTeam>
                                        }
                                    </div>
                                </Droppable>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DndContext>
    );



}

function DraggableTeamX(props: { id: string; children?: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 10 }}>  {/* spacing between draggable items */}
            <Draggable id={props.id}>
                {props.children}
            </Draggable>
        </div>
    );
}





function DraggableTeam(props: { id: string, children: React.ReactNode }) {
    return (
        <Draggable id={props.id} className='w-64 my-2'>

            <Item variant="outline" >
                <ItemMedia variant="default" className='opacity-50'>
                    <Grip />
                </ItemMedia>
                <ItemContent>
                    <ItemDescription>
                        {props.children} ({props.id})
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


function Droppable(props: { id: string, children?: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
        //width: 100, height: 100, marginBottom: 20, border: '2px dashed black'
    };


    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}