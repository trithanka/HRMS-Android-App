import { KEYS } from "@/constants/keys";
import {
  Button,
  Card,
  Input,
  Layout,
  Modal,
  Text,
} from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@tanstack/react-query";
import { postAttendance } from "@/api/attendance.api";
import { toast } from "@/utils/helpers";
import LoadingButton from "@/components/ui/LoadingButton";

interface IPunch {
  isInside: boolean;
  isPunchedIn: 1 | 0 | undefined;
  reload: () => {};
  verifyIsInside: () => {};
}

export default function Punch({ isPunchedIn, reload, verifyIsInside }: IPunch) {
  const [visible, setVisible] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const { mutate, isPending: isPostAttendanceLoading } = useMutation({
    mutationFn: postAttendance,
    onSuccess(data) {
      if (data?.status === "error" || data?.status === "failed") {
        toast(data?.message ?? "Something went wrong");
        return;
      }

      setReason("");
      reload();

      if (data?.message) {
        toast(data?.message);
      }
    },
    onError(error) {
      if (error?.message) {
        toast(error?.message ?? "Something went wrong");
      }
    },
  });

  const deviceId = SecureStore.getItem(KEYS.DEVICE_ID);
  const punchStatus = isPunchedIn === 1 ? "Punch Out" : "Punch In";

  async function punchHandler() {
    const inside = await verifyIsInside();

    if (!inside) {
      setVisible(true);
      return;
    }

    mutate({
      event: isPunchedIn ? 1 : 0, // event - 0 for punch in, 1 for punch out
      outdoor: 1, // outdoor - 0 for indoor, 1 for outdoor
      UUID: deviceId ?? "",
      reason,
    });
  }

  async function reasonHandler() {
    if (reason.trim().length > 0) {
      setVisible(false);

      const inside = await verifyIsInside();

      mutate({
        event: isPunchedIn ? 1 : 0, // event - 0 for punch in, 1 for punch out
        outdoor: inside ? 0 : 1, // outdoor - 0 for indoor, 1 for outdoor
        UUID: deviceId ?? "",
        reason,
      });
    }
  }

  return (
    <Layout style={styles.container}>
      {isPostAttendanceLoading ? (
        <LoadingButton>Loading...</LoadingButton>
      ) : (
        <Button onPress={punchHandler}>{punchStatus}</Button>
      )}

      <Modal visible={visible} backdropStyle={styles.backdrop}>
        <Card disabled={true}>
          <Text category="h6">Reason</Text>
          <Text style={{ paddingVertical: 20 }}>
            State your reason for outdoor attendance
          </Text>
          <Input value={reason} onChangeText={(text) => setReason(text)} />

          <View style={styles.buttonGroup}>
            <Button
              size="small"
              appearance="outline"
              status="danger"
              onPress={() => setVisible(false)}
            >
              DISMISS
            </Button>
            <Button size="small" onPress={reasonHandler}>
              {punchStatus}
            </Button>
          </View>
        </Card>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
