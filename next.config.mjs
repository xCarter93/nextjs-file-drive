/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "jovial-loris-459.convex.cloud",
				hostname: "adept-newt-291.convex.cloud",
			},
		],
	},
};

export default nextConfig;
