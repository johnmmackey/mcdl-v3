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
import { MeetScore } from "./MeetResultComponents";

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
                <div className="flex gap-16 justify-start flex-wrap">
                    <div>
                        <LabelValue label="Date" labelClassName="w-32" value={new Date(props.meet.meetDate).toLocaleDateString()} />
                        <LabelValue label="Type" labelClassName="w-32" value={props.meet.meetType} />
                        <LabelValue label="Host Pool" labelClassName="w-32" value={props.meet.hostPoolId ? <TeamCompoundName id={props.meet.hostPoolId} name={props.meet.hostPool.name} /> : 'TBD'} />
                        <LabelValue label="Teams" labelClassName="w-32" value={props.meet.teams.map(t => <TeamCompoundName id={t.teamId} name={t.team.name} />)} />

                        {['Div', 'Star'].includes(props.meet.meetType) &&
                            <LabelValue label="Entry Deadline" labelClassName="w-32" value={props.meet.entryDeadline ? new Date(props.meet.entryDeadline).toLocaleDateString() : 'n/a'} />
                        }
                    </div>
                </div>

            </CardContent>
        </Card >
    );
}

const TeamCompoundName = (props: { id: string, name: string }) => {
    return (
        <>
            <span className="hidden md:inline">
                {`${props.name} (${props.id})`}
            </span>
            <span className="inline md:hidden">
                {`${props.id}`}
            </span>
        </>
    );
}