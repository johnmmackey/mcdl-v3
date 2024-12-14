import styles from "./page.module.css";
import sanitizeHtml from 'sanitize-html';
import { Card, Text } from '@mantine/core';
import { fetchPosts } from '@/app/lib/cmsdata'

export default async function Home() {
  const posts = await fetchPosts();

  return (
    posts.map((p, k) => (
        <Card withBorder padding="lg" radius="md" key={k} className="w-xl m-4 border-slate-800">
          <Text size="lg" fw={800}>
          {p.title}
          </Text>
            

          <div className="revertstyles" dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.content) }} />


        </Card>
      )
    )
  )
}

