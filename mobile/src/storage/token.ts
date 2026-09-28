import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "chronova.accessToken";

async function memoryFallback() {
  // SecureStore is unavailable on web in some setups; fall back to memory.
  return null as string | null;
}

let memoryToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return memoryToken;
  }

  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return memoryFallback();
  }
}

export async function setAccessToken(token: string): Promise<void> {
  memoryToken = token;
  if (Platform.OS === "web") {
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearAccessToken(): Promise<void> {
  memoryToken = null;
  if (Platform.OS === "web") {
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
