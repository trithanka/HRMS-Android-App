import { Leave } from "@/api/api.types";
import { getLeaveHistory } from "@/api/leave.api";
import LeaveFilter, { STATUS_OPTIONS } from "@/components/leave-filter";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/contexts/authContext";
import useDownloadFile from "@/hooks/useDownloadFile";
import {
  formatDate,
  formateDateShort,
  formattedLeaveType,
  getLastMonthDate,
  toast,
} from "@/utils/helpers";
import { FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  Divider,
  IndexPath,
  Layout,
  List,
  Text,
} from "@ui-kitten/components";
import React from "react";
import { ListRenderItemInfo, StyleSheet, View } from "react-native";

export default function LeaveHistory() {
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(
    new IndexPath(0)
  );
  const [statusSelectedIndex, setStatusSelectedIndex] =
    React.useState<IndexPath>(new IndexPath(0));
  const [visible, setVisible] = React.useState(false);
  const [range, setRange] = React.useState<{
    endDate: Date | null;
    startDate: Date | null;
  }>({
    endDate: null,
    startDate: null,
  });

  const status =
    STATUS_OPTIONS[statusSelectedIndex.row] === "Approved"
      ? "approve"
      : STATUS_OPTIONS[statusSelectedIndex.row] === "Pending"
      ? "pending"
      : STATUS_OPTIONS[statusSelectedIndex.row] === "Rejected"
      ? "reject"
      : null;

  const { downloadFile } = useDownloadFile();
  const { session } = useSession();

  const {
    isPending: isLoading,
    data,
    mutate,
  } = useMutation({
    mutationFn: getLeaveHistory,
    onSuccess(data) {
      closeModal();
      if (data?.status === "error") {
        toast(data?.message || "Something went wrong");
      }
    },
    onError(error) {
      if (error.message) {
        toast(error.message);
      }
    },
  });

  const closeModal = () => setVisible(false);
  const openModal = () => setVisible(true);

  function rangeHandler() {
    if (!range.startDate) return;
    if (!range.endDate) return;

    const startDate = formateDateShort(range.startDate);
    const endDate = formateDateShort(range.endDate);

    if (!session) return;

    mutate({
      empId: session,
      startDate,
      endDate,
      status,
    });
  }

  function lastMonthHandler() {
    if (!session) return;
    const monthDate = getLastMonthDate();
    mutate({
      empId: session,
      month: monthDate,
      status,
    });
  }

  function lastWeekHandler() {
    if (!session) return;
    mutate({
      empId: session,
      week: "week",
      status,
    });
  }

  function todayHandler() {
    if (!session) return;
    mutate({
      empId: session,
      curDate: "today",
      status,
    });
  }

  React.useEffect(() => {
    if (selectedIndex.row === 0) {
      todayHandler();
    }

    if (selectedIndex.row === 1) {
      lastWeekHandler();
    }

    if (selectedIndex.row === 2) {
      lastMonthHandler();
    }
    if (selectedIndex.row === 3) {
      openModal();
    }
  }, [selectedIndex.row, statusSelectedIndex.row]);

  React.useEffect(() => {
    rangeHandler();
  }, [range]);

  const renderItem = (info: ListRenderItemInfo<Leave>): React.ReactElement => (
    <Card
      style={styles.item}
      status={
        info.item.status === "APPROVED"
          ? "success"
          : info.item.status === "PENDING"
          ? "warning"
          : "danger"
      }
    >
      <View style={{ marginBottom: 10 }}>
        <Text category="p2">Leave Type</Text>
        <Text category="p2" style={{ fontWeight: "700" }}>
          {formattedLeaveType(info.item?.leaveType ?? "No Leave Type")}
        </Text>
      </View>

      <Divider style={{ marginBottom: 10 }} />

      <View style={{ marginBottom: 10 }}>
        <Text category="p2">Leave Reason</Text>
        <Text category="p2" style={{ fontWeight: "700" }}>
          {info.item.reason ?? "Not Specified"}
        </Text>
      </View>

      <Divider style={{ marginBottom: 10 }} />

      <View style={{ marginBottom: 10 }}>
        <Text category="p2">Leave Status</Text>
        <Text category="p2" style={{ fontWeight: "700" }}>
          {info.item.status ?? "Not Specified"}
        </Text>
      </View>

      <Divider style={{ marginBottom: 10 }} />

      <View style={{ marginBottom: 10 }}>
        <Text category="p2">Leave Duration</Text>
        <Text category="p2">
          <AntDesign name="calendar" size={14} color="black" />{" "}
          <Text category="p2" style={{ fontWeight: "700" }}>
            {formatDate(info.item?.startDate as unknown as Date) ?? ""}
          </Text>{" "}
          to{" "}
          <Text category="p2" style={{ fontWeight: "700" }}>
            {formatDate(info.item?.endDate as unknown as Date) ?? ""}
          </Text>
        </Text>
      </View>

      {info?.item?.pdfUrl && (
        <>
          <Divider style={{ marginBottom: 10 }} />
          <View style={{ marginBottom: 10 }}>
            <Text category="p2">Document</Text>
            <Button
              size="small"
              style={{
                justifyContent: "flex-start",
                marginTop: 10,
                paddingLeft: 0,
              }}
              appearance="ghost"
              accessoryLeft={
                <FontAwesome name="file-pdf-o" size={16} color="red" />
              }
              onPress={() =>
                downloadFile(
                  info?.item?.pdfUrl,
                  info?.item?.pdfUrl?.split("/")?.at(-1) ?? "leave_doc.pdf"
                )
              }
            >
              {info?.item?.pdfUrl?.split("/")?.at(-1)}
            </Button>
          </View>
        </>
      )}

      {info?.item?.rejectionReason && (
        <>
          <Divider style={{ marginBottom: 10 }} />
          <View style={{ marginBottom: 10 }}>
            <Text category="p2">Rejection Reason</Text>
            <Text category="p2" style={{ fontWeight: "700" }}>
              {info.item.rejectionReason ?? "Not Specified"}
            </Text>
          </View>
        </>
      )}
    </Card>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Layout style={styles.container}>
      <View
        style={{
          marginHorizontal: 10,
        }}
      >
        <LeaveFilter
          closeModal={closeModal}
          openModal={openModal}
          range={range}
          setRange={setRange}
          visible={visible}
          monthHandler={lastMonthHandler}
          weekHandler={lastWeekHandler}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          statusSelectedIndex={statusSelectedIndex}
          setStatusSelectedIndex={setStatusSelectedIndex}
        />
      </View>

      {data?.data?.length === 0 ? (
        <Card style={{ margin: 10 }}>
          <Text>No Data Found!</Text>
        </Card>
      ) : (
        <List
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={data?.data}
          renderItem={renderItem}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});
