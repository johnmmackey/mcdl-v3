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
import { child } from 'winston';



export const TestDnD = ({
    teams,
    seasons,
    divisions
}: Readonly<{
    teams: Team[],
    seasons: Season[],
    divisions: Division[]
}>) => {

    const divSlots = [1,2,3,4,5,6];
    //const emptyDivisions = () => Array.from({ length: divisions.length }, () => Array.from({ length: divSlots.length }, () => null));
    const [divTeams, setDivTeams] = useState<(Team)[][]>([[]]);

    function handleDragEnd(event: any) {
        console.log(event)
        /*
        if (event.over) {
            let [divId, slot] = event.over.id.split('-').map((x: string) => parseInt(x));
            let team = teams.find(t => t.id === event.active.id);

            // deep clone the existing 
            let newDivTeams: Team[][] = []


        } else {
            const team = teams.find(t => t.id === event.active.id);
            if (team && divTeams.includes(team)) {
                setDivTeams(divTeams.filter(t => t.id !== team.id));
            }
        }
            */
    }
console.log('divTeams', divTeams);
    return (

        <DndContext onDragEnd={handleDragEnd} id={'DndContext'}>    {/*id seems to prevent SSR errors. Consider SSR: false */}
            <div className='flex gap-10'>
                <div >
                    {teams.filter(t => !divTeams.flat().includes(t)).map(team => (
                        <DraggableTeam key={team.id} id={team.id}> {team.name} </DraggableTeam>
                    ))}
                </div>
                <div>
                    {divisions.map( (d, divIndex) => (
                        <div key={d.id}>
                            <h2 > Division {d.id} </h2>
                            {divSlots.map( (slot, slotIndex) => 
                                <Droppable key={slot} id={d.id.toString() + '-' + slot.toString()}>
                                    <div style={{ width: 400, height: 50, border: '2px dashed gray' }} className='p-4'>
                                        Div-Slot ({d.id}-{slot})

                                        {divTeams[divIndex][slotIndex] &&
                                                <DraggableTeam key={ divTeams[divIndex][slotIndex].id} id={divTeams[divIndex][slotIndex].id}> {divTeams[divIndex][slotIndex].name} </DraggableTeam>   
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