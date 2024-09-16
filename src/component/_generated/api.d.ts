/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as functions from "../functions.js";
import type * as helpers from "../helpers.js";
import type * as internal_ from "../internal.js";
import type * as public from "../public.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  functions: typeof functions;
  helpers: typeof helpers;
  internal: typeof internal_;
  public: typeof public;
}>;
export type Mounts = {
  public: {
    pauseNotificationsForUser: FunctionReference<
      "mutation",
      "public",
      { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
      null
    >;
    recordPushNotificationToken: FunctionReference<
      "mutation",
      "public",
      {
        logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
        pushToken: string;
        userId: string;
      },
      null
    >;
    removePushNotificationToken: FunctionReference<
      "mutation",
      "public",
      { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
      null
    >;
    restart: FunctionReference<
      "mutation",
      "public",
      { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
      boolean
    >;
    sendPushNotification: FunctionReference<
      "mutation",
      "public",
      {
        logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
        notification: {
          body?: string;
          data?: any;
          sound?: string;
          title: string;
        };
        userId: string;
      },
      null
    >;
    shutdown: FunctionReference<
      "mutation",
      "public",
      { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" },
      { data?: any; message: string }
    >;
    unpauseNotificationsForUser: FunctionReference<
      "mutation",
      "public",
      { logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR"; userId: string },
      null
    >;
  };
};
// For now fullApiWithMounts is only fullApi which provides
// jump-to-definition in component client code.
// Use Mounts for the same type without the inference.
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
