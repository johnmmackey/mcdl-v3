/** @type {import('next').NextConfig} */
const nextConfig = {
        serverExternalPackages: ['sequelize'],
        logging: {
                fetches: {
                        fullUrl: true,
                        hmrRefreshes: true,
                },
        },
}
export default nextConfig;
