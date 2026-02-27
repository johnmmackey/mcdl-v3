"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button'
import { FormFieldInput, FormFieldSelect, FormFieldDatePicker, FormSubmitCancelButtons } from '@/app/ui/FormFields';
import { toast } from 'sonner'

import { DiverBase } from '@/app/lib/types/diver'
import { updateDiver, createDiver } from '@/app/lib/api';

import { Processing } from "@/app/ui/Processing"

const formValidationSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().min(2, "First name is required").max(50),
    lastName: z.string().min(2, "Last name is required").max(50),
    birthdate: z.string().optional(),
    gender: z.enum(['M', 'F'], { message: "Gender is required" }),
    teamId: z.string(),
    createDate: z.string().optional(),
});

type DiverFormInput = z.infer<typeof formValidationSchema>;

export const DiverForm = ({
    diver,
    teamId,
    onSuccess,
    onSubmit: customOnSubmit,
    showCancelButton = true,
}: Readonly<{
    diver?: DiverBase,
    teamId: string,
    onSuccess?: () => void,
    onSubmit?: (data: Omit<DiverBase, 'id' | 'createDate'>) => void,
    showCancelButton?: boolean,
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<DiverFormInput>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: diver ? {
            ...diver,
            gender: diver.gender as 'M' | 'F',
            birthdate: diver.birthdate || '',
        } : {
            firstName: '',
            lastName: '',
            birthdate: '',
            gender: 'M' as const,
            teamId: teamId,
        }
    });

    const handleSubmit = async (data: DiverFormInput) => {
        // If custom submit handler is provided, use it instead
        if (customOnSubmit && !diver?.id) {
            customOnSubmit(data as Omit<DiverBase, 'id' | 'createDate'>);
            return;
        }

        startTransition(async () => {
            let r = await (diver?.id ? updateDiver(data as DiverBase) : createDiver(data as Omit<DiverBase, 'id' | 'createDate'>));
            if (r.error) {
                toast.error(`Submission Failed`, { description: `${r.error.msg}` });
            } else {
                toast.success(diver?.id ? 'Diver updated' : 'Diver created');
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.refresh();
                }
            }
        });
    }

    return (
        <form id='diverForm' onSubmit={form.handleSubmit(handleSubmit)}>

            <FormFieldInput form={form} name="firstName" label="First Name" />
            <FormFieldInput form={form} name="lastName" label="Last Name" />
            <FormFieldDatePicker form={form} name="birthdate" label="Date of Birth" />
            <FormFieldSelect 
                form={form} 
                name="gender" 
                label="Gender"
                options={[['M', 'Male'], ['F', 'Female']]}
            />
            
            {showCancelButton && (
                <FormSubmitCancelButtons cancelHref={`/teams/${teamId}/divers`} />
            )}
            {!showCancelButton && (
                <Button type="submit" disabled={isPending}>
                    {diver?.id ? 'Update Diver' : 'Create Diver'}
                </Button>
            )}

            <Processing open={isPending} />
        </form>
    )
}
