"use server";

import { signOut } from "@/lib/auth-client";
import { ClientSignOut } from "./clientSignout";

const logoutUrl = `${process.env.COGNITO_DOMAIN}/logout?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=${process.env.NEXT_PUBLIC_APP_URL}/logged-out`;

export default async function Page() {
    console.log('signout says', await signOut());
    //redirect(logoutUrl);
    return (
        <ClientSignOut logoutUrl={logoutUrl} />
    )
}
