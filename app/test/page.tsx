import styles from "./page.module.css";
import { fetchPosts, fetchMenus } from '@/app/lib/cmsdata'
import { auth } from "@/auth"

export default async function Home() {
  const posts = await fetchPosts();
  const menus = await fetchMenus();
  const session = await auth();
  return (
    <div>
      <h1>Hello.</h1>
      <pre>Session: {JSON.stringify(session, null, 2)}</pre>
      <div>{`Got ${menus.length} menus`}</div>
      <pre>
          {JSON.stringify(process.env, null, 4)}
      </pre>
    </div>
  );
}