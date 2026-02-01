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

import { MeetWithTeamsAndScoreCount } from "@/app/lib/types/meet";
import { MeetDisplayName } from "./MeetDisplayName";
import { TeamCompoundName } from "@/app/teams/components/TeamCompoundName";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/app/ui/StandardButtons";
import { MeetScore } from "./MeetResultComponents";
import { MeetActionsDropDown } from "./MeetActionsDropDown";

export const MeetProfileCard = async ({
    meet,
    className
}: {
    meet: MeetWithTeamsAndScoreCount,
    className?: string
}) => {


    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle><MeetDisplayName meet={meet} /></CardTitle>
                <CardAction>
                    <MeetActionsDropDown meet={meet} />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="w-full flex flex-row flex-wrap gap-x-16 gap-y-8">
                    <div className='inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-0 min-w-sm'>

                        <LabelValue label="Date:" value={new Date(meet.meetDate).toLocaleDateString()} />
                        <LabelValue label="Type:" value={meet.meetType} />
                        <LabelValue label="Host Pool:" value={meet.hostPoolId ? <TeamCompoundName id={meet.hostPoolId} name={meet.hostPool.name} /> : 'TBD'} />
                        <LabelValue label="Teams:" value={meet.teams.map(t => <TeamCompoundName id={t.teamId} name={t.team.name} />)} />
                        <LabelValue label="Status:" value={meetStatus(meet)[1]} />

                        {['Div', 'Star'].includes(meet.meetType) &&
                            <LabelValue label="Entry Deadline:" value={meet.entryDeadline ? new Date(meet.entryDeadline).toLocaleDateString() : 'n/a'} />
                        }

                    </div>
                    <div>
                        {meet._count.scores > 0 &&
                            <MeetScore meet={meet} />
                        }
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}

const meetStatus = (meet: MeetWithTeamsAndScoreCount) => {
    if (meet.scoresPublished)
        return ['complete', 'Scores Published - Complete'];

    if (meet._count.scores > 0)
        return ['scoring-in-progress', 'Scores Entered; Not Published'];

    return ['scheduled', 'Scheduled'];
}