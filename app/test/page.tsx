import {  accessToken } from '@/app/lib/data';

export default async function Page() {
    const t = await accessToken();

    return (
        <div>Access Token: {t}</div>
    )
}
