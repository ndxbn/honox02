function main(): Promise<void> {
	console.log("hello ndxbn/bun main!");
	return Promise.resolve();
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
