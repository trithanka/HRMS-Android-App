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
      <Layout style={styles.loadingContainer} level="2">
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="2">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          <Card style={styles.card} status="primary">
            <Text category="h6" style={styles.fontBold}>
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
                <Text category="s2" style={styles.fontBold}>
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

          <Card style={styles.card} status="success">
            <Text style={styles.fontBold} category="h6">Activity In Progress</Text>

            <View style={styles.activityContainer}>
              <View>
                <Text
                  category="s1"
                  style={[styles.textCenter, styles.fontBold]}
                >
                  Office Address
                </Text>
                <Text category="p1" appearance="hint" style={styles.textCenter}>
                  {data?.coordinates?.landmark}
                </Text>
                <Text category="p2" appearance="hint" style={styles.textCenter}>
                  {data?.coordinates.lat1 ?? ""},{" "}
                  {data?.coordinates.long1 ?? ""}
                </Text>
              </View>

              <Text category="h1" style={[styles.textCenter, styles.timeText]}>
                {data?.isPunchedOut === 1
                  ? "00:00"
                  : data?.loginTime ?? "00:00"}
              </Text>
              <Text category="s1" style={styles.textCenter}>
                Time Elapsed
              </Text>
            </View>
          </Card>

          <View style={styles.punchCardsContainer}>
            <Card style={styles.punchCard} status="warning">
              <Text category="s1">Punch In</Text>
              <Text category="h5" style={styles.punchTime}>
                {data?.attendanceTime?.inTime === ""
                  ? "00:00"
                  : data?.attendanceTime?.inTime}
              </Text>
              <Text category="c1" appearance="hint">
                {data?.attendanceTime?.attendanceMarkerIn}
              </Text>
            </Card>

            <Card style={styles.punchCard} status="warning">
              <Text category="s1">Punch Out</Text>
              <Text category="h5" style={styles.punchTime}>
                {data?.attendanceTime?.outTime === ""
                  ? "00:00"
                  : data?.attendanceTime?.outTime}
              </Text>
              <Text category="c1" appearance="hint">
                {data?.attendanceTime?.attendanceMarkerOut}
              </Text>
            </Card>
          </View>

          <Card style={[styles.card, styles.notificationCard]} status="danger">
            <Text style={styles.fontBold} category="h6">Notifications</Text>

            <View style={styles.notificationList}>
              {data?.notification?.map((not, index) => (
                <Text key={index} category="p2" style={styles.notificationText}>
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
  },
  fontBold: {
    fontWeight: "700",
  },
  textCenter: {
    textAlign: "center",
  },
  status: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activityContainer: {
    gap: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  timeText: {
    marginVertical: 8,
  },
  punchCardsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  punchCard: {
    flex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
  },
  punchTime: {
    marginVertical: 8,
  },
  notificationCard: {
    minHeight: 100,
  },
  notificationList: {
    gap: 8,
    marginTop: 12,
  },
  notificationText: {
    lineHeight: 20,
  },
});
