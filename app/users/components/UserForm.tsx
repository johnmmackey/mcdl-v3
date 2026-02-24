"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation'

import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldCheckBox, FormFieldInput, FormSubmitCancelButtons, FormFieldSelect } from '@/app/ui/FormFields';
import { Processing } from '@/app/ui/Processing';
import { toast } from 'sonner'

import type { User, UserCreateUpdateInput } from '@/app/lib/types/user';

import { createUser, updateUser } from '@/app/lib/api/users';
import { PermissionOptions } from '@/app/lib/types/baseTypes';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';


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

export function UserForm({ userId, user, permissionOptions }: { userId?: string, user: UserCreateUpdateInput, permissionOptions: PermissionOptions }) {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: user
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "roles"
    });

    const handleSubmit = (data: z.infer<typeof formValidationSchema>) => {
        const fdata = {
            ...data,
            enabled: !!data.enabled // checkboxs can return undefined, but API expects a boolean
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




            <div className="grid  grid-cols-[auto_auto_auto_auto_1fr] gap-x-8 mt-8" hidden={fields.length === 0}>
                <div className=''>Role</div>
                <div className=''>Object Type</div>
                <div className=''>Object ID</div>

                {fields.map((field, k) =>
                    <div key={field.id} className='col-span-full grid grid-cols-subgrid'>
                        <div className=''>
                            <FormFieldSelect
                                name={`roles.${k}.role`}
                                form={form}
                                label=""
                                options={permissionOptions.roles}
                            />
                        </div>
                        <div className=''>
                            <FormFieldSelect
                                name={`roles.${k}.objectType`}
                                form={form}
                                label=""
                                options={permissionOptions.objectTypes}
                            />
                        </div>
                        <div className=''>
                            <FormFieldInput
                                name={`roles.${k}.objectId`}
                                form={form}
                                label=""
                                className='max-w-32'
                            />
                        </div>
                        <Button className="mt-3" type="button" variant="outline" onClick={() => remove(k)} ><Trash2 /></Button>
                    </div>
                )}
            </div>
                <Button type="button" onClick={() => {
                    append({ role: '', objectType: '', objectId: '' });
                }} >Add Role</Button>


            <FormSubmitCancelButtons cancelHref="/users" />
            <Processing open={isPending} />
        </form>
    )
}


