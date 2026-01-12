import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getComments = query({
  args: {
    itemId: v.string(),
    itemType: v.union(v.literal("event"), v.literal("news")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_item", (q) => q.eq("itemType", args.itemType).eq("itemId", args.itemId))
      .order("asc")
      .collect();
  },
});

export const addComment = mutation({
  args: {
    itemId: v.string(),
    itemType: v.union(v.literal("event"), v.literal("news")),
    author: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      ...args,
      dateISO: new Date().toISOString().split('T')[0],
      reactions: { like: 0, smile: 0, heart: 0, celebrate: 0 },
    });
  },
});

export const addCommentReaction = mutation({
  args: {
    commentId: v.id("comments"),
    reaction: v.union(v.literal("like"), v.literal("smile"), v.literal("heart"), v.literal("celebrate")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "anonymous";
    
    const existingReaction = await ctx.db
      .query("userReactions")
      .withIndex("by_user_item", (q) => 
        q.eq("userId", userId).eq("itemId", args.commentId).eq("itemType", "comment")
      )
      .first();
    
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");
    
    if (existingReaction) {
      if (existingReaction.reactionType === args.reaction) {
        await ctx.db.delete(existingReaction._id);
        await ctx.db.patch(args.commentId, {
          reactions: {
            ...comment.reactions,
            [args.reaction]: Math.max(0, comment.reactions[args.reaction] - 1),
          },
        });
      } else {
        await ctx.db.patch(existingReaction._id, {
          reactionType: args.reaction,
        });
        await ctx.db.patch(args.commentId, {
          reactions: {
            ...comment.reactions,
            [existingReaction.reactionType]: Math.max(0, comment.reactions[existingReaction.reactionType] - 1),
            [args.reaction]: comment.reactions[args.reaction] + 1,
          },
        });
      }
    } else {
      await ctx.db.insert("userReactions", {
        userId,
        itemId: args.commentId,
        itemType: "comment",
        reactionType: args.reaction,
      });
      await ctx.db.patch(args.commentId, {
        reactions: {
          ...comment.reactions,
          [args.reaction]: comment.reactions[args.reaction] + 1,
        },
      });
    }
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commentId);
  },
});