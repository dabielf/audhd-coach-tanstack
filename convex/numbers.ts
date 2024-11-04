import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("numbers").collect();
	},
});

export const create = mutation({
	args: { value: v.number() },
	handler: async (ctx, args) => {
		await ctx.db.insert("numbers", { value: args.value });
	},
});

export const post = mutation({
	args: { id: v.id("numbers"), value: v.number() },
	handler: async (ctx, args) => {
		const number = await ctx.db.get(args.id);
		console.log("number", number);
		await ctx.db.patch(args.id, { value: number.value + args.value });
	},
});
