"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation'

import * as z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldCheckBox, FormFieldInput, FormSubmitCancelButtons } from '@/app/ui/FormFields';
import { Processing } from '@/app/ui/Processing';
import { toast } from 'sonner'

import type { User, UserCreateUpdateInput } from '@/app/lib/types/user';

import { createUser, updateUser } from '@/app/lib/api/users';


const formValidationSchema = z.object({
    givenName: z.string().min(1, "Given Name is required"),
    familyName: z.string().min(1, "Family Name is required"),
    email: z.email(),
    note: z.string(),
    enabled: z.boolean().optional(),
    roles: z.array(z.object({
        role: z.string(),
        objectType: z.string(),
        objectId: z.string(),
    }))
});

export function UserForm({ userId, user }: { userId?: string, user: UserCreateUpdateInput }) {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: user
    });

    const handleSubmit = (data: z.infer<typeof formValidationSchema>) => {
        const fdata = {...data,
            enabled: !!data.enabled
        }
        startTransition(async () => {
            let r = await (userId ? updateUser(userId, fdata) : createUser(fdata));
            r.error ? toast.error(`Submission failed: ${r.error.msg}`) : router.push(`/users`);
        });
    }

    return (
        <form id="userForm" onSubmit={form.handleSubmit(handleSubmit)} >
            <FormFieldInput
                name="familyName"
                label="Family Name"
                form={form}
            />
            <FormFieldInput
                name="givenName"
                label="First Name"
                form={form}
            />

            <FormFieldInput
                name="email"
                label="Email"
                form={form}
            />

            <FormFieldInput
                name="note"
                label="Note"
                form={form}
            />

            <FormFieldCheckBox
                name="enabled"
                label="Enabled"
                form={form}
            />

            <FormSubmitCancelButtons cancelHref="/users"   />

            <Processing open={isPending} />

        </form>
    )
}


