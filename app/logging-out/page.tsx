
"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter, redirect } from "next/navigation";
import { use, useEffect } from "react";

export default function Page() {
    // Client-side sign out to clear session and trigger any client-side effects
    const router = useRouter();


useEffect(() => {
    signOut()
        .then(() => {
            router.push(process.env.NEXT_PUBLIC_LOGOUT_URL || '/');
        })
        .catch((error) => {
            console.error('Error during sign out:', error);
            router.push(process.env.NEXT_PUBLIC_LOGOUT_URL || '/');
        })
    }, [router]);

    

    return (
        <div>
            Logging out...
            
        </div>
    )
}
