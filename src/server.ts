import { Glob } from "bun";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import type { ServerOptions } from "honox/server";
import { createApp } from "honox/server/base";

type RouteList =
	| ServerOptions["ROUTES"]
	| ServerOptions["MIDDLEWARE"]
	| ServerOptions["RENDERER"]
	| ServerOptions["ERROR"]
	| ServerOptions["NOT_FOUND"];

async function globImport<R extends RouteList[keyof RouteList]>(
	patterns: string[],
): Promise<R> {
	const routeList: R = {};
	for (const pattern of patterns) {
		for await (const filePath of new Glob(pattern).scan({
			cwd: `${process.cwd()}/src/routes`,
			absolute: true,
		})) {
			// filePath e.g.:
			// Linux / Mac: "/path/to/repo/my_app/src/routes/index.tsx"
			// Windows: "C:\path\to\repo\my_app\src\routes\index.tsx"
			const handler: R[keyof R] = await import(filePath);
			const webPath = filePath
				.replace(process.cwd(), "") // remove path to project root
				.replaceAll("\\", "/") // follow Windows separator
				.replace("/src/routes", ""); // make to document root
			routeList[webPath] = handler;
		}
	}
	return routeList;
}

const app = createApp({
	root: "",
	init: (app) => {
		app.use(logger());
	},
	// biome-ignore lint/style/useNamingConvention: honox
	RENDERER: await globImport(["**/_renderer.(ts|tsx)"]),
	// biome-ignore lint/style/useNamingConvention: honox
	ROUTES: await globImport([
		"**/!(_*|$*|*.test|*.spec).(ts|tsx|md|mdx)",
		".well-known/**/!(_*|$*|*.test|*.spec).(ts|tsx|md|mdx)",
	]),
	// biome-ignore lint/style/useNamingConvention: honox
	NOT_FOUND: await globImport(["**/_404.(ts|tsx)"]),
	// biome-ignore lint/style/useNamingConvention: honox
	ERROR: await globImport(["**/_error.(ts|tsx)"]),
	// biome-ignore lint/style/useNamingConvention: honox
	MIDDLEWARE: await globImport(["**/_middleware.(ts|tsx)"]),
});

showRoutes(app);

export default app;
