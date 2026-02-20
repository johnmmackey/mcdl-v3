import { fetchCurrentSeasonId, fetchMeet, fetchSeasons } from '@/app/lib/api';
import { MeetCreateUpdateInput } from '@/app/lib/types/meet';
import { MeetForm } from '@/app/meets/components';


export default async function Page() {

    const seasons = await fetchSeasons();
    const currentSeasonId = await fetchCurrentSeasonId();

    let meetdata: MeetCreateUpdateInput;

    let defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    meetdata = {
        seasonId: currentSeasonId,
        customName: "",
        meetDate: defaultDate.toISOString(),
        entryDeadline: defaultDate.toISOString(),
        hostPoolId: null,
        coordinatorPoolId: null,
        meetType: 'Dual',
        divisionId: null,
        teamList: []
    };

    return (
        <MeetForm meet={meetdata} seasons={seasons} />
    )
}

