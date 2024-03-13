import {
	OrganizationSwitcher,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
	return (
		<header className="border-b py-4 bg-gray-50">
			<div className="container mx-auto flex justify-between items-center">
				<div>FileDrive</div>
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
