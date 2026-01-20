"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { deleteSeason } from '@/app/lib/data';

import { Processing, AreYouSure } from "@/app/ui/Processing"

export const DeleteSeason = ({
    seasonId
}: Readonly<{
    seasonId: number
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();



    const handleDelete = () => {
        startTransition(async () => {
            let r = await deleteSeason(seasonId);
            r.error ? toast.error(`Deletion failed: ${r.error.msg}`) : router.push(`/seasons`);
        });
    }


    return (
        <>
            <AreYouSure msg="This action cannot be undone. Are you sure you want to permanently delete this season?" onConfirm={handleDelete} >
                <Button type="button" variant="destructive" >Delete Season</Button>
            </AreYouSure>
            <Processing open={isPending} />
        </>
    )
}