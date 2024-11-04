// app/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

const filePath = "count.txt";
const filePath_2 = "count_2.txt";

async function readCount() {
	return Number.parseInt(
		// localStorage.getItem("count") || "0",
		await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
	);
}

async function readCount_2() {
	return Number.parseInt(
		// localStorage.getItem("count_2") || "0",
		await fs.promises.readFile(filePath_2, "utf-8").catch(() => "0"),
	);
}

const getCount = createServerFn("GET", () => {
	return readCount();
});

const getCount_2 = createServerFn("GET", () => {
	return readCount_2();
});

const updateCount = createServerFn("POST", async (addBy: number) => {
	const count = await readCount();
	// localStorage.setItem("count", `${count + addBy}`);
	await fs.promises.writeFile(filePath, `${count + addBy}`);
});

const updateCount_2 = createServerFn("POST", async (addBy: number) => {
	const count = await readCount_2();
	// localStorage.setItem("count_2", `${count + addBy}`);
	await fs.promises.writeFile(filePath_2, `${count + addBy}`);
});

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => {
		return {
			count: await getCount(),
			count_2: await getCount_2(),
		};
	},
});

function Home() {
	const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<>
			<button
				type="button"
				onClick={() => {
					updateCount(2).then(() => {
						router.invalidate();
					});
				}}
			>
				Add 2 to {state.count}?
			</button>
			<button
				type="button"
				onClick={() => {
					updateCount_2(4).then(() => {
						router.invalidate();
					});
				}}
			>
				Add 4 to {state.count_2}?
			</button>
		</>
	);
}
