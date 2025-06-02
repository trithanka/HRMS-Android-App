import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  Layout,
  Modal,
  Text,
  RangeCalendar,
  SelectItem,
  Select,
  IndexPath,
} from "@ui-kitten/components";

interface Props {
  visible: boolean;
  closeModal: () => void;
  openModal: () => void;
  range: Object;
  setRange: any;
  monthHandler: () => void;
  weekHandler: () => void;
  selectedIndex: any;
  setSelectedIndex: any;
  statusSelectedIndex: any;
  setStatusSelectedIndex: any;
}

const OPTIONS = ["Today", "Last Week", "Last Month", "Custom Range"];
export const STATUS_OPTIONS = ["All", "Approved", "Pending", "Rejected"];

export const LeaveFilter = (props: Props): React.ReactElement => {
  const displayValue = OPTIONS[props.selectedIndex.row];
  const statusDisplayValue = STATUS_OPTIONS[props.statusSelectedIndex.row];

  const renderOption = (title: string): React.ReactElement => (
    <SelectItem title={title} />
  );

  return (
    <Layout style={styles.container} level="1">
      <Select
        style={{ flex: 1 }}
        placeholder="Default"
        value={displayValue}
        selectedIndex={props.selectedIndex}
        onSelect={(index: IndexPath) => {
          props.setSelectedIndex(index);
          if (index.row === 3) props.openModal();
        }}
      >
        {OPTIONS.map(renderOption)}
      </Select>

      <Select
        style={{ flex: 1 }}
        placeholder="Default"
        value={statusDisplayValue}
        selectedIndex={props.statusSelectedIndex}
        onSelect={(index: IndexPath) => {
          props.setStatusSelectedIndex(index);
        }}
      >
        {STATUS_OPTIONS.map(renderOption)}
      </Select>

      <Modal
        visible={props.visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={props.closeModal}
      >
        <Card disabled={true} style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <Text style={styles.text}>Custom Date</Text>
            <RangeCalendar
              range={props.range}
              onSelect={(nextRange) => props.setRange(nextRange)}
            />
          </View>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    minWidth: "80%",
  },
  modalBody: {
    marginTop: 20,
  },
  text: {
    fontWeight: "700",
    paddingBottom: 10,
  },
});

export default LeaveFilter;
