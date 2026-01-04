'use client';

import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    //DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IconDotsVertical } from '@tabler/icons-react';
import { Meet } from '@/app/lib/definitions'

export const MeetDropDownMenu = (props: {
    meet: Meet
}) =>
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

