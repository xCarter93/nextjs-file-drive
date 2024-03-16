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
import { useToast } from "@/components/ui/use-toast";

import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
	FileTextIcon,
	GanttChartIcon,
	ImageIcon,
	MoreVertical,
	StarIcon,
	TrashIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
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
				<CardTitle className="flex gap-2">
					<div className="flex justify-center">{typeIcons[file.type]}</div>
					{file.name}
				</CardTitle>
				<div className="absolute top-2 right-2">
					<FileCardActions file={file} isFavorited={isFavorited} />
				</div>
				{/* <CardDescription>Card Description</CardDescription> */}
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
			<CardFooter className="flex justify-center">
				<Button
					onClick={() => {
						window.open(getFileUrl(file.fileId), "_blank");
					}}
				>
					Download
				</Button>
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
	const toggleFavorite = useMutation(api.files.toggleFavorite);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	return (
		<>
			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogTrigger></AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
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
									title: "File Deleted",
									description: "Your file has been deleted",
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
								setIsConfirmOpen(true);
							}}
							className="flex gap-1 text-red-500 items-center cursor-pointer"
						>
							<TrashIcon size={20} />
							Delete
						</DropdownMenuItem>
					</Protect>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
