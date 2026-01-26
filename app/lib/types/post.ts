export type GraphQLPosts = {
    data: {
        posts: {
            edges: {
                node: {
                    postacf: {
                        expiry: string,
                        order: number,
                        supressTitle: boolean,
                        template: string,
                        titleIcon: string
                    },
                    title: string,
                    content: string,
                    slug: string
                }
            }[]
        }
    }
}

export type GraphQLMenus = {
    data: {
        menus: {
            nodes: {
                name: string,
                slug: string,
                menuItems: {
                    edges: [
                        {
                            node: {
                                label: string,
                                target: string,
                                url: string,
                                order: number
                            }
                        }
                    ]
                }
            }[]
        }
    },
}

export type Post = {
    title: string,
    slug: string,
    content: string,
    expiry: string,
    order: number,
    supressTitle: boolean,
    template: string,
    titleIcon: string
}

export type Posts = Post[]

export type Menu = {
    name: string,
    slug: string,
    menuItems: {
        label: string,
        target: string,
        url: string,
        order: number
    }[]
}

export type Menus = Menu[];