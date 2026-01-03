'use client';

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

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import Loading from "@/app/ui/Loading"



import { IconDotsVertical } from '@tabler/icons-react';
import { Meet, GenericServerActionStatePlaceHolder } from '@/app/lib/definitions'
import { deleteMeet } from '@/app/lib/data';

export const MeetDropDownMenu = (props: {
    meet: Meet,
    onDelete: (id: number) => void
}) => {


    return (
        <>
            <AlertDialog>

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


                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem >Delete Meet</DropdownMenuItem>
                        </AlertDialogTrigger>

                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Are you sure you want to permanently
                            delete this meet?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => props.onDelete(props.meet.id!)}> Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}