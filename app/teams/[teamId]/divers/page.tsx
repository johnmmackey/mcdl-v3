import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

import { fetchTeam, fetchCurrentSeasonId, fetchTeamDiversForSeason } from '@/app/lib/api';
import { TeamProfile } from '@/app/teams/components/TeamProfile';
import { SeasonSelector } from '@/app/ui/SeasonSelector';
import { IfUserHasPermission } from '@/app/ui/IfUserHasPermission';
import { Button } from '@/components/ui/button';
import Loading from '@/app/ui/Loading';
import { IconPlus } from '@tabler/icons-react';

export default async function Page(props: {
    params: Promise<{ teamId: string }>,
    searchParams: Promise<{ 'season-id'?: string }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const teamId = params.teamId;
    if (!teamId) {
        notFound();
    }

    const team = await fetchTeam(teamId);
    if (!team) {
        notFound();
    }

    const currentSeasonId = await fetchCurrentSeasonId();
    const selectedSeasonId = searchParams['season-id'] ? parseInt(searchParams['season-id']) : currentSeasonId;

    // Fetch divers for selected season
    const diversForSeason = await fetchTeamDiversForSeason({ teamId, seasonId: selectedSeasonId });

    const isCurrentSeason = selectedSeasonId === currentSeasonId;

    return (
        <Suspense fallback={<Loading />}>
            <div>
                <TeamProfile team={team} className='mb-8' />

                <div className="mb-4">
                    <Link href={`/teams/${teamId}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                        ← Back to Team Details
                    </Link>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Divers for Season</h2>
                    <div className="flex gap-4 items-center">
                        <SeasonSelector base={`/teams/${teamId}/divers`} selectedSeasonId={selectedSeasonId} />
                        {isCurrentSeason && (
                            <IfUserHasPermission objectType="teams" requiredPermission='team:createOrUpdate'>
                                <Link href={`/teams/${teamId}/divers/add`}>
                                    <Button>
                                        <IconPlus size={18} className="mr-1" />
                                        Add Registration
                                    </Button>
                                </Link>
                            </IfUserHasPermission>
                        )}
                    </div>
                </div>

                {!isCurrentSeason && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                        You are viewing a past season. New registrations can only be added for the current season ({currentSeasonId}).
                    </div>
                )}

                {diversForSeason.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg mb-2">No divers registered for season {selectedSeasonId}</p>
                        {isCurrentSeason && (
                            <p className="text-sm">Click "Add Registration" to get started.</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {diversForSeason
                            .sort((a, b) => a.lastName.localeCompare(b.lastName))
                            .map((diver) => (
                                <div 
                                    key={diver.id}
                                    className="p-3 border rounded-lg hover:bg-muted transition-colors"
                                >
                                    <div className="font-medium">
                                        {diver.firstName} {diver.lastName} <span className="text-muted-foreground">({diver.gender})</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </Suspense>
    );
}

