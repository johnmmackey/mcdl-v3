import { GroupedStandings } from "./definitions";

export async function fetchStandings(): Promise<GroupedStandings> {
    let standings = await fetch(
        `http://docker:8095/standings?season=2023`,
        {
            headers: {
                'Accept': 'application/json'
              }
        });
    return standings.json();
}