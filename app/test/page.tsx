import { fetchTeams, fetchSeasons, fetchDivisions, fetchTeamsForSeason } from '@/app/lib/data';
import { TestDnD } from './testDnD';



export default async function Page() {
    const seasons = await fetchSeasons();
    const teams = await fetchTeams();
    const divisions = await fetchDivisions();

    // need to test edge case where no seasons exist
    const lastDivAssignments = await fetchTeamsForSeason(seasons.map(season => season.id).sort().pop() || 0);

    return (
        <TestDnD teams={teams} seasons={seasons} divisions={divisions} lastDivAssignments={lastDivAssignments} />
    )
}
