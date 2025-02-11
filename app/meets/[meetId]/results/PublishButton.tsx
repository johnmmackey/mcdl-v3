"use client"
import { Button } from '@mantine/core'
import { Meet } from '@/app/lib/definitions';
import { publishMeet } from '@/app/lib/data';
import { useRouter } from 'next/navigation';
import { meetPermissions } from '@/app/lib/userCan';

export const PublishButton = (props: { meet: Meet }) => {
    const router = useRouter();

    const publish = () => {
        publishMeet(props.meet.id)
    }

    return (
        <Button onClick={publish}>
            Publish Results
        </Button>


    )
}