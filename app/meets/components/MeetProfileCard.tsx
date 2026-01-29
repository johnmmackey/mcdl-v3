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
                <div className="flex justify-start gap-1">
                    <div className="w-24">
                        <strong>Date:</strong>
                    </div>
                    <div className="w-full">
                        {new Date(props.meet.meetDate).toLocaleDateString()}
                    </div>
                </div>
                <div className="flex justify-start gap-1">
                    <div className="w-24">
                        <strong>Type:</strong>
                    </div>
                    <div className="w-full">
                        {props.meet.meetType}
                    </div>
                </div>
                <div className="flex justify-start gap-1">
                    <div className="w-24">
                        <strong>Host Pool:</strong>
                    </div>
                    <div className="w-full">
                        {props.meet.hostPool?.name || 'Not set'}
                    </div>
                </div>
                <div className="flex justify-start gap-1">
                    <div className="w-24">
                        <strong>Teams:</strong>
                    </div>
                    <div className="w-full">
                        {props.meet.teams.map(t => t.team.name).join(', ')}
                    </div>
                </div>

                {['Div', 'Star'].includes(props.meet.meetType) &&
                    <div className="flex justify-start gap-1">
                        <div className="w-24">
                            <strong>Entry Deadline:</strong>
                        </div>
                        <div className="w-full">
                            {props.meet.entryDeadline && <p><strong>Entry Deadline:</strong> {new Date(props.meet.entryDeadline).toLocaleDateString()}</p>}
                        </div>
                    </div>
                }

        </CardContent>
        </Card >
    );
}

