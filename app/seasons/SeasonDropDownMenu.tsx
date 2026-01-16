

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
import { Season } from '@/app/lib/definitions'

export const SeasonDropDownMenu = (props: {
    season: Season
}) =>
    <DropdownMenu>
        <DropdownMenuTrigger>
            <IconDotsVertical className="text-white group-hover:text-black" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
            <Link href={`/seasons/${props.season.id}`}>
                <DropdownMenuItem>View {props.season.id}</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`#`}>
                <DropdownMenuItem>Make {props.season.id} Current Season</DropdownMenuItem>
            </Link>

            <Link href={`/seasons/${props.season.id}/edit`}>
                <DropdownMenuItem>Edit {props.season.id}</DropdownMenuItem>
            </Link>

        </DropdownMenuContent>
    </DropdownMenu>

