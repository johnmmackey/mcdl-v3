"use client";
import { usePermissions } from '@/app/lib/usePermissions';

export const IfUserHasPermission = ({
    children,
    objectType,
    objectId,
    requiredPermission
}: Readonly<{
    children?: React.ReactNode,
    objectType: string,
    objectId?: number,
    requiredPermission: string
}>) => {
    const [loading, hasPermission] = usePermissions(objectType, objectId);
    return (
        <>
            {(!loading && hasPermission(requiredPermission)) &&
                children
            }
        </>
    )
}


export const IfUserHasPermission2 = ({
    children,
    hasPermission,
    requiredPermission
}: Readonly<{
    children: React.ReactNode,
    hasPermission: (p: string) => boolean,
    requiredPermission: string
}>) => {
    return (
        <>
            {(hasPermission(requiredPermission)) &&
                children
            }
        </>
    )
}