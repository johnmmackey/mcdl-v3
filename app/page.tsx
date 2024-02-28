import styles from "./page.module.css";
import { fetchPosts, fetchMenus } from '@/app/lib/cmsdata'

export default async function Home() {
  const posts = await fetchPosts();
  const menus = await fetchMenus();
  return (
    <div>
      {posts.map((p, k) =>
        <div key={k}>
          <h1>{p.title}</h1>
          <div
            className={styles.revertstyles}
            dangerouslySetInnerHTML={{ __html: p.content }}
          />
        </div>
      )}
      <div>Below are menues</div>
      <pre>
        {JSON.stringify(menus, null, 2)}
      </pre>
    </div>

  );
}
