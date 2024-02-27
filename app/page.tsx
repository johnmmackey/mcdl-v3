import Image from "next/image";
import Link from 'next/link';
import styles from "./page.module.css";
import {fetchPosts} from '@/app/lib/cmsdata'

export default async function Home() {
  const posts = await fetchPosts();
  return (
      <div>
        {posts.map( (p,k) =>
          <div key={k}>
              <h1>{p.title}</h1>
              <div
                className={styles.revertstyles}
                dangerouslySetInnerHTML={{ __html: p.content }}
              />
          </div>
        )}
      </div>

  );
}
