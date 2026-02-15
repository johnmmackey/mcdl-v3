import { auth } from "@/auth";
import { getAccessToken } from "@/app/lib/accessTokens"

export default async function Page() {
    const session = await auth();
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
