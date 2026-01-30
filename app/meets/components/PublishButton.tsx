"use client"
import { useState, useOptimistic, useTransition, use } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { MeetWithTeams } from '@/app/lib/types';
import { setPublishedStatus } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import { meetPermissions } from '@/app/lib/userCan';



export const PublishButton = (props: { meet: MeetWithTeams, onClick?: () => void }) => {
    const [isPending, startTransition] = useTransition();
    const [opened, setOpended] = useState(false);   
    const open = () => setOpended(true);
    const close = () => setOpended(false);

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
                <Alert>

                    <AlertTitle>
                        Please Wait - UPdate in progress
                    </AlertTitle>
                </Alert>

            }
            {!false &&
                <Button onClick={open} disabled={isPending}>
                    {props.meet.scoresPublished ? 'UnPublish' : 'Publish'}
                    {isPending &&
                        <span>&nbsp; in progress...</span>
                    }
                </Button>
            }



                <Dialog defaultOpen={opened} onOpenChange={setOpended}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm</DialogTitle>
                        </DialogHeader>
                        Are You Sure?
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>
            
        </>
    )
}

export const PublishButton2 = (props: { meet: MeetWithTeams }) => {
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