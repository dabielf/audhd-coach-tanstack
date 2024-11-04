// app/routes/index.tsx
import * as fs from "node:fs";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// const filePath = "count.txt";

// async function readCount() {
// 	return Number.parseInt(
// 		// localStorage.getItem("count") || "0",
// 		await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
// 	);
// }

// const getCount = createServerFn("GET", () => {
// 	return readCount();
// });

// const updateCount = createServerFn("POST", async (addBy: number) => {
// 	const count = await readCount();
// 	await fs.promises.writeFile(filePath, `${count + addBy}`);
// });

export const Route = createFileRoute("/")({
	component: Home,
	// loader: async () => {
	// 	return {
	// 		count: await getCount(),
	// 	};
	// },
});

function Home() {
	const router = useRouter();
	const state = Route.useLoaderData();
	const { data } = useSuspenseQuery(convexQuery(api.numbers.get, {}));
	const createNumber = useMutation(api.numbers.create);
	const updateNumber = useMutation(api.numbers.post);

	console.log("data", data);

	return (
		<>
			<button
				type="button"
				onClick={() => {
					createNumber({ value: 0 });
				}}
			>
				Create a new number
			</button>
			{data.map((number) => (
				<button
					key={number._id}
					type="button"
					onClick={() => {
						updateNumber({ id: number._id, value: 2 });
					}}
				>
					Add 2 to {number.value || "0"}?
				</button>
			))}
		</>
	);
}
