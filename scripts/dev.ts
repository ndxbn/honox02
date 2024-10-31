import { $ } from "bun";

if (process.env.NODE_ENV === "development") {
	await Promise.all([$`bunx lefthook install`]);
	console.log("To get started developing: edit src/main.ts and `bun start`");
}
