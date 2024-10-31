import { $ } from "bun";

if (process.env.NODE_ENV === "development") {
	await Promise.all([$`bunx lefthook install`]);
}
