

import { fetchMeetEntries, fetchAgeGroups } from '@/app/lib/api';
import strcmp from '@/app/lib/strcmp';
import { MeetWithTeams } from '@/app/lib/types';
import { Entry, AgeGroup } from '@/app/lib/types/diver'
import { AgeGroupGrid } from '@/app/meets/components/MeetResultComponents'

export async function MeetEntries(props: { meet: MeetWithTeams } ) {


    const [ ageGroups, meetEntries] = await Promise.all(
        [
            fetchAgeGroups(),
            fetchMeetEntries(props.meet.id)
        ]
    );
    return (
        <>
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
            <pre>entries: {JSON.stringify(meetEntries, null, 2)}</pre>
        </>
    )
}

const EntriesHeader = () => {
    return (
        <div className="grid grid-cols-8">
            <div className='font-semibold text-lg'>Pool</div>
            <div className='font-semibold text-lg'>Diver</div>
        </div>
    )
}

const EntriesElement = ({entry}: {entry: Entry}) => {
    return (
        <div className="grid grid-cols-8 hover:bg-slate-200">
            <div>{entry.diver.teamId}</div>
            <div className='col-span-3'><span className="font-semibold">{entry.diver.lastName}</span>, {entry.diver.firstName}</div>
        </div>
    )
}
