import Link from 'next/link';
import { auth } from '@/auth';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button"

import { fetchTeams, fetchMeets, fetchCurrentSeasonId, deleteMeet } from '@/app/lib/data';
import { userCan } from '@/app/lib/userCan';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import Loading from '@/app/ui/Loading'
import { Meet, GenericServerActionStatePlaceHolder } from '@/app/lib/definitions'
import { Suspense } from 'react';

import { MeetDropDownMenu } from './MeetDropDownMenu';
import { MeetListClient } from './MeetListClient'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export default async function Page(props: {
    searchParams: Promise<{ 'season-id': number, active?: Boolean }>
}) {

    const searchParams = await props.searchParams;
    const currentSeasonId = await fetchCurrentSeasonId();

    const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;


    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                    <SeasonSelector base="/meets" selectedSeasonId={selectedSeasonId} />
                </div>

                <div className="col-span-3">
                    <Link href={"/meets/_/edit"}><Button>Add New</Button></Link>
                </div>
            </div>

            <Suspense fallback={Loading()} key={`${searchParams['season-id']}`}>
                <MeetList season={selectedSeasonId} />
            </Suspense>
        </>
    )
}

async function MeetList(props: {
    season: number
}) {
    const teams = await fetchTeams();
    const kteams = keyBy(teams, 'id');
    const meets = await fetchMeets(props.season);
    const smeets = sortBy(meets, ['meetDate', 'divisionId']);
    const gmeets = groupBy(smeets, e => format(e.meetDate, 'PPP'));

    return (
        <MeetListClient season={props.season} kteams={kteams} gmeets={gmeets} />
    )
}