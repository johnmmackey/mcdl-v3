import { fetch401 } from "../lib/api";
import Loading from "../ui/Loading";
import { Processing } from "../ui/Processing";

export default async function Page() {


    //await fetch401();

    

    return (
        <div>
            Getting a 401 error should redirect you to the logging out page, which will then redirect you to the home page. If you see this message, something went wrong.
            <Processing open={true} />
            <Loading />
        </div>
    )
}
