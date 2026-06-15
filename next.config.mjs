/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        console.log("Setting up API proxy to backend:", process.env.NEXT_PUBLIC_BACKEND_URL);
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
            }
        ];
    }
};

export default nextConfig;
