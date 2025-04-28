import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		firstname:v.string(),
		lastname:v.string(),
		email: v.string(),
		image: v.string(),
    isAdmin: v.boolean(),
		tokenIdentifier: v.string(),
		
	}).index("by_tokenIdentifier", ["tokenIdentifier"]),

	
});
