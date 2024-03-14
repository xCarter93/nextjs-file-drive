/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "jovial-loris-459.convex.cloud",
			},
		],
	},
};

export default nextConfig;
