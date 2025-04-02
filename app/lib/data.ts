'use server'

import { auth } from "@/auth"
import { GroupedStandings, Season, Team, Meet, DiverScore, Entry, DiverWithSeason, AgeGroup, TeamSeason, MeetUpdateInput, } from "./definitions";

import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { delay } from "./delay";
import { getAccessToken } from "@/app/lib/accessTokens"

import { loggerFactory } from '@/app/lib/logger'
const logger = loggerFactory({ module: 'data' })



async function accessToken(): Promise<string> {
    const session = await auth();
    if (!session || !session.user)
        throw new Error('Cant score meet if there is no session')
    const t = await getAccessToken(session.user.id as string);
    if(!t)
        throw new Error('Cant get access token');
    return t;
}

export async function fetchCurrentSeasonId(): Promise<number> {
    return (await fetch(`${process.env.DATA_URL}/current-season-id`, { next: { revalidate: 30 } })).json();
}

export async function fetchSeasons(): Promise<Season[]> {
    return (await fetch(`${process.env.DATA_URL}/seasons`, { next: { revalidate: 30 } })).json();
}

export async function fetchTeams(): Promise<Team[]> {
    return await (await fetch(`${process.env.DATA_URL}/teams`, { next: { revalidate: 30 } })).json();
}

export async function fetchTeamSeasons(seasonId: number): Promise<TeamSeason[]> {
    return await (await fetch(`${process.env.DATA_URL}/team-seasons?season-id=${seasonId}`, { next: { revalidate: 30 } })).json();
}

export async function fetchAgeGroups(): Promise<AgeGroup[]> {
    return await (await fetch(`${process.env.DATA_URL}/agegroups`, { next: { revalidate: 30 } })).json();
}

export async function fetchMeets(seasonId: number): Promise<Meet[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets?season-id=${seasonId}`, { next: { revalidate: 30, tags: ['meets'] } })).json();
}

export async function fetchMeet(meetId: number): Promise<Meet> {
    const r = await fetch(`${process.env.DATA_URL}/meets/${meetId}`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } });
    if (!r.ok)
        throw new Error(`Error retrieving meet ${meetId}: ${r.statusText}`);

    const meet: Meet = await r.json();
    //rehydrate
    return ({
        ...meet,
        meetDate: new Date(meet.meetDate),
        entryDeadline: meet.entryDeadline ? new Date(meet.entryDeadline) : null
    })
}

export async function fetchMeetResults(meetId: number): Promise<DiverScore[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}/results`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } })).json();
}

export async function fetchMeetEntries(meetId: number): Promise<Entry[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}/entries`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } })).json();
}

export async function fetchStandings(seasonId: number): Promise<GroupedStandings> {
    return (await fetch(`${process.env.DATA_URL}/standings/${seasonId}`, { next: { revalidate: 30, tags: ['meets'] } })).json();
}

export async function fetchDivers({ seasonId, teamId }: { seasonId: number, teamId: string }): Promise<DiverWithSeason[]> {
    const session = await auth();
    return (await fetch(
        `${process.env.DATA_URL}/divers/${seasonId}/${teamId}`,
        {
            headers: { Authorization: "Bearer " + "later gator" }
        }
    )).json();
}

export async function scoreMeet(meetId: number, data: Array<any>): Promise<undefined> {
    logger.debug(`Saving scores...`)

    const t = await accessToken();
    const response = await fetch(`${process.env.DATA_URL}/scores/${meetId}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (!response.ok)
        throw new Error('Error posting scores')

    //invalidate the cache for this meet
    revalidateTag(`meet:${meetId}`);
    revalidateTag(`meets`);
}

export async function setPublishedStatus(meetId: number, status: boolean): Promise<void> {
    const t = await accessToken();

    const r = await fetch(`${process.env.DATA_URL}/meets/${meetId}/set-published-status`, {
        method: 'POST',
        body: JSON.stringify({ status }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (!r.ok)
        throw new Error(r.statusText);

    //invalidate the cache for this meet
    revalidateTag(`meet:${meetId}`);
    revalidateTag(`meets`);
}

export async function updateMeet(meetId: number, meet: MeetUpdateInput, teams: string[]): Promise<Meet> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/meets/${meetId}`, {
        method: 'PATCH',
        body: JSON.stringify({meet, teams}),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (!r.ok)
        throw new Error(r.statusText);

    //invalidate the cache for this meet
    revalidateTag(`meet:${meetId}`);
    revalidateTag(`meets`);
    return await(r.json());
}

export async function createMeet(meet: MeetUpdateInput, teams: string[]): Promise<Meet> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/meets`, {
        method: 'POST',
        body: JSON.stringify({meet, teams}),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (!r.ok)
        throw new Error(r.statusText);

    //invalidate the cache for this meet
    revalidateTag(`meets`);
    return await(r.json());
}

export async function deleteMeet(meetId: number): Promise<void> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/meets/${meetId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (!r.ok)
        throw new Error(r.statusText);

    //invalidate the cache for this meet
    revalidateTag(`meets`);
}


