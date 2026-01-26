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

import { MeetWithTeams } from "@/app/lib/definitions";
import { MeetDisplayName } from "./MeetDisplayName";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MeetProfileCard = async (props: {
    meet: MeetWithTeams,
}) => {


    return (
        <Card>
            <CardHeader>
                <CardTitle><MeetDisplayName meet={props.meet} /></CardTitle>
                <CardAction>
                    <Link href={`/meets/${props.meet.id}/edit`} className="text-sm">
                        <Button size="icon" variant="outline"><Pencil /></Button>
                    </Link>

                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-6 ">
                    <div className="max-md:col-span-2 md:col-span-1">
                        <strong>Date:</strong>
                    </div>
                    <div className="max-md:col-span-4 md:col-span-5">
                        {new Date(props.meet.meetDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-1">
                        <strong>Type:</strong>
                    </div>
                    <div className="col-span-5">
                        {props.meet.meetType}
                    </div>
                    <div className="col-span-1">
                        <strong>Host Pool:</strong>
                    </div>
                    <div className="col-span-5">
                        {props.meet.hostPool?.name || 'Not set'}
                    </div>
                    <div className="col-span-1">
                        <strong>Teams:</strong>
                    </div>
                    <div className="col-span-5">
                        {props.meet.teams.map(t => t.team.name).join(', ')}
                    </div>

                    {['Div', 'Star'].includes(props.meet.meetType) &&
                        <>
                            <div className="col-span-1">
                                <strong>Entry Deadline:</strong>
                            </div>
                            <div className="col-span-5">
                                {props.meet.entryDeadline && <p><strong>Entry Deadline:</strong> {new Date(props.meet.entryDeadline).toLocaleDateString()}</p>}
                            </div>
                        </>
                    }
                </div>
            </CardContent>
        </Card>
    );
}

