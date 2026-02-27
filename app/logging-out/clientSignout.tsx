
"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ClientSignOut({ logoutUrl }: { logoutUrl: string }) {
    // Client-side sign out to clear session and trigger any client-side effects
    const router = useRouter();


    useEffect(() => {
        signOut()
            .catch((error) => {
                console.error('Error during sign out:', error);
            })
            .finally(() => {
                router.push(logoutUrl);
            })
    }, [router]);

    return (
        <div>
            Logging out...

        </div>
    )
}