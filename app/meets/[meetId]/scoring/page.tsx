import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { fetchTeams, fetchMeet, fetchMeetEntries, fetchAgeGroups, fetchMeetResults } from '@/app/lib/api';
import ScoreForm from './WrappedScoreForm';


export default async function Page(props: { params: Promise<{ meetId: number }> }) {
    const params = await props.params;

    const [teams, meet, ageGroups, meetEntries, meetResults] = await Promise.all(
        [
            fetchTeams(),
            fetchMeet(params.meetId),
            fetchAgeGroups(),
            fetchMeetEntries(params.meetId),
            fetchMeetResults(params.meetId),
        ]
    );
    return (
        <div style={{ maxWidth: '800px' }}>

            {!meet.scoresPublished && !meet.parentMeet &&
                <ScoreForm meet={meet} ageGroups={ageGroups} meetEntries={meetEntries} meetResults={meetResults} />
            }
            {!meet.scoresPublished && meet.parentMeet &&
                <div>
                    This is a submeet, and cannot be scored seperately from its parent.
                    <br/>
                    <Link href={`/meets/${meet.parentMeet}/scoring`}>
                        <Button>
                            Go to Parent
                        </Button>
                    </Link>
                </div>
            }
            {meet.scoresPublished && 
                <div>
                    Cannot score a meet that has been published.
                    <br />
                    <Link href={`/meets/${meet.id}/results`}>
                        <Button>
                            Go to Results
                        </Button>
                    </Link>
                </div>
            }
        </div>
    )
}
