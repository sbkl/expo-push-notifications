import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const notificationFields = {
  title: v.string(),
  body: v.optional(v.string()),
  sound: v.optional(v.string()),
  data: v.optional(v.any()),
};

const _notificationFieldsObj = v.object(notificationFields);
export type NotificationFields = Infer<typeof _notificationFieldsObj>;

export const notificationState = v.union(
  v.literal("awaiting_delivery"),
  v.literal("in_progress"),
  v.literal("delivered"),
  v.literal("needs_retry"),
  v.literal("maybe_delivered"),
  v.literal("failed")
);

export default defineSchema({
  notifications: defineTable({
    token: v.string(),
    metadata: v.object(notificationFields),
    state: notificationState,
    numPreviousFailures: v.number(),
  })
    .index("token", ["token"])
    .index("state", ["state"]),
  pushTokens: defineTable({
    userId: v.string(),
    token: v.string(),
    notificationsPaused: v.optional(v.boolean()),
  }).index("userId", ["userId"]),
  senders: defineTable({
    jobId: v.id("_scheduled_functions"),
    checkJobId: v.id("_scheduled_functions"),
  }),
  senderCoordinator: defineTable({
    jobId: v.id("_scheduled_functions"),
  }),
  config: defineTable({
    state: v.union(v.literal("running"), v.literal("shutting_down")),
  }),
});
