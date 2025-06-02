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
import { Image, Platform, StyleSheet, Dimensions } from "react-native";

// Using require for image to ensure it works across all platforms
const DefaultImage = require("../assets/images/cog_logo.png");

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;
const LOGO_WIDTH = Math.min(screenWidth * 0.8, 300); // 80% of screen width, max 300px

// Generate UUID only on client-side to avoid SSR issues
const useUUID = () => {
  const [uuid, setUUID] = React.useState("");

  React.useEffect(() => {
    const generateUUID = async () => {
      const newUUID = await Crypto.randomUUID();
      setUUID(newUUID);
    };
    generateUUID();
  }, []);

  return uuid;
};

export default function SignIn() {
  const [empId, setEmpId] = React.useState("");
  const uuid = useUUID();
  const [imageSize, setImageSize] = React.useState({ width: LOGO_WIDTH, height: LOGO_WIDTH });

  React.useEffect(() => {
    // Get the original image dimensions to calculate aspect ratio
    Image.getSize(Image.resolveAssetSource(DefaultImage).uri, (width, height) => {
      const aspectRatio = height / width;
      setImageSize({
        width: LOGO_WIDTH,
        height: LOGO_WIDTH * aspectRatio
      });
    });
  }, []);

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
    <Layout style={styles.container} level='4'>
      <Image 
        style={[styles.tinyLogo, imageSize]} 
        source={DefaultImage}
        resizeMode="contain"
      />

      <Input
        style={styles.input}
        placeholder="Enter Employee ID"
        value={empId}
        onChangeText={(nextValue) => setEmpId(nextValue)}
        size="large"
      />
      <Input
        style={styles.input}
        placeholder="Enter your Employee Id"
        disabled
        value={deviceId ?? uuid}
        size="large"
      />
      {isPending ? (
        <LoadingButton>Signing In</LoadingButton>
      ) : (
        <Button
          style={styles.button}
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
          }}
          size="large"
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
    padding: 20,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    marginBottom: 20,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    width: '100%',
    maxWidth: 400,
  }
});
