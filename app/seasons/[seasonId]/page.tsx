import { notFound } from "next/navigation";
import Link from "next/link";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { fetchTeams, fetchDivisions, fetchSeason, fetchTeamsForSeason, fetchCurrentSeasonId } from '@/app/lib/data';
import { DivisionAssignments } from './DivisionAssignments';
import { MakeSeasonCurrent } from "./MakeCurrentSeason";
import { DeleteSeason } from "./DeleteSeason";


export default async function Page(props: {
    params: Promise<{ seasonId: string }>,
}) {
    const params = await props.params;
    const seasonId = Number(params.seasonId);

    if (isNaN(seasonId)) {
        notFound();
    }

    const season = await fetchSeason(seasonId)
    const currentSeasonId = await fetchCurrentSeasonId();
    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();
    const divAssignments = await fetchTeamsForSeason(seasonId)

    return (
        <div>
            <div className="flex gap-1">
                <Field
                    className='mb-4 justify-self-start'
                    orientation="responsive"
                >
                    <FieldLabel htmlFor='week1Date'>
                        Week 1 Date
                    </FieldLabel>
                    <FieldContent>
                        {new Date(season.week1Date).toLocaleDateString()}
                    </FieldContent>
                </Field>
                {seasonId !== currentSeasonId && season._count.meets > 0 &&
                    <MakeSeasonCurrent seasonId={seasonId} />
                }

                {/* FIX */}
                {seasonId !== currentSeasonId && //season._count.meets === 0 &&
                    <DeleteSeason seasonId={seasonId} />
                }

                <Link href={`/seasons/${params.seasonId}/edit`}>
                    <Button variant="destructive" className="justify-self-end">Edit</Button>
                </Link>
            </div>

            <DivisionAssignments teams={teams} divisions={divisions} divAssignments={divAssignments} />
        </div >

    )
}
