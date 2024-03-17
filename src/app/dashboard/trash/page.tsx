import FilesBrowser from "@/components/FilesBrowser";

export default function TrashPage() {
	return (
		<div className="flex flex-col gap-8">
			<FilesBrowser title="Trash" deletedOnly />
		</div>
	);
}
