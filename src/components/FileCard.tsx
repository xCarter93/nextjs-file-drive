import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Doc, Id } from "../../convex/_generated/dataModel";
import {
	FileIcon,
	FileTextIcon,
	GanttChartIcon,
	ImageIcon,
} from "lucide-react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import FileCardActions from "./FileCardActions";

export default function FileCard({
	file,
}: {
	file: Doc<"files"> & { isFavorited: boolean };
}) {
	const userProfile = useQuery(api.users.getUserProfile, {
		userId: file.userId,
	});
	const typeIcons = {
		image: <ImageIcon />,
		pdf: <FileTextIcon />,
		csv: <GanttChartIcon />,
	} as Record<string, ReactNode>;

	function getFileUrl(fileId: Id<"_storage">): string {
		return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
	}

	return (
		<Card>
			<CardHeader className="relative">
				<CardTitle className="flex gap-2 text-base font-normal">
					<div className="flex justify-center">{typeIcons[file.type]}</div>
					{file.name}
				</CardTitle>
				<div className="absolute top-2 right-2">
					<FileCardActions file={file} isFavorited={file.isFavorited} />
				</div>
			</CardHeader>
			<CardContent className="h-[200px] flex justify-center items-center">
				{file.type === "image" && (
					<Image
						alt={file.name}
						width={200}
						height={100}
						src={getFileUrl(file.fileId)}
					/>
				)}
				{file.type === "pdf" && <FileTextIcon size={100} />}
				{file.type === "csv" && <GanttChartIcon size={100} />}
			</CardContent>
			<CardFooter className="flex justify-between mt-4">
				<div className="flex gap-2 text-sm text-gray-500 items-center">
					<Avatar className="size-6">
						<AvatarImage src={userProfile?.image} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					{userProfile?.name}
				</div>
				<div className="text-sm text-gray-500">
					Uploaded {formatRelative(new Date(file._creationTime), new Date())}
				</div>
			</CardFooter>
		</Card>
	);
}
