import { Suspense } from 'react';
import Link from 'next/link';

import { fetchTeams, } from '@/app/lib/api';
import Loading from '@/app/ui/Loading'
import { ActionButton } from '@/app/ui/StandardButtons';
import { IconPlus } from '@tabler/icons-react';

import { LinkTableRow } from '../ui/LinkTableRow';
import { Button } from '@/components/ui/button';

export default async function Page() {

    const teams = (await fetchTeams()).sort((a, b) => ((a.name || a.id) > (b.name || b.id) ? 1 : -1));
    return (
        <Suspense fallback={Loading()} >
            <span>abc <Button>abc</Button></span>
            <div className="flex justify-end mb-4">
                <Link href={`/teams/new`} >
                    <ActionButton><IconPlus size={24} />New</ActionButton>
                </Link>

            </div>
            <div className='grid grid-cols-8 gap-x-2'>

                <div className='grid-table-header-cells'>Team Name</div>
                <div className='grid-table-header-cells'>Code</div>
                <div className='grid-table-header-cells'>Archived</div>
                <div className='grid-table-header-cells col-span-5'>URL</div>

                {teams.map((t, k) =>
                    <Link key={t.id} href={`/teams/${t.id}`} className='col-span-full grid grid-cols-subgrid hover:bg-gray-100 cursor-pointer py-1'>
                        <div>{t.name}</div>
                        <div>{t.id}</div>
                        <div>
                            {t.archived ? "Yes" : ""}
                        </div>
                        <div className='col-span-5'>
                            {t.url &&
                                <>
                                    {t.url}
                                    <Link href={t.url} target="_blank" rel="noopener noreferrer" className="ml-2">
                                        <Button variant="outline" className="">
                                            <IconPlus size={16} />
                                        </Button>
                                        </Link>
                                    </>
                            }
                        </div>
                    </Link>
                )}
            </div>


        </Suspense>
    )
}
