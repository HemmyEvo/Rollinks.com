import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		firstname:v.string(),
		lastname:v.string(),
		email: v.string(),
		image: v.string(),
		tokenIdentifier: v.string(),
		
	}).index("by_tokenIdentifier", ["tokenIdentifier"]),

	
});
