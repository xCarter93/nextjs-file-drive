import Link from "next/link";

export default function Footer() {
	return (
		<div className="h-24 bg-gray-100 mt-12 flex items-center bottom-0 w-full sticky">
			<div className="container mx-auto flex justify-between items-center">
				<div>FileDrive</div>
				<Link href="/privacy">Privacy</Link>
				<Link href="/terms-of-service">Terms of Service</Link>
				<Link href="/contact">Contact</Link>
				<Link href="/about">About</Link>
			</div>
		</div>
	);
}
