# Convex Push Notifications Component

This is a Convex component that integrates with [Expo's push notification API](https://docs.expo.dev/push-notifications/overview/)
to allow sending mobile push notifications to users of your app. It will batch calls to Expo's API and handle retrying delivery.

To use this component:

- Install the code for this component:

```
npm i @convex-dev/expo-push-notifications
```

- Install the component in your Convex app:

```
// convex/convex.config.ts
import { defineApp } from "convex/server";
import pushNotifications from "@convex-dev/expo-push-notifications/component/convex.config.js";

const app = defineApp();
app.use(pushNotifications, { name: "pushNotifications" });
// other components

export default app;
```

- Instantiate the `PushNotificationsClient` in your Convex functions. `PushNotificationsClient` takes in a type parameter `UserType` that should correspond to the unique identifier you want to use when sending notifications in your app (e.g. `Id<"users">` or a branded string `type Email = string & { __isEmail: true }`).

```
// convex/example.ts
import { PushNotificationsClient } from "@convex-dev/expo-push-notifications/client";
import { Id } from "./_generated/dataModel";

const pushNotificationsClient = new PushNotificationsClient<Id<"users">>(
  components.pushNotifications,
  {
    logLevel: "DEBUG",
  }
);
```

- Get a user's push notification token following the Expo documentation [here](https://docs.expo.dev/push-notifications/push-notifications-setup/#registering-for-push-notifications), and record it using a Convex mutation:

```
// convex/example.ts
export const recordPushNotificationToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    await pushNotificationsClient.recordToken(ctx, {
      userId,
      pushToken: args.token,
    });
  },
});
```

- Use the `PushNotificationsClient` to send notifications:

```
// convex/example.ts
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
```

You can also pause and resume push notification sending for a user using the `pausePushNotifications` and `resumePushNotifications` methods.

## Troubleshooting

- To add more logging, provide `PushNotificationsClient` with a `logLevel` in the constructor:

```
const pushNotificationsClient = new PushNotificationsClient(
  components.pushNotifications,
  {
    logLevel: "DEBUG",
  }
);
```

- The push notification sender can be shutdown gracefully, and then restarted using the `shutdown` and `restart` methods.
