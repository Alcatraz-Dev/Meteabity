import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getEvents = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").order("desc").collect();
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    dateISO: v.string(),
    location: v.optional(v.string()),
    kind: v.union(v.literal("Birthday"), v.literal("Reunion"), v.literal("Holiday"), v.literal("Other")),
    notes: v.optional(v.string()),
    media: v.optional(v.object({
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      alt: v.optional(v.string()),
      posterUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      ...args,
      reactions: { like: 0, smile: 0, heart: 0, celebrate: 0 },
    });
  },
});

export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.string(),
    dateISO: v.string(),
    location: v.optional(v.string()),
    kind: v.union(v.literal("Birthday"), v.literal("Reunion"), v.literal("Holiday"), v.literal("Other")),
    notes: v.optional(v.string()),
    media: v.optional(v.object({
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      alt: v.optional(v.string()),
      posterUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

export const deleteEvent = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addReaction = mutation({
  args: {
    eventId: v.id("events"),
    reaction: v.union(v.literal("like"), v.literal("smile"), v.literal("heart"), v.literal("celebrate")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "anonymous";
    
    const existingReaction = await ctx.db
      .query("userReactions")
      .withIndex("by_user_item", (q) => 
        q.eq("userId", userId).eq("itemId", args.eventId).eq("itemType", "event")
      )
      .first();
    
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    
    if (existingReaction) {
      if (existingReaction.reactionType === args.reaction) {
        await ctx.db.delete(existingReaction._id);
        await ctx.db.patch(args.eventId, {
          reactions: {
            ...event.reactions,
            [args.reaction]: Math.max(0, event.reactions[args.reaction] - 1),
          },
        });
      } else {
        await ctx.db.patch(existingReaction._id, {
          reactionType: args.reaction,
        });
        await ctx.db.patch(args.eventId, {
          reactions: {
            ...event.reactions,
            [existingReaction.reactionType]: Math.max(0, event.reactions[existingReaction.reactionType] - 1),
            [args.reaction]: event.reactions[args.reaction] + 1,
          },
        });
      }
    } else {
      await ctx.db.insert("userReactions", {
        userId,
        itemId: args.eventId,
        itemType: "event",
        reactionType: args.reaction,
      });
      await ctx.db.patch(args.eventId, {
        reactions: {
          ...event.reactions,
          [args.reaction]: event.reactions[args.reaction] + 1,
        },
      });
    }
  },
});

export const getUserReactions = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "anonymous";
    return await ctx.db
      .query("userReactions")
      .withIndex("by_user_item", (q) => q.eq("userId", userId))
      .collect();
  },
});