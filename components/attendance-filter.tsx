import {
  Card,
  IndexPath,
  Layout,
  Modal,
  RangeCalendar,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
  closeModal: () => void;
  openModal: () => void;
  range: Object;
  setRange: any;
  monthHandler: () => void;
  selectedIndex: any;
  setSelectedIndex: any;
}

const OPTIONS = ["Today", "Last Week", "Last Month", "Custom Range"];

export const AttendanceFilter = (props: Props): React.ReactElement => {
  const displayValue = OPTIONS[props.selectedIndex.row];

  const renderOption = (title: string): React.ReactElement => (
    <SelectItem title={title} />
  );

  return (
    <Layout style={styles.container} level="1">
      <Select
        // style={styles.select}
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

      <Modal
        visible={props.visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={props.closeModal}
      >
        <Card disabled={true} style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <View style={{ paddingVertical: 20 }}>
              <Text style={styles.text}>Custom Date</Text>
              <RangeCalendar
                range={props.range}
                onSelect={(nextRange) => props.setRange(nextRange)}
              />
            </View>
          </View>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
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

export default AttendanceFilter;
