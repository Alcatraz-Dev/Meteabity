import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getNews = query({
  handler: async (ctx) => {
    return await ctx.db.query("news").order("desc").collect();
  },
});

export const createNews = mutation({
  args: {
    title: v.string(),
    dateISO: v.string(),
    summary: v.string(),
    tags: v.array(v.union(v.literal("Update"), v.literal("Milestone"), v.literal("Reminder"))),
    media: v.optional(v.object({
      type: v.union(v.literal("image"), v.literal("video")),
      url: v.string(),
      alt: v.optional(v.string()),
      posterUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("news", {
      ...args,
      reactions: { like: 0, smile: 0, heart: 0, celebrate: 0 },
    });
  },
});

export const updateNews = mutation({
  args: {
    id: v.id("news"),
    title: v.string(),
    dateISO: v.string(),
    summary: v.string(),
    tags: v.array(v.union(v.literal("Update"), v.literal("Milestone"), v.literal("Reminder"))),
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

export const deleteNews = mutation({
  args: {
    id: v.id("news"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addNewsReaction = mutation({
  args: {
    newsId: v.id("news"),
    reaction: v.union(v.literal("like"), v.literal("smile"), v.literal("heart"), v.literal("celebrate")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "anonymous";
    
    const existingReaction = await ctx.db
      .query("userReactions")
      .withIndex("by_user_item", (q) => 
        q.eq("userId", userId).eq("itemId", args.newsId).eq("itemType", "news")
      )
      .first();
    
    const news = await ctx.db.get(args.newsId);
    if (!news) throw new Error("News not found");
    
    if (existingReaction) {
      if (existingReaction.reactionType === args.reaction) {
        await ctx.db.delete(existingReaction._id);
        await ctx.db.patch(args.newsId, {
          reactions: {
            ...news.reactions,
            [args.reaction]: Math.max(0, news.reactions[args.reaction] - 1),
          },
        });
      } else {
        await ctx.db.patch(existingReaction._id, {
          reactionType: args.reaction,
        });
        await ctx.db.patch(args.newsId, {
          reactions: {
            ...news.reactions,
            [existingReaction.reactionType]: Math.max(0, news.reactions[existingReaction.reactionType] - 1),
            [args.reaction]: news.reactions[args.reaction] + 1,
          },
        });
      }
    } else {
      await ctx.db.insert("userReactions", {
        userId,
        itemId: args.newsId,
        itemType: "news",
        reactionType: args.reaction,
      });
      await ctx.db.patch(args.newsId, {
        reactions: {
          ...news.reactions,
          [args.reaction]: news.reactions[args.reaction] + 1,
        },
      });
    }
  },
});