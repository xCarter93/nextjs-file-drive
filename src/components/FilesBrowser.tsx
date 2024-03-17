"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadButton from "@/components/UploadButton";
import FileCard from "@/components/FileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import { GridIcon, Loader2, Table2Icon } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { DataTable } from "./file-table/data-table";
import { columns } from "./file-table/columns";

export default function FilesBrowser({
	title,
	favoritesOnly,
	deletedOnly,
}: {
	title: string;
	favoritesOnly?: boolean;
	deletedOnly?: boolean;
}) {
	const organization = useOrganization();
	const user = useUser();

	const [query, setQuery] = useState("");

	let orgId: string | undefined;
	if (organization.isLoaded && user.isLoaded) {
		orgId = organization.organization?.id ?? user.user?.id;
	}
	const favorites = useQuery(
		api.files.getAllFavorites,
		orgId ? { orgId } : "skip"
	);

	const files = useQuery(
		api.files.getFiles,
		orgId ? { orgId, query, favorites: favoritesOnly, deletedOnly } : "skip"
	);

	const modifiedFiles =
		files?.map((file) => ({
			...file,
			isFavorited: (favorites ?? []).some(
				(favorite) => favorite.fileId === file._id
			),
		})) ?? [];

	const isLoading = files === undefined;
	return (
		<div>
			{files && (
				<>
					<div className="flex justify-between mb-8">
						<h1 className="text-4xl font-bold">{title}</h1>

						<SearchBar query={query} setQuery={setQuery} />

						<UploadButton />
					</div>

					<Tabs defaultValue="grid">
						<TabsList className="mb-4">
							<TabsTrigger value="grid" className="flex gap-2 items-center">
								<GridIcon size={24} />
								Grid
							</TabsTrigger>
							<TabsTrigger value="table" className="flex gap-2 items-center">
								<Table2Icon size={24} />
								Table
							</TabsTrigger>
						</TabsList>
						{isLoading && (
							<div className="flex flex-col gap-8 w-full items-center mt-24 text-gray-500">
								<Loader2 className="animate-spin" size={128} />
								<p className="text-2xl">Loading your files...</p>
							</div>
						)}
						<TabsContent value="grid">
							<div className="grid grid-cols-3 gap-4">
								{modifiedFiles?.map((file) => {
									return <FileCard key={file._id} file={file} />;
								})}
							</div>
						</TabsContent>
						<TabsContent value="table">
							<DataTable columns={columns} data={modifiedFiles} />
						</TabsContent>
					</Tabs>

					{files.length === 0 && <Placeholder />}
				</>
			)}
		</div>
	);
}

function Placeholder() {
	return (
		<div className="flex flex-col gap-8 w-full items-center mt-24">
			<Image
				src="/empty.svg"
				alt="Image of a picture and directory icon"
				width={500}
				height={500}
			/>
			<p className="text-center text-gray-500 text-2xl">
				No files found. Click the button above to upload a file.
			</p>
			<UploadButton />
		</div>
	);
}
