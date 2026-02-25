import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAccessToken } from "@/app/lib/accessTokens"

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
        throw new Error('Authentication required');
    }
    const token = await getAccessToken();

    return (
        <>
            <div><pre>{JSON.stringify(session, null, 2)}</pre></div>
            <div className="w-full break-words break-all">
                Access Token:<br />
                {token}
            </div>
        </>
    )
}
