import Link from "next/link";

import { LabelValue } from "@/app/ui/LabelValue";

import { Pencil, Trash2, Building2, MapPin, Phone, Globe, Archive } from "lucide-react";
import { Button, } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <Card className={`${className} overflow-hidden border-2`}>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b pb-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                                {team.id}
                            </div>
                            <div>
                                <CardTitle className="text-2xl mb-1">{team.name}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="font-mono text-xs">
                                        {team.id}
                                    </Badge>
                                    {team.archived && (
                                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                                            <Archive className="w-3 h-3 mr-1" />
                                            Archived
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <CardAction className="flex gap-2">
                        <Link href={`/teams/${team.id}/edit`}>
                            <Button size="icon" variant="outline" className="bg-white dark:bg-gray-800">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </Link>
                        <DeleteTeamDialog teamId={team.id} trigger={
                            <Button size="icon" variant="outline" className="bg-white dark:bg-gray-800">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        } />
                    </CardAction>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {team.clubName && (
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Club Name</div>
                                <div className="font-medium text-base break-words">{team.clubName}</div>
                            </div>
                        </div>
                    )}

                    {(team.address1 || team.address2) && (
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Address</div>
                                <div className="font-medium text-base break-words">
                                    {team.address1}
                                    {team.address1 && team.address2 && <br />}
                                    {team.address2}
                                </div>
                            </div>
                        </div>
                    )}

                    {team.phone && (
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Phone</div>
                                <div className="font-medium text-base break-words">{team.phone}</div>
                            </div>
                        </div>
                    )}

                    {team.url && (
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Website</div>
                                <Link 
                                    className="font-medium text-base text-blue-600 dark:text-blue-400 hover:underline break-all" 
                                    href={team.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {team.url.replace(/^https?:\/\//, '')}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card >
    );
}