import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
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
    reactions: v.object({
      like: v.number(),
      smile: v.number(),
      heart: v.number(),
      celebrate: v.number(),
    }),
  }),

  news: defineTable({
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
    reactions: v.object({
      like: v.number(),
      smile: v.number(),
      heart: v.number(),
      celebrate: v.number(),
    }),
  }),

  comments: defineTable({
    itemId: v.string(),
    itemType: v.union(v.literal("event"), v.literal("news")),
    author: v.string(),
    text: v.string(),
    dateISO: v.string(),
    reactions: v.object({
      like: v.number(),
      smile: v.number(),
      heart: v.number(),
      celebrate: v.number(),
    }),
  }).index("by_item", ["itemType", "itemId"]),

  userReactions: defineTable({
    userId: v.string(),
    itemId: v.string(),
    itemType: v.union(v.literal("event"), v.literal("news"), v.literal("comment")),
    reactionType: v.union(v.literal("like"), v.literal("smile"), v.literal("heart"), v.literal("celebrate")),
  }).index("by_user_item", ["userId", "itemId", "itemType"]),

  families: defineTable({
    name: v.string(),
    imageUrl: v.optional(v.string()),
  }),

  familyNodes: defineTable({
    familyId: v.id("families"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    birthYear: v.optional(v.number()),
    note: v.optional(v.string()),
    parentId: v.optional(v.id("familyNodes")),
    fatherId: v.optional(v.id("familyNodes")),
    motherId: v.optional(v.id("familyNodes")),
  }).index("by_family", ["familyId"])
    .index("by_parent", ["parentId"])
    .index("by_father", ["fatherId"])
    .index("by_mother", ["motherId"]),

  socialLinks: defineTable({
    name: v.string(),
    url: v.string(),
    icon: v.string(),
  }),
});