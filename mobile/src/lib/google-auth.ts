import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { env } from "@/src/config/env";

WebBrowser.maybeCompleteAuthSession();

/**
 * Opens the website Google Sign-In page and captures the ID token via deep link.
 * Uses Linking.createURL so Expo Go (exp://) and production (chronova://) both work.
 */
export async function promptGoogleCredential(): Promise<string> {
  if (!env.googleClientId) {
    throw new Error(
      "Google Sign-In is not configured. Set EXPO_PUBLIC_GOOGLE_CLIENT_ID.",
    );
  }

  const returnUrl = Linking.createURL("auth");
  const bridgeUrl =
    `${env.webUrl.replace(/\/$/, "")}/auth/google` +
    `?mobile_return=${encodeURIComponent(returnUrl)}`;

  const result = await WebBrowser.openAuthSessionAsync(bridgeUrl, returnUrl);

  if (result.type !== "success" || !("url" in result) || !result.url) {
    throw new Error("Google Sign-In was cancelled.");
  }

  const parsed = Linking.parse(result.url);
  const credentialParam = parsed.queryParams?.credential;
  const credential =
    typeof credentialParam === "string"
      ? credentialParam
      : Array.isArray(credentialParam)
        ? credentialParam[0]
        : null;

  if (!credential) {
    throw new Error("Google Sign-In did not return a credential.");
  }

  return credential;
}
