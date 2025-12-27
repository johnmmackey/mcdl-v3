"use client";
import React, { useState, useEffect, useId, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button, } from '@/components/ui/button'

import { Controller, useForm, UseFormReturn, useWatch } from "react-hook-form"

import { DevTool } from "@hookform/devtools";

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from "@/components/ui/multi-select"

import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Meet, Season } from '@/app/lib/definitions'

import { fetchTeamsForSeason, updateMeet, createMeet, deleteMeet } from '@/app/lib/data';

const nullToEmptyStr = (v: number | string | null | undefined) => v ?? '';
const numToStr = (v: number) => v.toString();

const toFormStr = (v: number | string | null | undefined) => {
    if (typeof v === "number")
        return v.toString();
    if (typeof v === "string")
        return v;
    return '';
};



/* Issues
- If season changed, what happens to the teams? Need to ensure a team that is not in the current season is not selected
- Non-divisional meet - empty string is a problem as it conflicts with "select..."

- key value for select
*/

export const MeetForm = ({
    meet,
    seasons
}: Readonly<{
    meet: Meet,
    seasons: Season[]
}>) => {

    const sortedSeasons = seasons.map(s => s.id).sort((a: number, b: number) => b - a).map(s => s);

    const inSchema = z.object({
        seasonId: z.number(),
        name: z.string().nullable(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.number().nullable(),
        hostPool: z.string().nullable(),
        coordinatorPool: z.string().nullable(),
        teams: z.object({ teamId: z.string() }).array().transform(ts => ts.map(t => t.teamId)).default([])
    });

    const validationSchema = z.object({
        seasonId: z.number(),
        name: z.string().nullish(),
        meetDate: z.date().nullish(),
        entryDeadline: z.date().nullish(),
        meetType: z.string(),
        divisionId: z.number().nullish(),
        hostPool: z.string().nullable(),
        coordinatorPool: z.string().nullable(),
        teams: z.string().array()
    }).superRefine((val, ctx) => {
        if (val.meetType === 'Dual' && val.teams.length !== 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['teams'],
                message: `Dual Meets must have 2 teams`,
            });
        }
    });;

    const outMeetSchema = z.object({
        seasonId: z.number(),
        name: z.string(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.coerce.number(),
        hostPool: z.string(),
        coordinatorPool: z.string()
    });


    const validationSchema1 = z.object({
        seasonId: z.number(),
        name: z.string().nullish(),
        meetDate: z.date(),
        entryDeadline: z.date().nullable(),
        meetType: z.string(),
        divisionId: z.number().nullable(),
        hostPool: z.string().nullable(),
        coordinatorPool: z.string().nullable(),
        teams: z.string().array()
    }).superRefine((val, ctx) => {
        if (val.meetType === 'Dual' && val.teams.length !== 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['teams'],
                message: `Dual Meets must have 2 teams`,
            });
        }
    });;

    // flatten teams to a simgple array of strings
    const outTeamsSchema = z.object({
        teams: z.string().array()
    }).transform(ts => ts.teams);

    let x  = inSchema.parse(meet);

    type FormSchemaType = z.infer<typeof validationSchema1>;

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(validationSchema1),
        defaultValues: validationSchema1.parse(meet)
    });

    const showEntryDeadline = ['Div', 'Star'].includes(form.watch('meetType'));
    const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchTeamsForSeason((form.watch('seasonId')))
            .then(r => {
                const ts = r.map(r => r.teamId).sort()
                setActiveTeamIds(ts);
                if (form.getValues('hostPool') && !ts.includes(form.getValues('hostPool')!))
                    form.setValue('hostPool', '');
                if (form.getValues('coordinatorPool') && !ts.includes(form.getValues('coordinatorPool')!))
                    form.setValue('coordinatorPool', '');
                form.setValue('teams', form.getValues('teams').filter(e => ts.includes(e)));
            });
    }, [form.watch('seasonId')]);

    const onSubmit = (data: z.infer<FormSchemaType>) => {
        console.log(data)
        const outMeetData = outMeetSchema.parse(data);
        const outTeamsData = outTeamsSchema.parse(data);

        return (meet.id ? updateMeet(meet.id, outMeetData, outTeamsData) : createMeet(outMeetData, outTeamsData))
            //.then(updatedMeet => {console.log('updatedMeet', updatedMeet); return updateMeetTeams(updatedMeet.id, mTeams)})
            .then(() => router.push(`/meets`));
    }



    const handleDelete = () => {
        if (meet.id)
            deleteMeet(meet.id)
                //.then(updatedMeet => {console.log('updatedMeet', updatedMeet); return updateMeetTeams(updatedMeet.id, mTeams)})
                .then(() => router.push(`/meets`));
    }

    return (
        <>
            <form id='meetForm' onSubmit={form.handleSubmit(onSubmit)}>

                <FormFieldSelect form={form} name="seasonId" label="Season ID" options={sortedSeasons.map(s => s.toString())} />

                <FormFieldInput form={form} name="name" label="Meet Name" />
                <FormFieldMultiSelect form={form} name="teams" label="Teams" options={activeTeamIds} />

                <FormFieldDatePicker name="meetDate" label="Meet Date" form={form} />

                <FormFieldSelect form={form} name="meetType" label="Meet Type" options={['Dual', 'Qual', 'Div', 'Star']} />

                {showEntryDeadline &&
                    <FormFieldDatePicker name="entryDeadline" label="Entry Deadline" form={form} />
                }

                <FormFieldSelect form={form} name="divisionId" label="Division" options={['-', '1', '2', '3', '4', '5']} />

                <FormFieldSelect form={form} name="hostPool" label="Host Pool" options={activeTeamIds} />
                <FormFieldSelect form={form} name="coordinatorPool" label="Coordinator Pool" options={activeTeamIds} />

                <Button className={'mt-4'} type="submit" disabled={false}>
                    Submit
                </Button>


            </form>
            <hr className='my-4'></hr>
            <Button onClick={() => console.log(JSON.stringify(form.getValues()))}>Log Form Values</Button>
        </>
    )
}


export const FormFieldGeneric = ({
    form,
    name,
    label,
    options,
    render
}: Readonly<{
    form: UseFormReturn<any>,
    name: string,
    label: string,
    options?: string[],
    render: (id: string, field: any, fieldState: any) => React.ReactNode
}>) => {
    const id = useId();

    return (
        <FieldGroup>
            <Controller
                name={name}
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field
                        orientation="responsive"
                        data-invalid={fieldState.invalid}
                    >
                        <FieldContent>
                            <FieldLabel htmlFor={id}>
                                {label}
                            </FieldLabel>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </FieldContent>

                        {render(id, field, fieldState)}
                    </Field>
                )}
            />
        </FieldGroup>
    )

}

export const FormFieldInput = ({
    form,
    name,
    label,
}: Readonly<{
    form: UseFormReturn<any>,
    name: string,
    label: string
}>) => {

    return (

        <FormFieldGeneric
            form={form}
            name={name}
            label={label}
            render={(id, field, fieldState) =>
                <Input
                    {...field}
                    id={id}
                    aria-invalid={fieldState.invalid}
                    placeholder={label}
                    className='min-w-[500px]'
                />
            }
        />
    )
}


export const FormFieldDatePicker = ({
    form,
    name,
    label,
}: Readonly<{
    form: UseFormReturn<any>,
    name: string,
    label: string
}>) => {
    const [openDatePicker, setOpenDatePicker] = React.useState(false);

    return (

        <FormFieldGeneric
            form={form}
            name={name}
            label={label}
            render={(id, field, fieldState) =>
                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id={id}
                            aria-invalid={fieldState.invalid}
                            className="w-48 justify-between font-normal"
                        >
                            {field.value ? field.value.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value ? field.value : undefined}
                            defaultMonth={field.value ? field.value : undefined}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                field.onChange(date);
                                setOpenDatePicker(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            }
        />
    )
}

export const FormFieldSelect = ({
    form,
    name,
    label,
    options
}: Readonly<{
    form: UseFormReturn<any>,
    name: string,
    label: string,
    options: string[]
}>) => {

    return (
        <FormFieldGeneric
            form={form}
            name={name}
            label={label}
            render={(id, field, fieldState) =>
                <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                >
                    <SelectTrigger
                        id="form-meet-type"
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                    >
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned" className='z-[200]'>
                        {options.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}

                    </SelectContent>
                </Select>

            }
        />
    )
}

export const FormFieldMultiSelect = ({
    form,
    name,
    label,
    options
}: Readonly<{
    form: UseFormReturn<any>,
    name: string,
    label: string,
    options: string[]
}>) => {

    return (
        <FormFieldGeneric
            form={form}
            name={name}
            label={label}
            render={(id, field, fieldState) =>
                <MultiSelect onValuesChange={field.onChange} values={field.value} >
                    <MultiSelectTrigger className="w-full max-w-[400px]">
                        <MultiSelectValue placeholder="Select..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {options.map((o) => (
                                <MultiSelectItem key={o} value={o}>
                                    {o}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>

            }
        />
    )
}