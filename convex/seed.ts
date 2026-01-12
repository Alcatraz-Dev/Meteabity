import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    // Clear existing data
    const existingEvents = await ctx.db.query("events").collect();
    const existingNews = await ctx.db.query("news").collect();
    const existingComments = await ctx.db.query("comments").collect();
    const existingFamilies = await ctx.db.query("families").collect();
    const existingNodes = await ctx.db.query("familyNodes").collect();

    for (const event of existingEvents) {
      await ctx.db.delete(event._id);
    }
    for (const news of existingNews) {
      await ctx.db.delete(news._id);
    }
    for (const comment of existingComments) {
      await ctx.db.delete(comment._id);
    }
    for (const node of existingNodes) {
      await ctx.db.delete(node._id);
    }
    for (const family of existingFamilies) {
      await ctx.db.delete(family._id);
    }

    // Seed Events
    const event1 = await ctx.db.insert("events", {
      title: "Aunt Maria's birthday dinner",
      dateISO: "2026-02-05",
      location: "Downtown Bistro",
      kind: "Birthday",
      notes: "RSVP by Jan 28",
      reactions: { like: 3, smile: 1, heart: 2, celebrate: 0 },
      media: {
        type: "image",
        url: "./placeholder.svg",
        alt: "Dinner table",
      },
    });

    const event2 = await ctx.db.insert("events", {
      title: "Family reunion planning call",
      dateISO: "2026-01-20",
      location: "Video call",
      kind: "Reunion",
      notes: "Pick dates + budget",
      reactions: { like: 2, smile: 0, heart: 0, celebrate: 1 },
      media: {
        type: "video",
        url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
    });

    const event3 = await ctx.db.insert("events", {
      title: "Spring picnic",
      dateISO: "2026-04-11",
      location: "Riverside Park",
      kind: "Other",
      reactions: { like: 0, smile: 2, heart: 0, celebrate: 0 },
      media: {
        type: "image",
        url: "./placeholder.svg",
        alt: "Park picnic",
      },
    });

    // Seed News
    const news1 = await ctx.db.insert("news", {
      title: "Cousin Jay got a new job",
      dateISO: "2026-01-07",
      summary: "Jay starts at a new role next month. Send congrats!",
      tags: ["Milestone"],
      reactions: { like: 5, smile: 3, heart: 1, celebrate: 4 },
      media: {
        type: "image",
        url: "./placeholder.svg",
        alt: "Celebration",
      },
    });

    const news2 = await ctx.db.insert("news", {
      title: "Reunion poll is live",
      dateISO: "2026-01-03",
      summary: "Vote on locations and weekends so we can book early.",
      tags: ["Reminder"],
      reactions: { like: 2, smile: 1, heart: 0, celebrate: 1 },
      media: {
        type: "video",
        url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      },
    });

    const news3 = await ctx.db.insert("news", {
      title: "Photo share folder created",
      dateISO: "2025-12-26",
      summary: "Drop your favorite holiday pics so we can print a mini album.",
      tags: ["Update"],
      reactions: { like: 1, smile: 0, heart: 2, celebrate: 0 },
      media: {
        type: "image",
        url: "./placeholder.svg",
        alt: "Photo album",
      },
    });

    // Seed Comments
    await ctx.db.insert("comments", {
      itemId: event1,
      itemType: "event",
      author: "Sam",
      text: "I'm in!",
      dateISO: "2026-01-08",
      reactions: { like: 1, smile: 0, heart: 0, celebrate: 0 },
    });

    await ctx.db.insert("comments", {
      itemId: news1,
      itemType: "news",
      author: "Jordan",
      text: "Congrats Jay!",
      dateISO: "2026-01-07",
      reactions: { like: 2, smile: 1, heart: 0, celebrate: 0 },
    });

    // Seed Families
    const leeFamily = await ctx.db.insert("families", {
      name: "Lee Family",
      imageUrl: "./placeholder.svg",
    });

    const smithFamily = await ctx.db.insert("families", {
      name: "Smith Family",
      imageUrl: "./placeholder.svg",
    });

    // Seed Lee Family Tree
    const jordan = await ctx.db.insert("familyNodes", {
      familyId: leeFamily,
      name: "Jordan Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 1954,
      note: "Family historian",
    });

    const sam = await ctx.db.insert("familyNodes", {
      familyId: leeFamily,
      name: "Sam Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 1978,
      parentId: jordan,
    });

    const morgan = await ctx.db.insert("familyNodes", {
      familyId: leeFamily,
      name: "Morgan Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 1981,
      parentId: jordan,
    });

    await ctx.db.insert("familyNodes", {
      familyId: leeFamily,
      name: "Avery Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 2006,
      parentId: sam,
    });

    await ctx.db.insert("familyNodes", {
      familyId: leeFamily,
      name: "Riley Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 2009,
      parentId: sam,
    });

    await ctx.db.insert("familyNodes", {
      familyId: leeFamily,
      name: "Casey Lee",
      imageUrl: "./placeholder.svg",
      birthYear: 2014,
      parentId: morgan,
    });

    // Seed Smith Family Tree
    const john = await ctx.db.insert("familyNodes", {
      familyId: smithFamily,
      name: "John Smith",
      imageUrl: "./placeholder.svg",
      birthYear: 1960,
    });

    await ctx.db.insert("familyNodes", {
      familyId: smithFamily,
      name: "Alice Smith",
      imageUrl: "./placeholder.svg",
      birthYear: 1985,
      parentId: john,
    });

    return "Data seeded successfully!";
  },
});