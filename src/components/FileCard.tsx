import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useToast } from "@/components/ui/use-toast";

import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
	FileIcon,
	FileTextIcon,
	GanttChartIcon,
	ImageIcon,
	MoreVertical,
	StarIcon,
	TrashIcon,
	UndoIcon,
} from "lucide-react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";

export default function FileCard({
	file,
	favorites,
}: {
	file: Doc<"files">;
	favorites: Doc<"favorites">[];
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

	const isFavorited = favorites.some(
		(favorite) => favorite.fileId === file._id
	);
	return (
		<Card>
			<CardHeader className="relative">
				<CardTitle className="flex gap-2 text-base font-normal">
					<div className="flex justify-center">{typeIcons[file.type]}</div>
					{file.name}
				</CardTitle>
				<div className="absolute top-2 right-2">
					<FileCardActions file={file} isFavorited={isFavorited} />
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

function FileCardActions({
	file,
	isFavorited,
}: {
	file: Doc<"files">;
	isFavorited: boolean;
}) {
	const { toast } = useToast();

	const deleteFile = useMutation(api.files.deleteFile);
	const restoreFile = useMutation(api.files.restoreFile);
	const toggleFavorite = useMutation(api.files.toggleFavorite);

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	function getFileUrl(fileId: Id<"_storage">): string {
		return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
	}
	return (
		<>
			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogTrigger></AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will mark the file for our deletion process. Files are
							deleted periodically.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								await deleteFile({
									fileId: file._id,
								});
								toast({
									variant: "default",
									title: "File marked for deletion",
									description: "Your file will be deleted soon",
								});
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<DropdownMenu>
				<DropdownMenuTrigger>
					<MoreVertical />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							window.open(getFileUrl(file.fileId), "_blank");
						}}
						className="flex gap-1 items-center cursor-pointer"
					>
						<FileIcon size={20} />
						Download
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							toggleFavorite({
								fileId: file._id,
							});
						}}
						className="flex gap-1 items-center cursor-pointer"
					>
						{isFavorited ? (
							<div className="flex gap-1 items-center">
								<StarIcon size={20} fill="#FDE047" /> Unfavorite
							</div>
						) : (
							<div className="flex gap-1 items-center">
								<StarIcon size={20} /> Favorite
							</div>
						)}
					</DropdownMenuItem>

					<Protect role="org:admin" fallback={<></>}>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								if (file.shouldDelete) {
									restoreFile({
										fileId: file._id,
									});
								} else {
									setIsConfirmOpen(true);
								}
							}}
							className="flex gap-1 items-center cursor-pointer"
						>
							{file.shouldDelete ? (
								<div className="flex gap-1 text-green-700 items-center cursor-pointer">
									<UndoIcon size={20} />
									Restore
								</div>
							) : (
								<div className="flex gap-1 text-red-500 items-center cursor-pointer">
									<TrashIcon size={20} />
									Delete
								</div>
							)}
						</DropdownMenuItem>
					</Protect>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
