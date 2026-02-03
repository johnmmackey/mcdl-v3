import Link from "next/link";

import { LabelValue } from "@/app/ui/LabelValue";

import { Pencil, Trash2 } from "lucide-react";
import { Button, } from "@/components/ui/button";
import { TeamWithTeamSeasons } from "@/app/lib/types";
import { DeleteTeamDialog } from "./TeamDelete";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const TeamProfile = ({
    team,
    className
}: {
    team: TeamWithTeamSeasons,
    className?: string
}) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardAction>
                    <Link href={`/teams/${team.id}/edit`} className="text-sm">
                        <Button size="icon" variant="outline"><Pencil /></Button>
                    </Link>
                    <DeleteTeamDialog teamId={team.id}>
                        <Button size="icon" variant="outline" className="ml-2"><Trash2 /></Button>
                    </DeleteTeamDialog>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className='inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-0 min-w-sm'>

                    <LabelValue label="Team Code:" value={team.id} />
                    <LabelValue label="Club Name:" value={team.clubName} />
                    <LabelValue label="Address 1:" value={team.address1} />
                    <LabelValue label="Address 2:" value={team.address2} />
                    <LabelValue label="Phone:" value={team.phone} />
                    <LabelValue label="Website:" value={team.url} />
                    <LabelValue label="Archived:" value={team.archived ? "Yes" : "No"} />

                </div>
            </CardContent>

        </Card >
    );
}