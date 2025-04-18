import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="splashscreen" />
      <Stack.Screen name="loginscreen" />
      <Stack.Screen name="signupscreen" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
