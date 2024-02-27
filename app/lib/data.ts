import { GroupedStandings, CurrentSeason } from "./definitions";

export async function fetchStandings(season: string): Promise<GroupedStandings> {
    const params = new URLSearchParams({
        'season': season,
    });
    let standings = await fetch(
        `http://host.countryglen.org:8094/standings?${params}`,
        {

            headers: {
                'Accept': 'application/json'
              }
        });
    return standings.json();
}

export async function fetchCurrentSeason(): Promise<CurrentSeason> {
    return (await fetch(
        `http://host.countryglen.org:8094/currentseason`,
        {
            headers: {
                'Accept': 'application/json'
              }
        })).json();
    //return {currentSeason: sc.season_id}
}