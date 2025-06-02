import { Attendance } from "@/api/api.types";
import { fetchAttendance } from "@/api/attendance.api";
import AttendanceFilter from "@/components/attendance-filter";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/contexts/authContext";
import { formateDateShort, getLastMonthDate } from "@/utils/helpers";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  IndexPath,
  Layout,
  List,
  Text,
} from "@ui-kitten/components";
import React from "react";
import { ListRenderItemInfo, StyleSheet, View } from "react-native";

export default function AttendanceHistory() {
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(
    new IndexPath(0)
  );

  const [visible, setVisible] = React.useState(false);
  const [range, setRange] = React.useState<{
    endDate: Date | null;
    startDate: Date | null;
  }>({
    endDate: null,
    startDate: null,
  });

  // const { isLoading, data, refetch } = useFetchAttendance();
  const { session } = useSession();
  const { isPending, data, mutate } = useMutation({
    mutationFn: fetchAttendance,
    onSuccess() {
      closeModal();
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
      empCode: session,
      startDate,
      endDate,
    });
  }

  function todayHandler() {
    if (!session) return;

    mutate({
      empCode: session,
      curDate: "today",
    });
  }

  function lastMonthHandler() {
    if (!session) return;
    const monthDate = getLastMonthDate();
    mutate({
      empCode: session,
      month: monthDate,
    });
  }

  function lastWeekHandler() {
    if (!session) return;
    const monthDate = getLastMonthDate();
    mutate({
      empCode: session,
      week: "lastweek",
    });
  }

  React.useEffect(() => {
    rangeHandler();
  }, [range]);

  React.useEffect(() => {
    if (!session) return;
    mutate({
      empCode: session,
    });
  }, []);

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
  }, [selectedIndex.row]);

  const renderItemHeader = (
    headerProps: any,
    info: ListRenderItemInfo<Attendance>
  ) => {
    return (
      <View {...headerProps}>
        <Text style={{ fontWeight: "500" }}>{info.item.location}</Text>
      </View>
    );
  };

  const renderItem = (
    info: ListRenderItemInfo<Attendance>
  ): React.ReactElement => (
    <Card
      style={styles.item}
      status="basic"
      header={(headerProps) => renderItemHeader(headerProps, info)}
    >
      <Text category="p2">
        Punch In:{" "}
        <Text style={{ fontWeight: "700" }}>
          {(info.item?.punchIn || info.item.punchInOutdoor) ?? "Invalid Time"}
        </Text>
      </Text>

      <Text category="p2">
        Punch Out:{" "}
        <Text style={{ fontWeight: "700" }}>
          {(info.item?.punchOut || info.item.punchOutOutdoor) ?? "Invalid Time"}
        </Text>
      </Text>

      <Text category="p2">Date: {info.item.attendanceDate}</Text>
    </Card>
  );

  if (isPending) {
    return <Loader />;
  }

  return (
    <Layout style={styles.container}>
      <AttendanceFilter
        closeModal={closeModal}
        openModal={openModal}
        range={range}
        setRange={setRange}
        visible={visible}
        monthHandler={lastMonthHandler}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      {data?.data?.length === 0 ? (
        <Card style={{ marginHorizontal: 10 }}>
          <Text>No Data Found</Text>
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
