'use server'

import { auth } from "@/auth"
import { GroupedStandings, Season, Team, Meet, DiverScore, Entry, Diver, AgeGroup } from "./definitions";

import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { delay } from "./delay";
import { getAccessToken } from "@/app/lib/accessTokens"

import { loggerFactory } from '@/app/lib/logger'
const logger = loggerFactory({module: 'data'})


export async function fetchCurrentSeasonId(): Promise<number> {
    return (await fetch(`${process.env.DATA_URL}/current-season-id`, { next: { revalidate: 30 } })).json();
}

export async function fetchSeasons(): Promise<Season[]> {
    return (await fetch(`${process.env.DATA_URL}/seasons`, { next: { revalidate: 30 } })).json();
}

export async function fetchTeams(): Promise<Team[]> {
    return await (await fetch(`${process.env.DATA_URL}/teams`, { next: { revalidate: 30 } })).json();
}

export async function fetchAgeGroups(): Promise<AgeGroup[]> {
    return await (await fetch(`${process.env.DATA_URL}/agegroups`, { next: { revalidate: 30 } })).json();
}

export async function fetchMeets(seasonId: number): Promise<Meet[]> {
    console.log(`Delaying fetch by ${process.env.FETCH_DELAY || 0} ms...`)
    await delay(Number(process.env.FETCH_DELAY) || 0);
    return await (await fetch(`${process.env.DATA_URL}/meets?season-id=${seasonId}`, { next: { revalidate: 30, tags: ['meets'] } })).json();
}

export async function fetchMeet(meetId: number): Promise<Meet> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } })).json();
}

export async function fetchMeetResults(meetId: number): Promise<DiverScore[]> {
    console.log('fetch meet results')
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}/results`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } })).json();
}

export async function fetchMeetEntries(meetId: number): Promise<Entry[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}/entries`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } })).json();
}

export async function fetchStandings(seasonId: number): Promise<GroupedStandings> {
    console.log(`Fetching standings...`)
    return (await fetch(`${process.env.DATA_URL}/standings/${seasonId}`, { next: { revalidate: 30, tags: ['meets'] } })).json();
}

export async function fetchDivers({ seasonId, poolcode }: { seasonId: number, poolcode: string }): Promise<Diver[]> {
    const session = await auth();
    return (await fetch(
        `${process.env.DATA_URL}/divers/${seasonId}/${poolcode}`,
        {
            headers: { Authorization: "Bearer " + "later gator" }
        }
    )).json();
}

export async function scoreMeet(meetId: number, data: Array<any>): Promise<undefined> {
    logger.debug(`Saving scores...`)
    const session = await auth();
    if(!session || !session.user)
        throw new Error('Cant score meet if there is no session')

    const accessToken = await getAccessToken(session.user.id as string);
    let response = await fetch(`${process.env.DATA_URL}/scores/${meetId}`, {
        method: 'POST',
        body:JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
          },
     });

     if(!response.ok)
        throw new Error('Error posting scores')

     //invalidate the cache for this meet
     revalidateTag(`meet:${meetId}`);
     revalidateTag(`meets`);
}

export async function setPublishedStatus(meetId: number, status: boolean): Promise<undefined> {
    console.log('setting published status to', status)
    let r = await fetch(`${process.env.DATA_URL}/meets/${meetId}/set-published-status`, {
        method: 'POST',
        body:JSON.stringify({status}),
        headers: {
            "Content-Type": "application/json",
          },
     });

     if(!r.ok)
        throw new Error(r.statusText);

     //invalidate the cache for this meet
    revalidateTag(`meet:${meetId}`);
    revalidateTag(`meets`);
}