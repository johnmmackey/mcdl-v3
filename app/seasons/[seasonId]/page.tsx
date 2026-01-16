import { fetchTeams, fetchDivisions, fetchSeason, fetchTeamsForSeason } from '@/app/lib/data';
import { DivisionAssignments } from './DivisionAssignments';

export default async function Page(props: {
    params: Promise<{ seasonId: number }>,
}) {
    const params = await props.params;

    const season = await fetchSeason(params.seasonId)
    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();
    const divAssignments = await fetchTeamsForSeason(Number(params.seasonId))


    return (
        <div>
            <div className='mb-4'>
            Week 1 Date: {new Date(season.week1Date).toLocaleDateString()}
            </div>
        <DivisionAssignments teams={teams} divisions={divisions} divAssignments={divAssignments} newSeason={false} />
        </div>

    )
}
