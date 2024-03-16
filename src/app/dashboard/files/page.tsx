import FilesBrowser from "@/components/FilesBrowser";

export default function FilesPage() {
	return (
		<div className="flex flex-col gap-8">
			<FilesBrowser title="Your Files" />
		</div>
	);
}
