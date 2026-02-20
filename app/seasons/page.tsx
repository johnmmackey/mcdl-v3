import { Suspense } from 'react';
import Link from 'next/link';
import { IconPlus } from '@tabler/icons-react';

import { ActionButton, NewButton } from '@/app/ui/StandardButtons';
import { fetchSeasons, fetchCurrentSeasonId } from '@/app/lib/api';
import Loading from '@/app/ui/Loading'
import { IfUserHasPermission } from '../ui/IfUserHasPermission';

export default async function Page() {
    const seasons = (await fetchSeasons()).sort((a, b) => b.id - a.id);
    const currentSeasonId = await fetchCurrentSeasonId();

    return (
        <Suspense fallback={Loading()} >
            <div className="flex justify-end mb-2">
                <IfUserHasPermission objectType="seasons" requiredPermission='season:createOrUpdate' >
                     <NewButton href={`/seasons/new`} />
                </IfUserHasPermission>
            </div>
            <div className='grid grid-cols-5 gap-x-2'>

                <div className='grid-table-header-cells'>Season</div>
                <div className='grid-table-header-cells'>Start Date</div>
                <div className='grid-table-header-cells'>End Date</div>
                <div className='grid-table-header-cells'>Week 1 Date</div>
                <div className='grid-table-header-cells'># of Meets</div>
                {seasons.map(s =>
                    <Link key={s.id} href={`/seasons/${s.id}`} className='col-span-full grid grid-cols-subgrid hover:bg-gray-100 cursor-pointer py-1'>
                            <div className=''>
                                {s.id}
                                {s.id === currentSeasonId &&
                                    <span className='mx-2'>(current)</span>
                                }
                            </div>
                            <div>
                                {new Date(s.safeStartDate).toLocaleDateString()}
                            </div>
                            <div className=''   >
                                {new Date(s.safeEndDate).toLocaleDateString()}
                            </div>
                            <div>
                                {new Date(s.week1Date).toLocaleDateString()}
                            </div>
                            <div>
                                {s._count.meets}
                            </div>
                    </Link>
                )}
            </div>
        </Suspense >
    )
}


