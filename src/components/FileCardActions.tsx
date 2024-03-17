"use client";

import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useToast } from "./ui/use-toast";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
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
} from "./ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	FileIcon,
	MoreVertical,
	StarIcon,
	TrashIcon,
	UndoIcon,
} from "lucide-react";
import { Protect } from "@clerk/nextjs";

export default function FileCardActions({
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
	const me = useQuery(api.users.getMe);

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

					<Protect
						condition={(check) => {
							return (
								check({
									role: "org:admin",
								}) || file.userId === me?._id
							);
						}}
						fallback={<></>}
					>
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
