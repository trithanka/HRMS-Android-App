import Punch from "@/features/Punch";
import useFetchInitialData from "@/hooks/useFetchInitialData";
import Octicons from "@expo/vector-icons/Octicons";
import { Button, Card, Layout, Spinner, Text } from "@ui-kitten/components";
import { ScrollView, StyleSheet, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function AttendanceScreen() {
  const {
    data,
    isInside,
    isLoading,
    refetch,
    fetchLocation,
    verifyIsInside,
    location,
  } = useFetchInitialData();
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  if (isLoading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="1">
      <ScrollView>
        <View style={styles.innerContainer}>
          <Card status="primary">
            <Text category="s1" style={styles.fontBold}>
              {data?.personal?.name}
            </Text>
            <Text appearance="hint" category="p2">
              {date}
            </Text>

            <View style={styles.status}>
              <Octicons
                name="dot-fill"
                size={24}
                color={isInside ? "green" : "red"}
              />

              {isLoading ? (
                <Text category="c2" style={styles.fontBold}>
                  Loading Location...
                </Text>
              ) : (
                <Text category="c2" style={styles.fontBold}>
                  {isInside ? "On Location" : "Outside of Location"}
                </Text>
              )}

              <View>
                {!isInside && (
                  <Button
                    size="small"
                    appearance="ghost"
                    onPress={fetchLocation}
                  >
                    Refetch Location
                  </Button>
                )}
              </View>
            </View>
            {location?.coords.latitude && (
              <View>
                <Text category="p2" appearance="hint">
                  {location?.coords.latitude ?? ""},{" "}
                  {location?.coords.longitude ?? ""}
                </Text>
              </View>
            )}
          </Card>

          <Card status="success">
            <Text style={styles.fontBold}>Activity In Progress</Text>

            <View style={{ gap: 10, marginTop: 30 }}>
              <View>
                <Text
                  category="s2"
                  style={[styles.textCenter, styles.fontBold]}
                >
                  Office Address
                </Text>
                <Text category="p2" appearance="hint" style={styles.textCenter}>
                  {data?.coordinates?.landmark}
                </Text>
                <Text category="p2" appearance="hint" style={styles.textCenter}>
                  {data?.coordinates.lat1 ?? ""},{" "}
                  {data?.coordinates.long1 ?? ""}
                </Text>
              </View>

              <Text category="h1" style={styles.textCenter}>
                {data?.isPunchedOut === 1
                  ? "00:00"
                  : data?.loginTime ?? "00:00"}
              </Text>
              <Text category="s2" style={styles.textCenter}>
                Time Elapsed
              </Text>
            </View>
          </Card>

          <Layout style={{ flexDirection: "row", gap: 10 }}>
            <Card status="warning" style={{ flex: 1 }}>
              <Text category="p2">Punch In</Text>
              <Text category="h6">
                {data?.attendanceTime?.inTime === ""
                  ? "00:00"
                  : data?.attendanceTime?.inTime}
              </Text>
              <Text category="c2" appearance="hint">
                {data?.attendanceTime?.attendanceMarkerIn}
              </Text>
            </Card>

            <Card status="warning" style={{ flex: 1 }}>
              <Text category="p2">Punch Out</Text>
              <Text category="h6">
                {data?.attendanceTime?.outTime === ""
                  ? "00:00"
                  : data?.attendanceTime?.outTime}
              </Text>
              <Text category="c2" appearance="hint">
                {data?.attendanceTime?.attendanceMarkerOut}
              </Text>
            </Card>
          </Layout>

          <Card status="danger" style={styles.mainCard}>
            <Text style={styles.fontBold}>Notifications</Text>

            <View style={{ gap: 5 }}>
              {data?.notification?.map((not, index) => (
                <Text key={index} category="c2">
                  {not}
                </Text>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>

      <Punch
        isInside={isInside}
        isPunchedIn={data?.isPunchedIn}
        reload={refetch}
        verifyIsInside={verifyIsInside}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  innerContainer: {
    flex: 1,
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainCard: {
    flex: 1,
    minHeight: 100,
  },
  fontBold: {
    fontWeight: "700",
  },
  textCenter: {
    textAlign: "center",
  },
  status: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
