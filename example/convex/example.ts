import { components, mutation, query } from "./_generated/server.js";
import { PushNotificationsClient } from "../../src/client/index.js";
import { ConvexError, v } from "convex/values";

const pushNotificationsClient = new PushNotificationsClient(
  components.pushNotifications,
  {
    logLevel: "DEBUG",
  }
);

export const recordPushNotificationToken = mutation({
  args: { token: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    if (existingUser) {
      throw new ConvexError("User with that name already exists!");
    }
    await ctx.db.insert("users", { name: args.name });
    await pushNotificationsClient.recordToken(ctx, {
      userId: args.name,
      pushToken: args.token,
    });
  },
});

export const sendPushNotification = mutation({
  args: { title: v.string(), to: v.string() },
  handler: async (ctx, args) => {
    await pushNotificationsClient.sendPushNotification(ctx, {
      userId: args.to,
      notification: {
        title: args.title,
      },
    });
  },
});

export const getNames = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const names = users.map((user) => user.name);
    return names;
  },
});
