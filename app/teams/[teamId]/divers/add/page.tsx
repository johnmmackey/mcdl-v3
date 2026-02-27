import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

import { fetchTeam, fetchCurrentSeasonId, fetchTeamDivers } from '@/app/lib/api';
import { TeamProfile } from '@/app/teams/components/TeamProfile';
import { AddRegistrationClient } from '@/app/teams/components/AddRegistrationClient';
import Loading from '@/app/ui/Loading';

export default async function Page(props: {
    params: Promise<{ teamId: string }>,
}) {
    const params = await props.params;

    const teamId = params.teamId;
    if (!teamId) {
        notFound();
    }

    const team = await fetchTeam(teamId);
    if (!team) {
        notFound();
    }

    const currentSeasonId = await fetchCurrentSeasonId();
    
    // Fetch all team divers
    const allTeamDivers = await fetchTeamDivers(teamId);

    return (
        <Suspense fallback={<Loading />}>
            <div>
                <TeamProfile team={team} className='mb-8' />

                <div className="mb-6">
                    <Link href={`/teams/${teamId}/divers`} className="text-sm text-blue-600 hover:underline">
                        ← Back to Divers List
                    </Link>
                </div>

                <h2 className="text-2xl font-bold mb-6">Add Diver Registration for Season {currentSeasonId}</h2>

                <AddRegistrationClient 
                    teamId={teamId}
                    seasonId={currentSeasonId}
                    allTeamDivers={allTeamDivers}
                />
            </div>
        </Suspense>
    );
}
