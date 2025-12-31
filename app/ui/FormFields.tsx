"use client";

import React, { useId } from 'react';
import { Button, } from '@/components/ui/button'


import { Controller, UseFormReturn } from "react-hook-form";

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


const FormFieldGeneric = ({
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

        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field
                    className='mb-4'
                    orientation="vertical"
                    data-invalid={fieldState.invalid}
                >

                    <FieldLabel htmlFor={id}>
                        {label}
                    </FieldLabel>

                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}


                    {render(id, field, fieldState)}
                </Field>
            )}
        />

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
                            {field.value ? new Date(field.value).toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            defaultMonth={field.value ? new Date(field.value) : undefined}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                field.onChange(date ? date.toISOString() : new Date().toISOString());
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
    nullFlag,
    options
}: Readonly<{
    form: UseFormReturn<any>,
    name: string,
    label: string,
    nullFlag?: { value: string, label: string },
    options: string[] | string[][]
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
                        id={id}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                    >
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned" className='z-[200]'>
                        {nullFlag && (
                            <SelectItem key={nullFlag.value} value={nullFlag.value}>
                                {nullFlag.label}
                            </SelectItem>
                        )}
                        {options.map(o => (

                            <SelectItem key={Array.isArray(o) ? o[0] : o} value={Array.isArray(o) ? o[0] : o}>
                                {Array.isArray(o) ? o[1] : o} 
                            </SelectItem>
                        ))}
                    </SelectContent>                
                </Select>
            }
        />
    )
}


const nullFlag={value: "---null---", label: '---null---'}

export const FormFieldSelectx = ({
    form,
    name,
    label,
    options
}: Readonly<{
    form: UseFormReturn<any>,
    name: string,
    label: string,
    options: string[] | string[][]
}>) => {

    return (
        <FormFieldGeneric
            form={form}
            name={name}
            label={label}
            render={(id, field, fieldState) =>

                <Select
                    name={field.name}
                    value={field.value ?? nullFlag.value}
                    onValueChange={ (v) => field.onChange( v === nullFlag.value ? null : v)}
                >
                   
                    <SelectTrigger
                        id={id}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                    >
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned" className='z-[200]'>
                        {nullFlag && (
                            <SelectItem key={nullFlag.value} value={nullFlag.value}>
                                {nullFlag.label}
                            </SelectItem>
                        )}
                        {options.map(o => (

                            <SelectItem key={Array.isArray(o) ? o[0] : o} value={Array.isArray(o) ? o[0] : o}>
                                {Array.isArray(o) ? o[1] : o} 
                            </SelectItem>
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
    options: string[] | string[][]
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
                                <MultiSelectItem key={Array.isArray(o) ? o[0] : o} value={Array.isArray(o) ? o[0] : o}>
                                    {Array.isArray(o) ? o[1] : o}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>

            }
        />
    )
}