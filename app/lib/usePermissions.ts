'use client';

import { useEffect, useState } from 'react';
import { fetchPermissions } from '@/app/lib/api/reference';

export const usePermissions = (objectType: string, objectId: number | undefined) => {
    const [ loading, setLoading ] = useState(true);
    const [ permissions, setPermissions ] = useState<string[]>([]);

    const hasPermission = (p: string) => permissions.includes(p) || permissions.includes('*');

    useEffect(() => {
        fetchPermissions(objectType, objectId)
            .then(perms => {
                console.log('Permissions for', objectType, objectId, ':', perms);
                return perms;
            })
            .then(perms => setPermissions(perms))
            .finally(() => setLoading(false));
    }, []);



    return [loading, hasPermission] as const;
}

