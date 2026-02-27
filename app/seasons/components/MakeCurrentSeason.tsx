"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { makeSeasonCurrent } from '@/app/lib/api';
import { Processing } from '@/app/ui/Processing';

export const MakeSeasonCurrent = ({
    seasonId
}: Readonly<{
    seasonId: number
}>) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();


    const handleClick = async () => {
        startTransition(async () => {

            let r = await makeSeasonCurrent(seasonId);
            r.error ? toast.error(`Submission Failed`, { description: `${r.error.msg}` }) : router.push(`/seasons`);
        });
    }

    return (
        <>
            <Button variant='outline' onClick={handleClick}>Set As Current Season</Button>
            <Processing open={isPending} />
        </>
    )
}