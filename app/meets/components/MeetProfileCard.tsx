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

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

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

                </CardAction>
            </CardHeader>
            <CardContent>
                <LabelValue label="Date" labelWidth={24} value={new Date(props.meet.meetDate).toLocaleDateString()} />
                <LabelValue label="Type" labelWidth={24} value={props.meet.meetType} />
                <LabelValue label="Host Pool" labelWidth={24} value={props.meet.hostPoolId ? teamCompoundName (props.meet.hostPoolId, props.meet.hostPool.name) : 'TBD'} />
                <LabelValue label="Teams" labelWidth={24} value={props.meet.teams.map(t => teamCompoundName(t.teamId, t.team.name)).join(', ')} />

                {['Div', 'Star'].includes(props.meet.meetType) &&
                    <LabelValue label="Entry Deadline" labelWidth={24} value={props.meet.entryDeadline ? new Date(props.meet.entryDeadline).toLocaleDateString() : 'n/a'} />
                }

            </CardContent>
        </Card >
    );
}

const teamCompoundName = (id: string, name: string) => `${name} (${id})`
