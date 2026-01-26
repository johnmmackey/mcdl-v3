import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchCurrentSeasonId, fetchMeet, fetchSeasons, fetchTeams } from '@/app/lib/api';
import { MeetWithTeams } from '@/app/lib/types/meet';
import { MeetProfileCard } from '@/app/meets/components/MeetProfileCard';
import { mapTeamsById } from '@/app/lib/logic';

/**
 * Fetches and displays details of a specific meet.
 * 
 * @param {Object} props - The properties passed to the page component.
 * @param {Promise<{ meetId: string }>} props.params - A promise resolving to an object containing the meet ID.
 * @returns {JSX.Element} The JSX element representing the meet details page.
 * 
 * 
 */

export default async function Page(props: {
    params: Promise<{ meetId: string }>,
}) {
    const params = await props.params;

    const meetId = parseInt(params.meetId) || null;
    if (!meetId) {
        notFound();
    }

    const meet = await fetchMeet(meetId);
    if (!meet) {
        notFound();
    }

    let defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return (

        <div>
            <MeetProfileCard meet={meet} />


            {/* Additional meet details and edit form can be added here */}
            <div>
                <Link href={`/meets/${meetId}/enter`}>
                    <Button>Enter Divers</Button>
                </Link>
                <Link href={`/meets/${meetId}/scoring`}>
                    <Button>Enter Scores</Button>
                </Link>
                <Link href={`/meets/${meetId}/roster`}>
                    <Button>Roster</Button>
                </Link>
                <Link href={`/meets/${meetId}/labels`}>
                    <Button>Print Labels</Button>
                </Link>
                <Link href={`/meets/${meetId}/results`}>
                    <Button>View Results</Button>
                </Link>

                <Link href={`/meets/${meetId}/edit`}>
                    <Button>Edit Meet</Button>
                </Link>
            </div>
        </div>
    )
}

