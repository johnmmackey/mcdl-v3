import Link from "next/link";

import { LabelValue } from "@/app/ui/LabelValue";

import { Pencil, Trash2 } from "lucide-react";
import { Button, } from "@/components/ui/button";
import { User } from "@/app/lib/types";
import { DeleteUserDialog } from "./UserDelete";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const UserProfile = ({
    user,
    className
}: {
    user: User,
    className?: string
}) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{user.familyName}, {user.givenName}</CardTitle>
                <CardAction>
                    <Link href={`/users/${user.sub}/edit`} className="text-sm">
                        <Button size="icon" variant="outline"><Pencil /></Button>
                    </Link>
                    
                    <DeleteUserDialog userId={user.sub} trigger={
                        <Button size="icon" variant="outline" className="ml-2"><Trash2 /></Button>
                    } />

                </CardAction>
            </CardHeader>
            <CardContent>
                <div className='inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-0 min-w-sm'>

                    <LabelValue label="Email:" value={user.email} />
                    <LabelValue label="Note:" value={user.note} />
                    <LabelValue label="Status:" value={user.status} />
                    <LabelValue label="Enabled:" value={user.enabled ? "Yes" : "No"} />
                    <LabelValue label="Created:" value={new Date(user.createDate).toLocaleString()} />
                    <LabelValue label="Modified:" value={new Date(user.lastModifiedDate).toLocaleString()} />

                </div>
            </CardContent>

        </Card >
    );
}

