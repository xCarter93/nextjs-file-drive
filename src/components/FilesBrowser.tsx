"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadButton from "@/components/UploadButton";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function FilesBrowser({
	title,
	favorites,
}: {
	title: string;
	favorites?: boolean;
}) {
	const organization = useOrganization();
	const user = useUser();

	const [query, setQuery] = useState("");

	let orgId: string | undefined;
	if (organization.isLoaded && user.isLoaded) {
		orgId = organization.organization?.id ?? user.user?.id;
	}

	const files = useQuery(
		api.files.getFiles,
		orgId ? { orgId, query, favorites } : "skip"
	);

	const isLoading = files === undefined;
	return (
		<div>
			{isLoading && (
				<div className="flex flex-col gap-8 w-full items-center mt-24 text-gray-500">
					<Loader2 className="animate-spin" size={128} />
					<p className="text-2xl">Loading your images...</p>
				</div>
			)}

			{files && (
				<>
					<div className="flex justify-between mb-8">
						<h1 className="text-4xl font-bold">{title}</h1>

						<SearchBar query={query} setQuery={setQuery} />

						<UploadButton />
					</div>
					{files.length === 0 && <Placeholder />}

					<div className="grid grid-cols-3 gap-4">
						{files?.map((file) => {
							return <FileCard key={file._id} file={file} />;
						})}
					</div>
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
