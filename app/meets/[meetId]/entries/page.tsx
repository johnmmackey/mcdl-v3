
import { format } from 'date-fns';
import { Grid, GridCol } from '@mantine/core';
import { fetchTeams, fetchMeet, fetchMeetEntries, fetchAgeGroups } from '@/app/lib/data';
import strcmp from '@/app/lib/strcmp'
import { Meet, Entry, AgeGroup } from '@/app/lib/definitions'
import { MeetHeading, AgeGroupIterator } from '@/app/meets/[meetId]/MeetComponents'

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

        <div style={{ maxWidth: '800px' }}>
            <MeetHeading meet={meet} teams={teams}>Meet Entries</MeetHeading>

            <AgeGroupIterator
                ageGroups={ageGroups}
                meet={meet}
                iteree={meetEntries}
                field='ageGroupId'
                GroupHeader={EntriesHeader}
                GroupElement={EntriesElement}
                groupSort={(a: Entry, b:Entry) => strcmp(a.poolcode + a.lastName + a.firstName, b.poolcode + b.lastName + b.firstName)}
            />
        </div>
    )
}

export const EntriesHeader = ({meet}: {meet: Meet}) =>
{
    return (
        <Grid columns={8}>
            <GridCol span={1} className='font-semibold'>Pool</GridCol>
            <GridCol span={3} className='font-semibold'>Diver</GridCol>
        </Grid>
    )
}

export const EntriesElement = ({e, k, meet, ag }: {e: Entry, k:number, meet: Meet, ag: AgeGroup}) => {
    return (
            <Grid key={k} columns={8} className='hover:bg-slate-200'>
                <GridCol span={1} className='py-1'>{e.poolcode}</GridCol>
                <GridCol span={3} className='py-1'>{e.firstName} {e.lastName}</GridCol>
            </Grid>
    )
}
