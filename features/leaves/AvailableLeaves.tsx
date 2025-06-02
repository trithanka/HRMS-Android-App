import { Card, Divider, Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

export default function AvailableLeaves({ data }: any) {
  return (
    <Layout style={styles.leaveContainer}>
      <Text style={styles.title}>Available Leaves</Text>
      <Layout style={styles.cardContainer}>
        <Layout level="3">
          <Card>
            <Text category="c2">Casual Leave</Text>
            <Text category="h6">{data?.leaves?.casualLeave ?? ""} Days</Text>
          </Card>
        </Layout>
        <Layout level="2">
          <Card>
            <Text category="c2">Medial Leave</Text>
            <Text category="h6">{data?.leaves?.sickLeave ?? ""} Days</Text>
          </Card>
        </Layout>
        <Layout level="1">
          <Card>
            <Text category="c2">Parental Leave</Text>
            <Text category="h6">{data?.leaves?.parentalLeave ?? ""} Days</Text>
          </Card>
        </Layout>
      </Layout>
      <Divider />
    </Layout>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  leaveContainer: {
    gap: 10,
    paddingTop: 20,
  },
  title: {
    fontWeight: "700",
  },
});
