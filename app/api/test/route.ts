import { revalidatePath } from "next/cache"

const GET = async function() {
    revalidatePath('/standings/[seasonId]', 'page');
    return Response.json({});
}

export { GET }