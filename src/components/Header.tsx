import {
	OrganizationSwitcher,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<header className="border-b py-4 bg-gray-50">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="flex items-center gap-2">
					<Image src="/logo.png" alt="Web app logo" width={64} height={64} />
					<span className="text-xl font-bold">FileDrive</span>
				</Link>
				<Button variant={"outline"}>
					<Link href="/dashboard/files">Your files</Link>
				</Button>

				<div className="flex gap-2">
					<OrganizationSwitcher />
					<UserButton />
					<SignedOut>
						<SignInButton>
							<Button>Sign In</Button>
						</SignInButton>
					</SignedOut>
				</div>
			</div>
		</header>
	);
}
