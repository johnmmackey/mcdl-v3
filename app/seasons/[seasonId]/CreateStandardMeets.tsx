"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { createStandardMeets } from '@/app/lib/data';

import { Processing, } from "@/app/ui/Processing"

export const CreateStandardMeets = ({
    seasonId
}: Readonly<{
    seasonId: number
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();



    const handleClick = () => {
        startTransition(async () => {
            let r = await createStandardMeets(seasonId);
            r.error ? toast.error(`Standard Meet Creation failed: ${r.error.msg}`) : router.push(`/seasons`);
        });
    }


    return (
        <>
            <Button type="button" variant="destructive" onClick={handleClick} >Create Standard Meets</Button>
            <Processing open={isPending} />
        </>
    )
}