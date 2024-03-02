import { GroupedStandings, Season } from "./definitions";

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

export async function fetchCurrentSeason(): Promise<Season> {
    return (await fetch(`${process.env.DATA_URL}/currentseason`)).json();
}

export async function fetchSeasons(): Promise<Season[]> {
    return (await fetch(`${process.env.DATA_URL}/seasons`)).json();
}