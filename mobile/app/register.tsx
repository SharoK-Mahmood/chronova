import { Link, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BrandLogo } from "@/src/components/BrandLogo";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/context/AuthContext";
import { env } from "@/src/config/env";
import { ApiClientError } from "@/src/lib/api";
import { colors } from "@/src/theme/colors";

export default function RegisterScreen() {
  const { register, loginWithGoogle } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    setError(null);
    try {
      await register(
        email.trim(),
        password,
        firstName.trim(),
        lastName.trim(),
      );
      router.replace("/account");
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Could not create your account. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.replace("/account");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google Sign-In failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    password.length >= 8;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <BrandLogo height={36} variant="light" style={styles.logo} />
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Save addresses, complete purchases, and track your orders.
        </Text>
        <TextInput
          placeholder="First name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="Last name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry
          autoComplete="new-password"
          placeholder="Password (min 8 characters)"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          label={busy ? "Creating…" : "Create account"}
          disabled={busy || !canSubmit}
          onPress={() => void onSubmit()}
        />
        {env.googleClientId ? (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            <Button
              label={busy ? "Opening Google…" : "Continue with Google"}
              variant="secondary"
              disabled={busy}
              onPress={() => void onGoogle()}
            />
          </>
        ) : null}
        <Link href="/login" asChild>
          <Pressable style={styles.linkWrap}>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
  },
  logo: {
    alignSelf: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  linkWrap: {
    alignItems: "center",
    paddingVertical: 6,
  },
  link: {
    color: colors.accent,
    fontWeight: "600",
  },
});
