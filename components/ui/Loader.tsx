import { Layout, Spinner } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

export default function Loader() {
  return (
    <Layout style={styles.container}>
      <Spinner />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
