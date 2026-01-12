import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSocialLinks = query({
  handler: async (ctx) => {
    return await ctx.db.query("socialLinks").order("desc").collect();
  },
});

export const createSocialLink = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("socialLinks", {
      name: args.name,
      url: args.url,
      icon: args.icon,
    });
  },
});

export const deleteSocialLink = mutation({
  args: { id: v.id("socialLinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});