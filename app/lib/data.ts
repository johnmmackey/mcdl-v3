import { GroupedStandings, Season, Team, Meet, MeetResult } from "./definitions";


export async function fetchCurrentSeason(): Promise<Season> {
    return (await fetch(`${process.env.DATA_URL}/currentseason`)).json();
}

export async function fetchSeasons(): Promise<Season[]> {
    return (await fetch(`${process.env.DATA_URL}/seasons`)).json();
}

export async function fetchTeams(): Promise<Team[]> {
    return await (await fetch(`${process.env.DATA_URL}/teams`)).json();
}


export async function fetchMeets(seasonId: number): Promise<Meet[]> {
    return await (await fetch(`${process.env.DATA_URL}/meets/${seasonId}`)).json();
}

export async function fetchMeetResults(meetId: number): Promise<MeetResult> {
    return await (await fetch(`${process.env.DATA_URL}/meetresults/${meetId}`)).json();
}

export async function fetchStandings(seasonId: number): Promise<GroupedStandings> {
    return (await fetch(`${process.env.DATA_URL}/standings/${seasonId}`)).json();
}