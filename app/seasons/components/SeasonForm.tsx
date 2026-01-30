"use client";
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button'
import { FormFieldInput, FormFieldDatePicker, FormFieldCheckBox } from '@/app/ui/FormFields';
import { toast } from 'sonner'

import { DivisionAssignments } from './DivisionAssignments';

import { Season, DivisionAssignment, Division, TeamSeasonCreateInput } from '@/app/lib/types/season';
import { Team } from '@/app/lib/types/team';
import { createSeason, updateSeason } from '@/app/lib/api';

import { Processing } from "@/app/ui/Processing"

const inputSchema = z.object({
    id: z.coerce.number(),
    week1Date: z.iso.datetime({ offset: true }),
    createStandardMeets: z.boolean().optional().default(true),
});

// define the schema for the form
const formValidationSchema = inputSchema;

export const SeasonForm = ({
    season,
    teams,
    divisions,
    divAssignments,
    newSeason = false
}: Readonly<{
    season: Season,
    teams: Team[],
    divisions: Division[],
    divAssignments: DivisionAssignment[],
    newSeason?: boolean
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [divisionAssignments, setDivisionAssignments] = useState<TeamSeasonCreateInput[]>(divAssignments.map(da => ({
        teamId: da.teamId,
        divisionId: da.divisionId,
        seed: da.seed
    })));

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: inputSchema.parse(season)//inputSchema.decode(meet)
    });

    const handleDivAssignmentChange = (newAssignments: TeamSeasonCreateInput[]) => {
        // handle the updated division assignments here
        setDivisionAssignments(newAssignments);
        console.log("Updated Division Assignments:", newAssignments);
    }

    const handleSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        startTransition(async () => {
            const extendedData = {
                ...data,
                name: `Season ${season.id}`,
                startDate: new Date(season.id, 5, 1).toISOString(),
                endDate: new Date(season.id, 7, 1).toISOString(),
                divisionAssignments
            };

            let r = await (newSeason ? createSeason(extendedData) : updateSeason(extendedData));
            r.error ? toast.error(`Submission failed: ${r.error.msg}`) : router.push(`/seasons`);
        });
    }


    return (
        <form id='seasonForm' onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='max-w-40'>
                <FormFieldInput form={form} name="id" label="Season ID" disabled={!newSeason} type='number' className='w-full' />
                <FormFieldDatePicker name="week1Date" label="Week 1 Date" form={form} />
            </div>

            <DivisionAssignments teams={teams} divisions={divisions} divAssignments={divAssignments} onChange={handleDivAssignmentChange} editMode />

            <div>
                <FormFieldCheckBox form={form} name="createStandardMeets" label="Create Standard Meets" />
            </div>


            <div className='flex mx-4 my-4 gap-x-4'>
                <Button type="button" onClick={() => router.push('/meets')} disabled={false} variant='outline'>
                    Cancel
                </Button>

                <Button type="submit" variant="default" disabled={false} >
                    Submit
                </Button>

            </div>


            <Processing open={isPending} />
        </form>
    )
}




