import styles from "./page.module.css";
import sanitizeHtml from 'sanitize-html';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { fetchPosts } from '@/app/lib/cmsdata'

export default async function Home() {
  const posts = await fetchPosts();

  return (
    posts.map((p, k) => (
      <Card key={k} className="w-full max-w-lg mb-4">
        {p.title &&
          <CardHeader>
            <CardTitle>
              {p.title}
            </CardTitle>
          </CardHeader>
        }

        <CardContent>
          <div className="revertstyles" dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.content) }} />
        </CardContent>

      </Card>
    )
    )
  )
}

