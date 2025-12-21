
import { format } from 'date-fns';

import { fetchTeams, fetchMeet, fetchMeetEntries, fetchAgeGroups } from '@/app/lib/data';
import strcmp from '@/app/lib/strcmp'
import { Meet, Entry, AgeGroup } from '@/app/lib/definitions'
import { MeetHeading, AgeGroupGrid } from '@/app/meets/[meetId]/MeetComponents'

export default async function Page(props: { params: Promise<{ meetId: number }> }) {
    const params = await props.params;

    const [teams, meet, ageGroups, meetEntries] = await Promise.all(
        [
            fetchTeams(),
            fetchMeet(params.meetId),
            fetchAgeGroups(),
            fetchMeetEntries(params.meetId)
        ]
    );
    return (
        <>

            <MeetHeading meet={meet} teams={teams}>Meet Entries</MeetHeading>

            <AgeGroupGrid
                GroupHeader={EntriesHeader}
                ageGroups={ageGroups}
                renderContent={(ag: AgeGroup) => {

                    return (
                        meetEntries
                            .filter(e => e.diver.seasons![0].ageGroupId === (ag as AgeGroup).id)
                            .sort((a: Entry, b: Entry) => strcmp(a.diver.teamId + a.diver.lastName + a.diver.firstName, b.diver.teamId + b.diver.lastName + b.diver.firstName))
                            .map((entry, k) =>
                                <EntriesElement key={k} entry={entry} />
                            )
                    )
                }}
            />
        </>
    )
}

const EntriesHeader = () => {
    return (
        <div className="grid grid-cols-8">
            <div className='font-semibold'>Pool</div>
            <div className='font-semibold col-'>Diver</div>
        </div>
    )
}

const EntriesElement = ({entry}: {entry: Entry}) => {
    return (
        <div className="grid grid-cols-8 hover:bg-slate-200">
            <div>{entry.diver.teamId}</div>
            <div className='col-span-3'><span className="text-lg font-semibold">{entry.diver.lastName}</span>, {entry.diver.firstName}</div>
        </div>
    )
}
