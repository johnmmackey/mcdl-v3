import type { NextConfig } from "next";

const nextConfig: NextConfig = {
        images: {
                remotePatterns: [
                        { protocol: "https", hostname: "cdn.sanity.io" },
                        { protocol: "https", hostname: "placehold.co" },
                ],
        },
        logging: {
                fetches: {
                        fullUrl: false,
                        hmrRefreshes: false,
                },
        },

        serverExternalPackages: [
                'pino',
                'pino-worker',
                'pino-file',
                'pino-pretty',
                '@axiomhq/pino',
        ],
}

export default nextConfig;
