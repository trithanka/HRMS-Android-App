import { Button, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="blue" />
      <Text category="h6">Please hold on...</Text>
      <Text category="h6">we are fetching your session id..</Text>

      <View style={{ marginVertical: 20 }}>
        <Text category="p1" appearance="hint" style={{ textAlign: "center" }}>
          If loading takes too long,
        </Text>
        <Text category="p1" appearance="hint" style={{ textAlign: "center" }}>
          Click the sign-in button to continue.
        </Text>
      </View>
      <Button onPress={() => router.replace("sign-in")}>Sign In</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
