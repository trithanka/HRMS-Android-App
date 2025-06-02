import { fetchProfile } from "@/api/profile.api";
import { QUERY_KEY } from "@/constants/keys";
import { useSession } from "@/contexts/authContext";
import { formatDate } from "@/utils/helpers";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Layout, Spinner, Text } from "@ui-kitten/components";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { session, signOut } = useSession();
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEY.PROFILE],
    queryFn: () => fetchProfile(session ?? ""),
  });

  const handleSignOut = () => {
    signOut();
    router.replace("/sign-in");
  };

  if (isPending) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Spinner />
      </Layout>
    );
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <Layout style={styles.container}>
        <View style={styles.main}>
          <View style={styles.profileContainer}>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
              }}
            />
            <Text category="h6">{data?.data?.Name}</Text>
            <Text style={styles.groupSubtitle}>{data?.data?.Designation}</Text>
            <Text style={styles.groupSubtitle}>{session ?? ""}</Text>
          </View>

          <View style={styles.profileList}>
            <Divider />

            <View>
              <Text style={styles.groupHeader}>Department</Text>
              <Text style={styles.groupSubtitle}>{data?.data?.Department}</Text>
            </View>

            <Divider />

            <View>
              <Text style={styles.groupHeader}>Email</Text>
              <Text style={styles.groupSubtitle}>
                {data?.data["Email Id"] ?? ""}
              </Text>
            </View>

            <Divider />

            <View>
              <Text style={styles.groupHeader}>Gender</Text>
              <Text style={styles.groupSubtitle}>{data?.data?.Gender}</Text>
            </View>

            <Divider />

            <View>
              <Text style={styles.groupHeader}>Date of Birth</Text>
              <Text style={styles.groupSubtitle}>
                {formatDate(data?.data["Date of Birth"])}
              </Text>
            </View>

            <Divider />

            <View>
              <Text style={styles.groupHeader}>Joining Date</Text>
              <Text style={styles.groupSubtitle}>
                {formatDate(data?.data["Joining Date"])}
              </Text>
            </View>

            <Divider />

            <View>
              <Text style={styles.groupHeader}>Address</Text>
              <Text style={styles.groupSubtitle}>
                {data?.data["Address Line 1"]}, {data?.data?.City}
              </Text>
            </View>

            <Divider />
          </View>
        </View>

        <Button
          onPress={handleSignOut}
          status="danger"
          accessoryRight={props => <MaterialIcons name="logout" size={24} color="white" />}
          style={styles.logoutButton}
        >
          Sign Out
        </Button>
      </Layout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  main: {
    flex: 1,
  },
  tinyLogo: {
    width: 90,
    height: 90,
    borderRadius: 100,
    marginBottom: 20,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  profileList: {
    gap: 10,
    marginVertical: 30,
  },
  groupHeader: {
    fontWeight: "700",
  },
  groupSubtitle: {
    color: "grey",
  },
  logoutButton: {
    marginVertical: 20,
  },
});
