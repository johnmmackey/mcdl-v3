import { fetchTeams, fetchMeet, fetchMeetEntries, fetchAgeGroups, fetchMeetResults } from '@/app/lib/data';
import ScoreForm from './WrappedScoreForm';
import { MeetHeading} from '@/app/meets/[meetId]/MeetComponents'

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
            <MeetHeading meet={meet} teams={teams}>Meet Scoring</MeetHeading>
            <ScoreForm meet={meet} ageGroups={ageGroups} meetEntries={meetEntries} meetResults={meetResults}/>
        </div>
    )
}
