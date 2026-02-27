import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchCurrentSeasonId, fetchMeet, fetchSeasons, fetchTeams } from '@/app/lib/api';
import { getPermissions } from '@/app/lib/getPermissions';
import { MeetProfileCard } from '@/app/meets/components/MeetProfileCard';

import { MeetResults } from '../components/MeetResults';
import { MeetScore } from '@/app/meets/components/MeetResultComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MeetEntries } from '../components/MeetEntries';
import { has } from 'lodash';

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
    const hasPermission = await getPermissions('meets', meetId);

    let defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    return (

        <div>
            <MeetProfileCard meet={meet} className="mb-8" />

            <Tabs defaultValue="results">
                <TabsList variant="line">
                    {hasPermission('meet:viewEntries') &&
                        <TabsTrigger
                            value="entries"
                            className='text-lg'
                        >
                            Entries
                        </TabsTrigger>
                    }
                    {meet._count.scores > 0 && (meet.scoresPublished || hasPermission('meet:previewResults')) &&
                        <TabsTrigger value="results" className='text-lg'>
                            {meet.scoresPublished ? 'Results' : 'PRELIMINARY Results'}
                        </TabsTrigger>
                    }


                </TabsList>
                {hasPermission('meet:viewEntries') &&
                    <TabsContent value="entries">
                        <MeetEntries meet={meet} />
                    </TabsContent>
                }
                {meet._count.scores > 0 && (meet.scoresPublished || hasPermission('meet:previewResults')) &&
                    <TabsContent value="results">
                        <MeetResults meet={meet} />
                    </TabsContent>
                }


                <TabsContent value="reports" >
                    <Link href={`/meets/${meetId}/enter`}>
                        <Button>Enter Divers</Button>
                    </Link>



                </TabsContent>
            </Tabs>
        </div>
    )
}

