"use client"
import { useState, useOptimistic, useTransition, use } from 'react';
import { Modal, Button, Loader, Alert, Notification } from '@mantine/core'
import { Meet } from '@/app/lib/definitions';
import { setPublishedStatus } from '@/app/lib/data';
import { useRouter } from 'next/navigation';
import { meetPermissions } from '@/app/lib/userCan';
import { useDisclosure } from '@mantine/hooks';


export const PublishButton = (props: { meet: Meet, onClick?: () => void }) => {
    const [isPending, startTransition] = useTransition();
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();

    //console.log('rendering publishbutton')

    const togglePublished = async () => {
        close();
        startTransition(async () => {

            await setPublishedStatus(props.meet.id, !props.meet.scoresPublished)
                .then(() => {
                    //console.log('published status set')
                    props.onClick && props.onClick();
                })
                .catch((err) => {
                    //updateMeet(!omeet.scoresPublished);
                    alert(`WARNING: Meet status did not update. Error: ${err.message} Reload the page.`)
                });
        });
    }

    return (
        <>
            {isPending &&
                <Notification loading title="Please Wait">Update in progress</Notification>
            }
            {!false &&
                <Button onClick={open} disabled={isPending}>
                    {props.meet.scoresPublished ? 'UnPublish' : 'Publish'}
                    {isPending &&
                        <span>&nbsp; in progress...</span>
                    }
                </Button>
            }
            <Modal opened={opened} onClose={close} title="Confirm" centered size="md">
                Are You Sure?
                <div>
                    <Button onClick={togglePublished}>Yes</Button>
                </div>
            </Modal>
        </>
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
        <Button onClick={publishAction} disabled={false}>
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