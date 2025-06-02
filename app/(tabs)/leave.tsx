import { fetchAvailableLeaves, fetchLeavesHeader } from "@/api/leave.api";
import { QUERY_KEY } from "@/constants/keys";
import { useSession } from "@/contexts/authContext";
import ApplyLeave from "@/features/leaves/ApplyLeave";
import AvailableLeaves from "@/features/leaves/AvailableLeaves";
import { useQuery } from "@tanstack/react-query";
import { Card, Divider, Layout, Spinner, Text } from "@ui-kitten/components";
import { ScrollView, StyleSheet } from "react-native";

export default function LeaveScreen() {
  const { session } = useSession();

  const { isPending, data } = useQuery({
    queryKey: [QUERY_KEY.AVAILABLE_LEAVES],
    queryFn: () => fetchAvailableLeaves(session ?? ""),
  });

  const { isPending: isLeaveHeaderPending, data: leaveHeaderData } = useQuery({
    queryFn: fetchLeavesHeader,
    queryKey: [QUERY_KEY.LEAVE_HEADER],
  });

  if (isPending || isLeaveHeaderPending) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <ScrollView>
        <AvailableLeaves data={data} />
        <ApplyLeave
          reasons={leaveHeaderData?.leavesHeader}
          temporaryOversights={leaveHeaderData?.leavesResponsibility}
        />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
