"use client";

import { useEffect, useState } from 'react';
import { fetchPermissions } from '@/app/lib/api/reference';

export const IfUserHasPermission = ({
    children,
    objectType,
    objectId,
    requiredPermission
}: Readonly<{
    children?: React.ReactNode,
    objectType: string,
    objectId?: number,
    requiredPermission?: string
}>) => {
    const [permissions, setPermissions] = useState<string[] | null>(null);

    useEffect(() => {
        fetchPermissions(objectType, objectId).then(perms => setPermissions(perms));
    }, []);

    return (
        <>
            {(!requiredPermission || (permissions && permissions.includes(requiredPermission))) &&
                children
            }
        </>
    )
}

