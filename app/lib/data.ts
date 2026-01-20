'use server'

import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { GroupedStandings, Season, Division, Team, Meet, DiverScore, Entry, DiverWithSeason, AgeGroup, TeamSeason, MeetUpdateInput, GenericServerActionState, TeamSeasonCreateInput, SeasonCreateUpdateInput } from "./definitions";

import jwt from "jsonwebtoken";
import { updateTag } from "next/cache";
import { delay } from "./delay";
import { getAccessToken } from "@/app/lib/accessTokens"

import { loggerFactory } from '@/app/lib/logger'
const logger = loggerFactory({ module: 'data' })

import { logEvent } from "./dynamoEventLog";
import { SetStateAction } from "react";

const throwingFetch = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        if(response.status === 404) {
            notFound();
        } else {
            const text = await response.text();
            throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
        }
    }
    return response;
}

export async function accessToken(): Promise<string> {
    const session = await auth();
    if (!session || !session.user)
        throw new Error('Cant score meet if there is no session')
    const t = await getAccessToken(session.user.id as string);
    if (!t)
        throw new Error('Cant get access token');
    return t;
}

export async function fetchCurrentSeasonId(): Promise<number> {
    return (await fetch(`${process.env.DATA_URL}/current-season-id`, { next: { revalidate: 30 } })).json();
}

export async function fetchSeasons(): Promise<Season[]> {
    return (await fetch(`${process.env.DATA_URL}/seasons`, { next: { revalidate: 30, tags: ['seasons']  } })).json();
}

export async function fetchSeason(seasonId: number): Promise<Season> {
    return (await throwingFetch(`${process.env.DATA_URL}/seasons/${seasonId}`, { next: { revalidate: 30, tags: [`season:${seasonId}`] } })).json();
}

export async function fetchDivisions(): Promise<Division[]> {
    return (await fetch(`${process.env.DATA_URL}/divisions`, { next: { revalidate: 30 } })).json();
}

export async function fetchTeams(): Promise<Team[]> {
    return  (await fetch(`${process.env.DATA_URL}/teams`, { next: { revalidate: 30 } })).json();
}

export async function fetchTeamsForSeason(seasonId: number): Promise<TeamSeason[]> {
    return  (await fetch(`${process.env.DATA_URL}/team-seasons?season-id=${seasonId}&include-team-detail=1`, { next: { revalidate: 30 } })).json();
}

export async function fetchAgeGroups(): Promise<AgeGroup[]> {
    return (await fetch(`${process.env.DATA_URL}/agegroups`, { next: { revalidate: 30 } })).json();
}

export async function fetchMeets(seasonId: number): Promise<Meet[]> {
    return (await fetch(`${process.env.DATA_URL}/meets?season-id=${seasonId}`, { next: { revalidate: 30, tags: ['meets'] } })).json();
}

export async function fetchMeet(meetId: number): Promise<Meet> {
    const r = await fetch(`${process.env.DATA_URL}/meets/${meetId}`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } });
    if (!r.ok)
        throw new Error(`Error retrieving meet ${meetId}: ${r.statusText}`);

    return r.json();
}

export async function fetchMeetResults(meetId: number): Promise<DiverScore[]> {
    return  (await fetch(`${process.env.DATA_URL}/meets/${meetId}/results`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } })).json();
}

export async function fetchMeetEntries(meetId: number): Promise<Entry[]> {
    return  (await fetch(`${process.env.DATA_URL}/meets/${meetId}/entries`, { next: { revalidate: 30, tags: [`meet:${meetId}`] } })).json();
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
    updateTag(`meet:${meetId}`);
    updateTag(`meets`);
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
    updateTag(`meet:${meetId}`);
    updateTag(`meets`);
}

export async function updateMeet(meetId: number, meet: MeetUpdateInput): Promise<GenericServerActionState<Meet>> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/meets/${meetId}`, {
        method: 'PATCH',
        body: JSON.stringify(meet),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (r.ok) {
        updateTag(`meets`);
        updateTag(`meet:${meetId}`);
        await logEvent({ eventType: 'app', eventSubType: 'update', text: `Meet ${meetId} updated` });
        return { error: null, data: null }
    } else {
        const text = await r.text();
        return { error: { msg: r.statusText + (text ? `: ${text}` : ''), seq: Date.now() }, data: null };
    }
}

export async function createMeet(meet: MeetUpdateInput): Promise<GenericServerActionState<Meet>> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/meets`, {
        method: 'POST',
        body: JSON.stringify(meet),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (r.ok) {
        updateTag(`meets`);
        return { error: null, data: null }
    } else {
        const text = await r.text();
        return { error: { msg: r.statusText + (text ? `: ${text}` : ''), seq: Date.now() }, data: null };
    }
}

export async function deleteMeet(meetId: number): Promise<GenericServerActionState<Meet>> {
    console.log('in delete meet')
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/meets/${meetId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (r.ok) {
        updateTag(`meets`);
        return { error: null, data: null }
    } else {
        const text = await r.text();
        return { error: { msg: r.statusText + (text ? `: ${text}` : ''), seq: Date.now() }, data: null };
    }
}

export async function createSeason(seasonId: number, season: SeasonCreateUpdateInput): Promise<GenericServerActionState<Season>> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/seasons`, {
        method: 'POST',
        body: JSON.stringify({...season, id: seasonId}),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (r.ok) {
        updateTag(`seasons`);
        return { error: null, data: null }
    } else {
        const text = await r.text();
        return { error: { msg: r.statusText + (text ? `: ${text}` : ''), seq: Date.now() }, data: null };
    }
}

export async function updateSeason(seasonId: number, season: SeasonCreateUpdateInput): Promise<GenericServerActionState<Season>> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/seasons/${seasonId}`, {
        method: 'PATCH',
        body: JSON.stringify(season),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (r.ok) {
        updateTag(`seasons`);
        return { error: null, data: null }
    } else {
        const text = await r.text();
        return { error: { msg: r.statusText + (text ? `: ${text}` : ''), seq: Date.now() }, data: null };
    }
}

export async function makeSeasonCurrent(seasonId: number): Promise<GenericServerActionState<null>> {
    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/seasons/current-season-id`, {
        method: 'POST',
        body: JSON.stringify({ id: seasonId }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (r.ok) {
        updateTag(`seasons`);
        return { error: null, data: null }
    } else {
        const text = await r.text();
        return { error: { msg: r.statusText + (text ? `: ${text}` : ''), seq: Date.now() }, data: null };
    }
}

export async function deleteSeason(seasonId: number): Promise<GenericServerActionState<Season>> {

    const t = await accessToken();
    const r = await fetch(`${process.env.DATA_URL}/seasons/${seasonId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + t
        },
    });

    if (r.ok) {
        updateTag(`seasons`);
        return { error: null, data: null }
    } else {
        const text = await r.text();
        return { error: { msg: r.statusText + (text ? `: ${text}` : ''), seq: Date.now() }, data: null };
    }
}