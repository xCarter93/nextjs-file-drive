"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function SideNav() {
	const pathname = usePathname();
	return (
		<div className="w-40 flex flex-col gap-4">
			<Link href="/dashboard/files">
				<Button
					variant={"link"}
					className={clsx(
						"flex gap-2",
						pathname === "/dashboard/files" && "text-blue-500"
					)}
				>
					<FileIcon /> All Files
				</Button>
			</Link>
			<Link href="/dashboard/favorites">
				<Button
					variant={"link"}
					className={clsx(
						"flex gap-2",
						pathname === "/dashboard/favorites" && "text-blue-500"
					)}
				>
					<StarIcon /> Favorites
				</Button>
			</Link>
		</div>
	);
}
