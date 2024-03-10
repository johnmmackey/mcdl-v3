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
      <h1>Posts</h1>
      {posts.map((p, k) =>
        <div key={k}>
          <h1>{p.title}</h1>
          <div
            className={styles.revertstyles}
            dangerouslySetInnerHTML={{ __html: p.content }}
          />
        </div>
      )}
      <div>{`Got ${menus.length} menus`}</div>
    </div>
  );
}
