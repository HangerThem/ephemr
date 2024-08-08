/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.dicebear.com",
			},
			{
				protocol: "https",
				hostname: "r7ri1xn3tskewzxc.public.blob.vercel-storage.com",
			},
		],
	},
}

export default nextConfig
