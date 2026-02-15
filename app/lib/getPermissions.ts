'use server';

import { fetchPermissions } from '@/app/lib/api/reference';

export const getPermissions = async (objectType: string, objectId: number | undefined) => {
    const permissions = await fetchPermissions(objectType, objectId);
    const hasPermission = (p: string) => permissions.includes(p) || permissions.includes('*');

    return hasPermission;
}