import { Button, Text, Input, View } from "tamagui";
import { Dimensions } from "react-native";
import { useConvex, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

// begin setup from https://docs.expo.dev/push-notifications/push-notifications-setup/
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}
// end setup from https://docs.expo.dev/push-notifications/push-notifications-setup/

const FRUIT_EMOJIS = ["🍎", "🍊", "🍇", "🥝", "🍉"];

export function Demo() {
  const dims = Dimensions.get("screen");
  const [name, setName] = useState("");
  const convex = useConvex();
  const [notifId, setNotifId] = useState<string | null>(null);
  const notificationState = useQuery(
    api.example.getNotificationStatus,
    notifId ? { id: notifId } : "skip"
  );
  const allNames = useQuery(api.example.getNames) ?? [];

  return (
    <View
      height={dims.height}
      width={dims.width}
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <View
        flexDirection="column"
        alignItems="center"
        gap={8}
        width="100%"
        padding={15}
      >
        <Text>
          In a real app, you'd probably sign in, but for a demo, choose a name
          to associate with your account.
        </Text>
        <Input
          width={"100%"}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        <Button
          onPress={async () => {
            const token = await registerForPushNotificationsAsync().catch(
              (error: any) => {
                alert(`Error registering for push notifications: ${error}`);
                return undefined;
              }
            );
            if (token !== undefined) {
              await convex.mutation(api.example.recordPushNotificationToken, {
                name,
                token,
              });
            }
          }}
        >
          <Text>Set up push notifications</Text>
        </Button>
      </View>
      <View flexDirection="column" alignItems="center" gap={8}>
        <Text>Send a fruit notification!</Text>
        {allNames.map((n) => (
          <View key={n} flexDirection="row" alignItems="center" gap={8}>
            <Text>{n}</Text>
            {FRUIT_EMOJIS.map((emoji, idx) => (
              <Button
                key={idx}
                onPress={() => {
                  convex
                    .mutation(api.example.sendPushNotification, {
                      to: n,
                      title: `${emoji} from ${name}`,
                    })
                    .then(setNotifId);
                }}
              >
                <Text>{emoji}</Text>
              </Button>
            ))}
          </View>
        ))}
        {notificationState && (
          <Text>Notification status: {notificationState}</Text>
        )}
      </View>
    </View>
  );
}
