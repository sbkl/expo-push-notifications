import { mutation, query } from "./_generated/server.js";
import { PushNotifications } from "@convex-dev/expo-push-notifications";
import { ConvexError, v } from "convex/values";
import { components } from "./_generated/api.js";

const pushNotifications = new PushNotifications(components.pushNotifications);

/**
 * Function to record an Expo push notification token for a given user.
 *
 * See its usage in `app/Demo.tsx`
 */
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
    const userId = await ctx.db.insert("users", { name: args.name });
    // Record push notification tokens
    await pushNotifications.recordToken(ctx, {
      userId,
      pushToken: args.token,
    });
    // Query the push notification status for a user
    const status = await pushNotifications.getStatusForUser(ctx, {
      userId,
    });
    if (!status.hasToken) {
      throw new ConvexError("Failed to record token");
    }
  },
});

export const sendPushNotification = mutation({
  args: { title: v.string(), to: v.id("users") },
  handler: async (ctx, args) => {
    // Sending a notification
    return pushNotifications.sendPushNotification(ctx, {
      userId: args.to,
      notification: {
        title: args.title,
      },
    });
  },
});

export const getNotificationStatus = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const notification = await pushNotifications.getNotification(ctx, args);
    return notification?.state;
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((user) => ({
      _id: user._id,
      name: user.name,
    }));
  },
});
