import { SessionProvider } from "@/contexts/authContext";
import * as eva from "@eva-design/eva";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider } from "@ui-kitten/components";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SessionProvider>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          </Stack>
        </ApplicationProvider>
      </QueryClientProvider>
      <StatusBar />
    </SessionProvider>
  );
}
