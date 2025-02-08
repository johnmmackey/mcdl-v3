"use client";
import React, { useEffect, } from 'react';
import { useRouter } from 'next/navigation'
import { Grid, GridCol, Alert, Button } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useForm, SubmitHandler } from "react-hook-form"
import styles from './newUser.module.css';
import { addUser, delUser, User } from '@/app/lib/userPoolData';

export default function Page({ user, newUser }: { user: User, newUser: boolean }) {

    const {
        register,
        formState: { isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, errors },
        handleSubmit,
        reset,
        setError
    } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: user
    });

    const router = useRouter();

    const onSubmit: SubmitHandler<User> = (data) => {
        console.log('Submit handler: Results:', data);
        console.log('in onSubmit: current form state:', isDirty, isSubmitting, isSubmitted, isSubmitSuccessful)
        console.log('Submit handler: Errors:', errors);
        let r;

        r = addUser(data)
            .then(r => router.push('/users'))
            .catch(err => {
                setError("root", {
                    type: "manual",
                    message: err.message,
                })
            });
        return r;
    }

    const del = () => {
        return delUser(user.sub)
            .then(r => router.push('/users'))
            .catch(err => {
                setError("root", {
                    type: "manual",
                    message: err.message,
                })
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {errors.root &&
                <Alert variant="light" color="blue"
                    title={errors.root.message}
                    icon={<IconInfoCircle />}
                    withCloseButton
                    closeButtonLabel="Dismiss"
                    onClose={() => reset({}, { keepValues: true })}
                />

            }

            <Grid className="p-2">
                <GridCol span={3}>
                    <label>First Name:</label>
                </GridCol>
                <GridCol span={9}>
                    <input 
                        className={`${styles.scoreInput} ${errors?.givenName ? styles.scoreError : ''}`}
                        {...register('givenName',
                            {
                                min: 5,
                                required: true,
                            }
                        )}
                        defaultValue={''}
                    /> abc
                </GridCol>
            </Grid>

            <Grid className="p-2">
                <GridCol span={3}>
                    <label>Family Name:</label>
                </GridCol>
                <GridCol span={9}>
                    <input
                        className={`${styles.scoreInput} ${errors?.familyName ? styles.scoreError : ''}`}
                        {...register('familyName',
                            {
                                min: 1,
                                required: true,
                            }
                        )}
                        defaultValue={''}
                    />
                </GridCol>
            </Grid>
            <Grid className="p-2">
                <GridCol span={3}>
                    <label>Email:</label>
                </GridCol>
                <GridCol span={9}>
                    <input
                        type="email"
                        className={`${styles.scoreInput} ${errors?.email ? styles.scoreError : ''}`}
                        {...register('email',
                            {
                                min: 1,
                                required: true,
                            }
                        )}
                        defaultValue={''}
                    />
                </GridCol>
            </Grid>


            <Grid className="p-2">
                <GridCol span={3}>
                    <label>Note:</label>
                </GridCol>
                <GridCol span={9}>
                    <input
                        type="email"
                        className={`${styles.scoreInput} ${errors?.email ? styles.scoreError : ''}`}
                        {...register('note',
                            {
                                min: 1,
                                required: true,
                            }
                        )}
                        defaultValue={''}
                    />
                </GridCol>
            </Grid>

            <Grid className="p-2">
                <GridCol span={3}>
                    <label>Groups:</label>
                </GridCol>
                <GridCol span={9}>
                    <input
                        type="email"
                        className={`${styles.scoreInput} ${errors?.email ? styles.scoreError : ''}`}
                        {...register('serializedGroups',
                            {
                                min: 1,
                                required: true,
                            }
                        )}
                        defaultValue={''}
                    />
                </GridCol>
            </Grid>

            <br />

            <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
                Submit
            </Button>
            {!newUser &&
                <Button type="submit" disabled={isSubmitting} onClick={del}>
                    Delete
                </Button>
            }
            {isSubmitting && <span>is submitting</span>}
            {isSubmitted && <span>is submitted</span>}
            {isSubmitSuccessful && <span>submit succesful </span>}
        </form>
    )
}


