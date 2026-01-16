import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'

import { fetchTeams, fetchSeasons, fetchDivisions, fetchCurrentSeasonId, fetchTeamsForSeason } from '@/app/lib/data';
import { SeasonDropDownMenu } from './SeasonDropDownMenu';
import Loading from '@/app/ui/Loading'



export default async function Page() {
    const seasons = (await fetchSeasons()).sort((a, b) => b.id - a.id);
    const currentSeasonId = await fetchCurrentSeasonId();

    return (
        <Suspense fallback={Loading()} >
            <div className="grid grid-cols-6 gap-4">
                <div className='text-center font-semibold'>Season</div>
                <div className='text-center font-semibold'>Start Date</div>
                <div className='text-center font-semibold'>End Date</div>
                <div className='text-center font-semibold'>Week 1 Date</div>
            </div>
            {seasons.map(s =>
                <div key={s.id} className='group hover:bg-slate-200 grid grid-cols-6 gap-4' >
                    <div className='text-center'>
                        {s.id}
                        {s.id === currentSeasonId &&
                            <span>(current)</span>
                        }
                    </div>

                    <div className='text-center'>
                        {new Date(s.startDate).toLocaleDateString()}
                    </div>
                    <div className='text-center'>
                        {new Date(s.endDate).toLocaleDateString()}
                    </div>
                    <div className='text-center'>
                        {new Date(s.week1Date).toLocaleDateString()}
                    </div>
                    <div className='text-center'>
                        <SeasonDropDownMenu key={s.id} season={s} />
                    </div>
                </div>

            )}
        </Suspense>
    )
}


