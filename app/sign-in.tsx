import { authenticateEmployee } from "@/api/auth";
import LoadingButton from "@/components/ui/LoadingButton";
import { KEYS } from "@/constants/keys";
import { useSession } from "@/contexts/authContext";
import { toast } from "@/utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, Layout, Text } from "@ui-kitten/components";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Image, StyleSheet } from "react-native";

import DefaultImage from "../assets/images/icon.png";

const LOGO_IMAGE = Image.resolveAssetSource(DefaultImage).uri;

const uuid = Crypto.randomUUID();
export default function SignIn() {
  const [empId, setEmpId] = React.useState("");

  const { signIn } = useSession();
  const router = useRouter();

  const deviceId = SecureStore.getItem(KEYS.DEVICE_ID);
  const deviceName = `${Device.deviceName} (${Device.modelName})`;

  const { mutate, isPending } = useMutation({
    mutationFn: authenticateEmployee,
    onSuccess(data, variables, context) {
      if (data?.status === "error") {
        toast(data?.message);
        return;
      }

      signIn(variables.UUID, variables.empID?.toUpperCase());
      router.replace("/");
    },
    onError(error) {
      toast(error?.message ?? "Something went wrong");
    },
  });

  return (
    <Layout style={styles.container}>
      <Image style={styles.tinyLogo} source={{ uri: LOGO_IMAGE }} />

      <Input
        placeholder="Enter Employee ID"
        value={empId}
        onChangeText={(nextValue) => setEmpId(nextValue)}
      />
      <Input
        placeholder="Enter your Employee Id"
        disabled
        value={deviceId ?? uuid}
      />
      {isPending ? (
        <LoadingButton>Signing In</LoadingButton>
      ) : (
        <Button
          style={{ width: "100%" }}
          onPress={() => {
            if (!empId) {
              toast("No Employee ID");
              return;
            }
            mutate({
              deviceName,
              empID: empId,
              UUID: deviceId ?? uuid,
            });
            // if (!empId) return;
            // signIn(deviceId ?? uuid, empId);
            // router.replace("/");
          }}
        >
          Sign In
        </Button>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 150,
    height: 150,
  },
});
