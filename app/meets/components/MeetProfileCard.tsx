import Link from "next/link";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { LabelValue } from "@/app/ui/LabelValue";

import { MeetWithTeams } from "@/app/lib/types/meet";
import { MeetDisplayName } from "./MeetDisplayName";
import { TeamCompoundName } from "@/app/teams/components/TeamCompoundName";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/app/ui/StandardButtons";
import { MeetActionsDropDown } from "./MeetActionsDropDown";

export const MeetProfileCard = async (props: {
    meet: MeetWithTeams,
    className?: string
}) => {


    return (
        <Card className={props.className}>
            <CardHeader>
                <CardTitle><MeetDisplayName meet={props.meet} /></CardTitle>
                <CardAction>
                    <Link href={`/meets/${props.meet.id}/edit`} className="text-sm">
                        <Button size="icon" variant="outline"><Pencil /></Button>
                    </Link>

                    <MeetActionsDropDown meet={props.meet} />


                </CardAction>
            </CardHeader>
            <CardContent>
                <div className='inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-0 mt-8 mx-8'>

                        <LabelValue label="Date:"  value={new Date(props.meet.meetDate).toLocaleDateString()} />
                        <LabelValue label="Type:" value={props.meet.meetType} />
                        <LabelValue label="Host Pool:" value={props.meet.hostPoolId ? <TeamCompoundName id={props.meet.hostPoolId} name={props.meet.hostPool.name} /> : 'TBD'} />
                        <LabelValue label="Teams:" value={props.meet.teams.map(t => <TeamCompoundName id={t.teamId} name={t.team.name} />)} />

                        {['Div', 'Star'].includes(props.meet.meetType) &&
                            <LabelValue label="Entry Deadline:" value={props.meet.entryDeadline ? new Date(props.meet.entryDeadline).toLocaleDateString() : 'n/a'} />
                        }

                </div> 

            </CardContent>
        </Card >
    );
}

