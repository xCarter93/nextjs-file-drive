import FilesBrowser from "@/components/FilesBrowser";

export default function FavoritesPage() {
	return (
		<div className="flex flex-col gap-8">
			<FilesBrowser title="Your Favorites" favoritesOnly />
		</div>
	);
}
