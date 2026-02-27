import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchTeam } from '@/app/lib/api';
import { TeamProfile } from '@/app/teams/components/TeamProfile';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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

    return (

        <div>
            <TeamProfile team={team} className='mb-8'/>

            <div className="mb-6">
                <Link href={`/teams/${teamId}/divers`}>
                    <Button variant="default">View Divers</Button>
                </Link>
            </div>

            <Table className='max-w-md text-center'>
                <TableHeader>
                    <TableRow>
                        <TableHead  className='text-center'>Season</TableHead>
                        <TableHead className='text-center'>Division</TableHead>
                        <TableHead className='text-center'>Seed</TableHead>
                        <TableHead className='text-center'>Final Ranking</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {team.seasons.map((ts) => (
                        <TableRow key={ts.id}>
                            <TableCell>{ts.seasonId}</TableCell>
                            <TableCell>{ts.divisionId}</TableCell>
                            <TableCell>{ts.seed}</TableCell>
                            <TableCell>{ts.seasonComplete ? ts.fsRank : ''}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}


