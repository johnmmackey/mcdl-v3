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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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


export const TestDnD = ({
    teams,
    seasons,
    divisions
}: Readonly<{
    teams: Team[],
    seasons: Season[],
    divisions: Division[]
}>) => {

    const [assignedTeamsMappedByTeamId, setAssignedTeamsMappedByTeamId] = useState<{ [key: string]: DivSlotNode }>({});
    // maintain a helper state mapping by compositeId for easy lookup during rendering
    const [assignedTeamsMappedByCompositeId, setAssignedTeamsMappedByCompositeId] = useState<{ [key: string]: DivSlotNode }>({});

    function handleDragEnd(event: any) {
        console.log(event);
        let draggedTeam = teams.find(t => t.id === event.active.id);
        if (!draggedTeam) throw new Error('Dragged team not found: ' + event.active.id);

        // copy the existing state
        let newAssignedTeamsMappedByTeamId = { ...assignedTeamsMappedByTeamId };

        if (event.over) {
            // dropped in a droppable area. first see if there is an existing team in the slot, and if so, bump it.
            if (assignedTeamsMappedByCompositeId[event.over.id])
                delete newAssignedTeamsMappedByTeamId[assignedTeamsMappedByCompositeId[event.over.id].team.id];

            // assign dragged team to the new slot - implicitly removes it from any previous slot
            let [divId, slotId] = decodeCompositeId(event.over.id);
            newAssignedTeamsMappedByTeamId[draggedTeam.id] = {divId, slotId, team: draggedTeam};
        } else {
            // dropped outside any droppable area. remove from assigned teams if it was assigned
            if (assignedTeamsMappedByTeamId[draggedTeam!.id])
                delete newAssignedTeamsMappedByTeamId[draggedTeam!.id];
        }
        // update the main state
        setAssignedTeamsMappedByTeamId(newAssignedTeamsMappedByTeamId);
        // rebuild our helper state to be consistent with the main state
        setAssignedTeamsMappedByCompositeId(keyByCompositeId(Object.values(newAssignedTeamsMappedByTeamId)));
    }

    return (

        <DndContext onDragEnd={handleDragEnd} id={'DndContext'}>    {/*id seems to prevent SSR errors. Consider SSR: false */}
            <div className='flex gap-20'>

                <div >
                    {teams.filter(t => !assignedTeamsMappedByTeamId[t.id]).map(team => (
                        <DraggableTeam key={team.id} id={team.id}> {team.name} </DraggableTeam>
                    ))}
                </div>

                <div>
                    {divisions.map((d) => (
                        <Card key={d.id} className='mb-8'>
                            <CardHeader>
                                <CardTitle>Division {d.id}</CardTitle>
                            </CardHeader>
                            <CardContent>
                            {divSlotIds.map((slot) =>
                                <Droppable key={slot} id={encodeCompositeId(d.id, slot)}>
                                    <Item variant='outline' className='w-74 h-18 my-2 p-0'>
                                        <ItemContent>
                                        {assignedTeamsMappedByCompositeId[encodeCompositeId(d.id, slot)] &&
                                            <DraggableTeam id={assignedTeamsMappedByCompositeId[encodeCompositeId(d.id, slot)].team.id}>
                                                {assignedTeamsMappedByCompositeId[encodeCompositeId(d.id, slot)].team.name}
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
        <Draggable id={props.id} className='w-64 m-2'>
            <Item variant="outline" size='sm'>
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