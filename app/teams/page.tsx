import { Suspense } from 'react';
import Link from 'next/link';

import { fetchTeams, } from '@/app/lib/api';
import Loading from '@/app/ui/Loading'
import { ActionButton } from '@/app/ui/StandardButtons';
import { IconPlus } from '@tabler/icons-react';

export default async function Page() {

    const teams = (await fetchTeams()).sort((a, b) => ((a.name || a.id) > (b.name || b.id) ? 1 : -1));
    return (
        <Suspense fallback={Loading()} >
            <div className="flex justify-end mb-4">
                <Link href={`/teams/new`} >
                    <ActionButton><IconPlus size={24} />New</ActionButton>
                </Link>

            </div>
            <div className='grid grid-cols-[auto_auto_auto_auto] gap-x-2'>

                <div className='grid-table-header-cells'>Team Name</div>
                <div className='grid-table-header-cells'>Code</div>
                <div className='grid-table-header-cells'>Archived</div>
                <div className='grid-table-header-cells'>URL</div>

                {teams.map((t, k) =>
                    <Link key={t.id} href={`/teams/${t.id}`} className='col-span-full grid grid-cols-subgrid hover:bg-gray-100 cursor-pointer py-1'>
                        <div>{t.name}</div>
                        <div>{t.id}</div>
                        <div>
                            {t.archived ? "Yes" : ""}
                        </div>
                        <div className=''>
                            {t.url?.substring(0, 50)}{t.url && t.url.length > 50 ? "..." : ""}
                        </div>
                    </Link>
                )}
            </div>


        </Suspense>
    )
}
