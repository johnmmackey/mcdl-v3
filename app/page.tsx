import styles from "./page.module.css";
import { Card } from 'flowbite-react';
import { fetchPosts } from '@/app/lib/cmsdata'

export default async function Home() {
  const posts = await fetchPosts();

  return (
    posts.map((p, k) => (
        <Card key={k} className="w-xl m-4 border-slate-800">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white p-2">
            {p.title}
          </h5>
          <div className="revertstyles font-normal text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: p.content }} />
        </Card>
      )
    )
  )
}

