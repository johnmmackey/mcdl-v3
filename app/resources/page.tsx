import Link from 'next/link';

import { defineQuery, PortableText, } from "next-sanity";
import { sanityFetch } from "@/sanity/live";

const PAGE_QUERY = defineQuery(`*[_type == 'page' ]`);

export default async function IndexPage() {
    const { data: pages } = await sanityFetch({ query: PAGE_QUERY });

    return (
        <div className='revertstyles'>
            {pages?.length
                ?
                    <PortableText value={pages[0].content} />
                :
                    <div>No Resources Slug Found </div>
            }
        </div>
    );
}
