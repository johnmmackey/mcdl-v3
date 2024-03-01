import { GroupedStandings, CurrentSeason } from "./definitions";

export async function fetchStandings(season: string): Promise<GroupedStandings> {
    const params = new URLSearchParams({
        'season': season,
    });
    let standings = await fetch(
        `${process.env.DATA_URL}/standings?${params}`,
        {

            headers: {
                'Accept': 'application/json'
              }
        });
    return standings.json();
}

export async function fetchCurrentSeason(): Promise<CurrentSeason> {
    return (await fetch(
        `${process.env.DATA_URL}/currentseason`,
        {
            headers: {
                'Accept': 'application/json'
              }
        })).json();
}