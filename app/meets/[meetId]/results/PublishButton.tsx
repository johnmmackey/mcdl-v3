"use client"
import { useState, useOptimistic } from 'react';
import { Button, Loader } from '@mantine/core'
import { Meet } from '@/app/lib/definitions';
import { setPublishedStatus } from '@/app/lib/data';
import { useRouter } from 'next/navigation';
import { meetPermissions } from '@/app/lib/userCan';

export const PublishButton = (props: { meet: Meet }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const publish = () => {
        setIsSubmitting(true);
        setPublishedStatus(props.meet.id, !props.meet.scoresPublished)
            .then(() => setIsSubmitting(false));

    }

    return (
        <Button onClick={publish}>
            {props.meet.scoresPublished ? 'UnPublish' : 'Publish'}
            {isSubmitting && 'ing'}
            &nbsp;
            Results
            {isSubmitting &&
                <span>
                    &nbsp;&nbsp;
                    <Loader color="white" type="dots" />;
                </span>
            }
        </Button>
    )
}