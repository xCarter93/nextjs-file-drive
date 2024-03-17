"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import FileCardActions from "../FileCardActions";

function UserCell({ userId }: { userId: Id<"users"> }) {
	const userProfile = useQuery(api.users.getUserProfile, {
		userId: userId,
	});
	return (
		<div className="flex gap-2 text-sm text-gray-500 items-center">
			<Avatar className="size-6">
				<AvatarImage src={userProfile?.image} />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			{userProfile?.name}
		</div>
	);
}

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "type",
		header: "Type",
	},
	{
		accessorKey: "user",
		header: "User",
		cell: ({ row }) => {
			return <UserCell userId={row.original.userId} />;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Uploaded On",
		cell: ({ row }) => {
			return (
				<div>
					{formatRelative(new Date(row.original._creationTime), new Date())}
				</div>
			);
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		id: "actions",
		cell: ({ row }) => {
			const file = row.original;

			return <FileCardActions file={file} isFavorited={file.isFavorited} />;
		},
	},
];
