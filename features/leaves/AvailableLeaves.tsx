import { Card, Divider, Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

export default function AvailableLeaves({ data }: any) {
  return (
    <Layout style={styles.leaveContainer}>
      <Text style={styles.title}>Available Leaves</Text>
      <Layout style={styles.cardContainer}>
        <Layout style={styles.leftCard}>
          <Card style={styles.casualCard}>
            <Text category="c2">Casual Leave</Text>
            <Text category="h6">{data?.leaves?.casualLeave ?? ""} Days</Text>
          </Card>
        </Layout>
        <Layout style={styles.rightCard}>
          <Card style={styles.medicalCard}>
            <Text category="c2">Medical Leave</Text>
            <Text category="h6">{data?.leaves?.sickLeave ?? ""} Days</Text>
          </Card>
        </Layout>
        {/* <Layout level="1"> */}
          {/* <Card>
            <Text category="c2">Parental Leave</Text>
            <Text category="h6">{data?.leaves?.parentalLeave ?? ""} Days</Text>
          </Card> */}
        {/* </Layout> */}
      </Layout>
      <Divider />
    </Layout>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    paddingBottom: 20,
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  leftCard: {
    flex: 1,
    marginRight: 5,
    borderRadius: 8,
  },
  rightCard: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 8,
  },
  casualCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#90CAF9',
    borderWidth: 1,
  },
  medicalCard: {
    backgroundColor: '#F3E5F5',
    borderColor: '#CE93D8',
    borderWidth: 1,
  },
  leaveContainer: {
    gap: 10,
    paddingTop: 20,
  },
  title: {
    fontWeight: "700",
  },
});
