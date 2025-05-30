import { ConvexError, v } from "convex/values";
import { internalMutation, query} from "./_generated/server";

export const createUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		email: v.string(),
		firstname: v.string(),
		lastname: v.string(),
		image: v.string(),
    isAdmin: v.boolean()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("users", {
			tokenIdentifier: args.tokenIdentifier,
			email: args.email,
			firstname: args.firstname,
			lastname: args.lastname,	
			image: args.image,
			isAdmin: args.isAdmin
		});
	},
});
export const getMe = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
                 if (!identity) {
			throw new ConvexError("Unauthorized");
		}
		console.log(identity.tokenIdentifier)
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		return user;
	},
});


