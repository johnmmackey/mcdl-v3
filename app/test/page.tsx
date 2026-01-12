import { fetchTeams, fetchSeasons, fetchDivisions } from '@/app/lib/data';
import { TestDnD } from './testDnD';



export default async function Page() {
    const seasons = await fetchSeasons();
    const teams = await fetchTeams();
    const divisions = await fetchDivisions()

    return (
        <TestDnD teams={teams} seasons={seasons} divisions={divisions} />
    )
}
