"use client";

import { useEffect, useState } from 'react';
import { fetchMeetPermissions } from '@/app/lib/api/meets';
import Link from 'next/link';
import { ActionButton } from '@/app/ui/StandardButtons';
import { IconPlus } from '@tabler/icons-react';


export const NewMeetButton = () => {
    const [permissions, setPermissions] = useState<string[] | null>(null);

    useEffect(() => {
        fetchMeetPermissions().then(perms => setPermissions(perms));
    }, []);

    return (
        <>
            {permissions && permissions.includes('addOrUpdateMeet') &&
                <Link href={`/meets/new`} >
                    <ActionButton><IconPlus size={24} />New</ActionButton>
                </Link>
            }
        </>
    )
}

