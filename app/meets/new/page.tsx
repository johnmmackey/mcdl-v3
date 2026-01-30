import { fetchCurrentSeasonId, fetchMeet, fetchSeasons } from '@/app/lib/api';
import { MeetEditable } from '@/app/lib/types/meet';
import { MeetForm } from '@/app/meets/components';


export default async function Page() {

    const seasons = await fetchSeasons();
    const currentSeasonId = await fetchCurrentSeasonId();

    let meetEditable: MeetEditable;

    let defaultDate = new Date();
    defaultDate.setHours(0, 0, 0, 0);

    meetEditable = {
        id: null,
        seasonId: currentSeasonId,
        customName: "",
        defaultName: "",
        parentMeet: null,
        meetDate: defaultDate.toISOString(),
        entryDeadline: defaultDate.toISOString(),
        hostPoolId: null,
        coordinatorPoolId: null,
        meetType: 'Dual',
        divisionId: null,
        scoresPublished: null,
        teamList: []
    };

    return (
        <MeetForm meet={meetEditable} seasons={seasons} />
    )
}

