import { revalidatePath } from "next/cache"

const GET = async function(req: any) {
    console.log(req)
    revalidatePath('/standings/[seasonId]', 'page');
    return Response.json({"a": 'b'});
}

export { GET }
