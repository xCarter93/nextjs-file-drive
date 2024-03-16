import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const formSchema = z.object({
	query: z.string().min(0).max(200),
});

export default function SearchBar({
	query,
	setQuery,
}: {
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			query: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setQuery(values.query);
	}
	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex gap-2 items-center"
				>
					<FormField
						control={form.control}
						name="query"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} placeholder="Search for a file" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						size="sm"
						type="submit"
						disabled={form.formState.isSubmitting}
						className="flex gap-2"
					>
						{form.formState.isSubmitting && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						<SearchIcon /> Search
					</Button>
				</form>
			</Form>
		</div>
	);
}
