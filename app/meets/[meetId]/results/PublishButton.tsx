"use client"
import { useState, useOptimistic, useTransition, use } from 'react';
import { Modal, Button, Loader } from '@mantine/core'
import { Meet } from '@/app/lib/definitions';
import { setPublishedStatus } from '@/app/lib/data';
import { useRouter } from 'next/navigation';
import { meetPermissions } from '@/app/lib/userCan';
import { useDisclosure } from '@mantine/hooks';


export const PublishButton = (props: { meet: Meet }) => {
    const [isPending, startTransition] = useTransition();

    console.log('rendering')

    const togglePublished = async () => {
        startTransition(async () => {
            await setPublishedStatus(props.meet.id, !props.meet.scoresPublished)
                .catch((err) => {
                    //updateMeet(!omeet.scoresPublished);
                    alert(`WARNING: Meet status did not update. Error: ${err.message} Reload the page.`)
                });
        });

    }

    return (
        <Button onClick={togglePublished} disabled={isPending}>
            {props.meet.scoresPublished ? 'UnPublish' : 'Publish'}
            {isPending &&
                <span>&nbsp; in progress...</span>
            }
        </Button>
    )
}

export const PublishButton2 = (props: { meet: Meet }) => {
    const [published, setPublished] = useState(!!props.meet.scoresPublished)
    const publishAction = async () => {
        await setPublishedStatus(props.meet.id, !published)
            .catch((err) => {
                //updateMeet(!omeet.scoresPublished);
                alert(`WARNING: Meet status did not update. Error: ${err.message} Reload the page.`)
            });
        setPublished(!published)
    };



    return (
        <Button onClick={publishAction} disabled={ false}>
            {published ? 'UnPublish' : 'Publish'}
        </Button>
    )
}

/*
export const PublishButton = (props: { meet: Meet }) => {
    const [isPending, startTransition] = useTransition();

    const [omeet, updateMeet] = useOptimistic(props.meet, (state: Meet, pubFlag: boolean) => {
        state.scoresPublished = pubFlag ? (new Date()).toISOString() : null;
        return state;
      });

    const publishAction = async () => {
        startTransition( async () => {
            updateMeet(!omeet.scoresPublished);
            await setPublishedStatus(props.meet.id, !props.meet.scoresPublished)
                .catch((err) => {
                    //updateMeet(!omeet.scoresPublished);
                    alert('WARNING: Meet status did not update. Reload the page.')
                });
            });
    }

    return (
        <Button onClick={publishAction} >
            {omeet.scoresPublished ? 'UnPublish' : 'Publish'}
            Results
            {isPending &&
            <span>In progress...</span>
            }
        </Button>
    )
}
    */