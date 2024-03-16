import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
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
	TrashIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";

export default function FileCard({ file }: { file: Doc<"files"> }) {
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
				<CardTitle className="flex gap-2">
					<div className="flex justify-center">{typeIcons[file.type]}</div>
					{file.name}
				</CardTitle>
				<div className="absolute top-2 right-2">
					<FileCardActions file={file} />
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
						//open a new tab to the file location on convex
						window.open(getFileUrl(file.fileId), "_blank");
					}}
				>
					Download
				</Button>
			</CardFooter>
		</Card>
	);
}

function FileCardActions({ file }: { file: Doc<"files"> }) {
	const { toast } = useToast();

	const deleteFile = useMutation(api.files.deleteFile);
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
							setIsConfirmOpen(true);
						}}
						className="flex gap-1 text-red-500 items-center cursor-pointer"
					>
						<TrashIcon size={18} />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
