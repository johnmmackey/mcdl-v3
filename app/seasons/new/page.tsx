import { startOfDay, addDays, getDay } from 'date-fns';
import { fetchTeams, fetchDivisions, fetchTeamsForSeason, fetchSeasons } from '@/app/lib/api';

import { SeasonForm } from "@/app/seasons/components/SeasonForm";
import { Season, DivisionAssignment } from '@/app/lib/types/season';
import { calcNextSeasonDivAssignments } from '@/app/lib/logic';

export default async function Page() {

    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();

    let divAssignments: DivisionAssignment[] = [];
    let season: Season;

    // new season
    const seasons = await (fetchSeasons());
    // Fix. Problem for new season when no seasons exist
    const maxSeasonId = Math.max(...seasons.map(s => s.id), 1970);
    divAssignments = calcNextSeasonDivAssignments(await fetchTeamsForSeason(maxSeasonId));

    let week1Date = new Date(maxSeasonId + 1, 5, 14);    // Default to June 14th of next year
    const dayOfWeek = getDay(week1Date); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const daysUntilNextSunday = (7 - dayOfWeek) % 7; // Calculate days until the next Sunday
    week1Date = addDays(week1Date, daysUntilNextSunday); // Add the days to the current date
    week1Date = startOfDay(week1Date)

    season = {
        id: maxSeasonId + 1,
        //startDate: defaultDate.toISOString(),
        //endDate: defaultDate.toISOString(),
        week1Date: week1Date.toISOString(),
    } as Season;


    return (
        <SeasonForm teams={teams} divisions={divisions} season={season} divAssignments={divAssignments} newSeason={true} />
    )
}
