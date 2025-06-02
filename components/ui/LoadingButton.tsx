import * as React from "react";
import { Button, ButtonProps, Spinner } from "@ui-kitten/components";
import { ImageProps, StyleSheet, View } from "react-native";

const LoadingIndicator = (props: ImageProps): React.ReactElement => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" />
  </View>
);

export default function LoadingButton(props: ButtonProps) {
  return (
    <Button
      style={{ width: "100%" }}
      appearance="outline"
      accessoryLeft={<LoadingIndicator />}
    >
      {props.children}
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});
