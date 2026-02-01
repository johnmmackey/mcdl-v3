import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchCurrentSeasonId, fetchMeet, fetchSeasons, fetchTeams } from '@/app/lib/api';
import { MeetWithTeams } from '@/app/lib/types/meet';
import { MeetProfileCard } from '@/app/meets/components/MeetProfileCard';

import { MeetResults } from '../components/MeetResults';
import { MeetScore } from '@/app/meets/components/MeetResultComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MeetEntries } from '../components/MeetEntries';

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
            <MeetProfileCard meet={meet} className="mb-8" />

            <Tabs defaultValue="results">
                <TabsList variant="line">
                    {meet.scoresPublished &&
                        <TabsTrigger value="results" className='text-lg'>Results</TabsTrigger>
                    }
                    <TabsTrigger value="entries" className='text-lg'>Entries</TabsTrigger>
                    <TabsTrigger value="scoring" className='text-lg'>Scoring</TabsTrigger>
                    <TabsTrigger value="roster" className='text-lg'>Roster</TabsTrigger>
                    <TabsTrigger value="reports" className='text-lg'>Reports</TabsTrigger>
                </TabsList>

                {meet.scoresPublished &&
                    <TabsContent value="results">
                        <MeetResults meet={meet} />
                    </TabsContent>
                }
                <TabsContent value="entries">
                    <MeetEntries meet={meet} />
                </TabsContent>

                <TabsContent value="reports" >
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
                </TabsContent>
            </Tabs>


        </div>
    )
}

