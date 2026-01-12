import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getFamilies = query({
  handler: async (ctx) => {
    return await ctx.db.query("families").collect();
  },
});

export const getFamilyNodes = query({
  args: { familyId: v.id("families") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("familyNodes")
      .withIndex("by_family", (q) => q.eq("familyId", args.familyId))
      .collect();
  },
});

export const createFamily = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("families", args);
  },
});

export const addFamilyMember = mutation({
  args: {
    familyId: v.id("families"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    birthYear: v.optional(v.number()),
    note: v.optional(v.string()),
    parentId: v.optional(v.id("familyNodes")),
    fatherId: v.optional(v.id("familyNodes")),
    motherId: v.optional(v.id("familyNodes")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("familyNodes", args);
  },
});

export const updateFamilyMember = mutation({
  args: {
    id: v.id("familyNodes"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    birthYear: v.optional(v.number()),
    note: v.optional(v.string()),
    fatherId: v.optional(v.id("familyNodes")),
    motherId: v.optional(v.id("familyNodes")),
    parentId: v.optional(v.id("familyNodes")),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

export const deleteFamilyMember = mutation({
  args: {
    id: v.id("familyNodes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateFamily = mutation({
  args: {
    id: v.id("families"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

export const deleteFamily = mutation({
  args: {
    id: v.id("families"),
  },
  handler: async (ctx, args) => {
    // Note: This does not delete associated family nodes or events.
    // In a real app, you'd want to cascade delete or prevent deletion if children exist.
    await ctx.db.delete(args.id);
  },
});