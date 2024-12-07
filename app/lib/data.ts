import { auth } from "@/auth"
import { GroupedStandings, Season, Team, Meet, MeetResult, Diver, AgeGroup } from "./definitions";
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
    return await (await fetch(`${process.env.DATA_URL}/agegroups`)).json();
}

export async function fetchMeets(seasonId: number): Promise<Meet[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${seasonId}`, { next: { revalidate: 30 }})).json();
}

export async function fetchMeetResults(meetId: number): Promise<MeetResult> {
    return await (await fetch(`${process.env.DATA_URL}/meetresults/${meetId}`)).json();
}

export async function fetchStandings(seasonId: number): Promise<GroupedStandings> {
    console.log(`Fetching standings...`)
    return (await fetch(`${process.env.DATA_URL}/standings/${seasonId}`, { next: { revalidate: 30 } })).json();
}

export async function fetchDivers({seasonId, poolcode} : {seasonId: number, poolcode: string}): Promise<Diver[]> {
    const session = await auth();
    const token = jwt.sign({sub:session?.user?.email, groups:session?.user?.profile?.groups}, 'secret')
    return (await fetch(
        `${process.env.DATA_URL}/divers/${seasonId}/${poolcode}`,
        {
            headers: {Authorization: "Bearer " + token}
        }
    )).json();
}

