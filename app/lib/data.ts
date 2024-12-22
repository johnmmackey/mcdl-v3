import { auth } from "@/auth"
import { GroupedStandings, Season, Team, Meet, DiverScore, Entry, Diver, AgeGroup } from "./definitions";
import jwt from "jsonwebtoken";


export async function fetchCurrentSeason(): Promise<Season> {
    return (await fetch(`${process.env.DATA_URL}/currentseason`, { next: { revalidate: 30 } })).json();
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
    return await (await fetch(`${process.env.DATA_URL}/meets?season-id=${seasonId}`, { next: { revalidate: 30 } })).json();
}

export async function fetchMeet(meetId: number): Promise<Meet> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}`, { next: { revalidate: 30 } })).json();
}

export async function fetchMeetResults(meetId: number): Promise<DiverScore[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}/results`, { next: { revalidate: 30 } })).json();
}

export async function fetchMeetEntries(meetId: number): Promise<Entry[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${meetId}/entries`, { next: { revalidate: 30 } })).json();
}

export async function fetchStandings(seasonId: number): Promise<GroupedStandings> {
    console.log(`Fetching standings...`)
    return (await fetch(`${process.env.DATA_URL}/standings/${seasonId}`, { next: { revalidate: 30 } })).json();
}

export async function fetchDivers({ seasonId, poolcode }: { seasonId: number, poolcode: string }): Promise<Diver[]> {
    const session = await auth();
    const token = jwt.sign({ sub: session?.user?.email, groups: session?.user?.profile?.groups }, 'secret')
    return (await fetch(
        `${process.env.DATA_URL}/divers/${seasonId}/${poolcode}`,
        {
            headers: { Authorization: "Bearer " + token }
        }
    )).json();
}

const delay = (ms: number) => {
    return new Promise( resolve => {
        setTimeout(resolve, ms);
    });
}