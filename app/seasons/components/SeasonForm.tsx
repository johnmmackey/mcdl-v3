"use client";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useForm, useWatch } from "react-hook-form"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormFieldInput, FormFieldDatePicker, FormFieldCheckBox, FormSubmitCancelButtons } from '@/app/ui/FormFields';
import { toast } from 'sonner'

import { DivisionAssignments } from './DivisionAssignments';

import { DivisionAssignment, Division, TeamSeasonCreateInput } from '@/app/lib/types/season';
import { Team } from '@/app/lib/types/team';
import { createSeason, updateSeason } from '@/app/lib/api';

import { Processing } from "@/app/ui/Processing"

const formValidationSchema = z.object({
    id: z.number(),
    week1Date: z.iso.datetime({ offset: true }),
    createStandardMeets: z.boolean().optional(),    // optional because it won't be sent when false due to how checkboxes work
});

type SeasonFormInput = z.infer<typeof formValidationSchema>;

export const SeasonForm = ({
    season,
    teams,
    divisions,
    divAssignments,
    newSeason = false
}: Readonly<{
    season: SeasonFormInput,
    teams: Team[],
    divisions: Division[],
    divAssignments: DivisionAssignment[],
    newSeason: boolean
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [divisionAssignments, setDivisionAssignments] = useState<TeamSeasonCreateInput[]>(divAssignments.map(da => ({
        teamId: da.teamId,
        divisionId: da.divisionId,
        seed: da.seed
    })));

    const form = useForm<SeasonFormInput>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: season//inputSchema.parse(season)//inputSchema.decode(meet)
    });

    const handleDivAssignmentChange = (newAssignments: TeamSeasonCreateInput[]) => {
        // handle the updated division assignments here
        setDivisionAssignments(newAssignments);
        console.log("Updated Division Assignments:", newAssignments);
    }

    const handleSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        console.log("Form Data:", data);
        startTransition(async () => {
            const extendedData = {
                ...data,
                createStandardMeets: data.createStandardMeets || false, // default to false if not provided - damn checkbox
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

            <FormSubmitCancelButtons cancelHref="/seasons" />


            <Processing open={isPending} />
        </form>
    )
}




