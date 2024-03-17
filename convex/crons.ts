import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
	"delete files marked for deletion",
	{ minutes: 5 },
	internal.files.deleteAllFiles
);

export default crons;
