'use client';

import { FormEvent, useActionState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



import { IconDotsVertical } from '@tabler/icons-react';
import { Meet, MeetTeam } from '@/app/lib/definitions'
import { deleteMeet} from '@/app/lib/data';

export const MeetDropDownMenu = (props: {
    meet: Meet
}) => {



    return (

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <IconDotsVertical className="text-white group-hover:text-black" />
                </DropdownMenuTrigger>

                <DropdownMenuContent>

                    <Link href={`/meets/${props.meet.id}/enter`}>
                        <DropdownMenuItem>Enter Divers</DropdownMenuItem>
                    </Link>
                    <Link href={`/meets/${props.meet.id}/scoring`}>
                        <DropdownMenuItem>Enter Scores</DropdownMenuItem>
                    </Link>
                    <Link href={`/meets/${props.meet.id}/roster`}>
                        <DropdownMenuItem>Roster</DropdownMenuItem>
                    </Link>
                    <Link href={`/meets/${props.meet.id}/labels`}>
                        <DropdownMenuItem>Print Labels</DropdownMenuItem>
                    </Link>
                    <Link href={`/meets/${props.meet.id}/results`}>
                        <DropdownMenuItem>View Results</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link href={`/meets/${props.meet.id}/edit`}>
                        <DropdownMenuItem>Edit Meet</DropdownMenuItem>
                    </Link>


                </DropdownMenuContent>
            </DropdownMenu>

    )
}