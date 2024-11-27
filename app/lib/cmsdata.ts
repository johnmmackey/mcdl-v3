import { Posts, Menus, GraphQLPosts, GraphQLMenus } from '@/app/lib/definitions';

const postsQuery = new URLSearchParams({
    query: '{posts{edges{node{postacf{expiry order supressTitle template titleIcon} title content}}}}'
})

const menusQuery = new URLSearchParams({
    query: '{ menus { nodes { slug name menuItems { edges { node { url label target order }}}}}}'
})

export async function fetchPosts(): Promise<Posts> {
    let f = await fetch(`https://cms.mcdiving.org/graphql?${postsQuery}`, { next: { revalidate: 3600 } })
    let d: GraphQLPosts = await f.json();


    return d.data.posts.edges
        //.filter(e => !e.node.postacf.expiry || ((new Date(e.node.postacf.expiry)).getTime() > Date.now()))
        .map(e => ({
            title: e.node.title,
            content: e.node.content,
            slug: e.node.slug,
            ...e.node.postacf
        }));
}

export async function fetchMenus(): Promise<Menus> {
    let f = await fetch(`https://cms.mcdiving.org/graphql?${menusQuery}`)
    let d: GraphQLMenus = await f.json();

    return d.data.menus.nodes
        .map(e => ({
            name: e.name,
            slug: e.slug,
            menuItems: e.menuItems.edges.map(n => n.node)
        }));
}
