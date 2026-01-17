import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
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
            <Field
                className='mb-4'
                orientation="responsive"
            >
                <FieldLabel htmlFor='week1Date'>
                    Week 1 Date
                </FieldLabel>
                <FieldContent>
                    {new Date(season.week1Date).toLocaleDateString()}
                </FieldContent>
            </Field>

            <DivisionAssignments teams={teams} divisions={divisions} divAssignments={divAssignments} newSeason={false} />
        </div>

    )
}
