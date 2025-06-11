import { applyLeave } from "@/api/leave.api";
import DocumentFilePicker from "@/components/DocumentFilePicker";
import LoadingButton from "@/components/ui/LoadingButton";
import { useSession } from "@/contexts/authContext";
import { toast } from "@/utils/helpers";
import { Picker } from "@react-native-picker/picker";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  CalendarRange,
  Datepicker,
  Divider,
  Input,
  Layout,
  Radio,
  RadioGroup,
  RangeDatepicker,
  Text,
} from "@ui-kitten/components";
import * as React from "react";
import { StyleSheet, View } from "react-native";

const LEAVE_TYPE_INDEX = {
  0: "CL",
  1: "ML",
  2: "RH",
  3: "PL",
};

const DAY_TYPE_INDEX = {
  0: "fullDay",
  1: "halfDay",
};

interface IApplyLeave {
  reasons: { id: number; header: string }[];
  temporaryOversights: { value: number; label: string }[];
}

export default function ApplyLeave({
  reasons,
  temporaryOversights,
}: IApplyLeave) {
  // form states
  const [leaveType, setLeaveType] = React.useState(0);
  const [dayType, setDayType] = React.useState(0);
  const [range, setRange] = React.useState<CalendarRange<Date>>({});
  const [reasonForLeave, setReasonForLeave] = React.useState<string>(
    String(reasons[0].id)
  );
  const [specifyReason, setSpecifyReason] = React.useState("");
  const [tempOversight, setTempOversight] = React.useState(
    temporaryOversights[0].value
  );
  const [file, setFile] = React.useState<any>();
  const [date, setDate] = React.useState<Date>();

  const { session } = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: applyLeave,
    onSuccess(data) {
      if (data?.status === "error") {
        toast(data?.message ?? "Success");
        return;
      }
      toast(data?.message);

      reset();
    },
    onError(error) {
      toast(error?.message);
    },
  });

  function validation() {
    if (reasonForLeave) {
      toast("Please Select reason for leave");
      return;
    }
  }

  function reset() {
    setRange({});
    setSpecifyReason("");
  }

  function submitHandler() {
    const formData = new FormData();
    formData.append("empId", session ?? "");
    // @ts-ignore
    formData.append("leaveType", LEAVE_TYPE_INDEX[leaveType]);
    formData.append(
      "fromDate",
      leaveType === 3
        ? new Intl.DateTimeFormat("en-IN").format(date)
        : new Intl.DateTimeFormat("en-IN").format(range.startDate)
    );
    formData.append(
      "toDate",
      leaveType === 3
        ? ""
        : new Intl.DateTimeFormat("en-IN").format(range.endDate)
    );
    // formData.append("continue", "0");
    formData.append("reason", leaveType === 3 ? "" : specifyReason);
    formData.append(
      "header",
      leaveType === 3 ? "" : reasonForLeave?.toString() ?? ""
    );
    formData.append("responsible", tempOversight.toString());
    formData.append("file", file);
    // @ts-ignore
    formData.append("dayType", DAY_TYPE_INDEX[dayType]);
    mutate(formData);
  }

  // const applyLeave = () => {
  //   const isValidated = validation();
  //   if (!isValidated) return;

  //   const formData = new FormData();
  //   formData.append("empId", session);
  //   formData.append("leaveType", leaveType);
  //   formData.append(
  //     "fromDate",
  //     leaveType === "PL" || leaveType === "RH" ? selected : startDate
  //   );
  //   formData.append("toDate", endDate);
  //   formData.append("continue", "0");
  //   formData.append("reason", leaveType === "PL" ? "" : reason!);
  //   formData.append("header", leaveType === "PL" ? "" : header?.toString()!);
  //   formData.append(
  //     "responsible",
  //     responsible?.toString() as unknown as string
  //   );
  //   // formData.append("file", file);

  //   authenticateLeave(formData);

  //   showApplyDialog();
  // };

  return (
    <>
      <Layout style={styles.leaveContainer}>
        <Text style={styles.title}>Leave Type</Text>
        <Layout style={styles.cardContainer}>
          <RadioGroup
            selectedIndex={leaveType}
            onChange={(index) => {
              setLeaveType(index);
            }}
          >
            <Radio>Casual Leave</Radio>
            <Radio>Medical Leave</Radio>
            {/* <Radio>Restricted Holiday</Radio>
            <Radio>Parental Leave</Radio> */}
          </RadioGroup>
        </Layout>
        <Divider />
      </Layout>

      <Layout style={styles.leaveContainer}>
        <Text style={styles.title}>Day Type</Text>
        <Layout style={styles.cardContainer}>
          <RadioGroup
            selectedIndex={dayType}
            onChange={(index) => setDayType(index)}
          >
            <Radio>Full Day</Radio>
            <Radio>Half Day</Radio>
          </RadioGroup>
        </Layout>
        <Divider />
      </Layout>

      <Layout style={styles.leaveContainer}>
        <Text style={styles.title}>Select Date</Text>
        <Layout style={styles.cardContainer}>
          {leaveType === 3 ? (
            <Datepicker
              min={new Date()}
              date={date}
              onSelect={(selectedDate) => setDate(selectedDate)}
            />
          ) : (
            <RangeDatepicker
              min={new Date()}
              style={{ flex: 1 }}
              range={range}
              onSelect={(nextRange) => setRange(nextRange)}
            />
          )}
        </Layout>
        <Divider />
      </Layout>

      {leaveType !== 3 && (
        <Layout style={styles.leaveContainer}>
          <Text style={styles.title}>Reason for Leave</Text>
          <Layout style={styles.cardContainer}>
            <View style={styles.picker}>
              <Picker
                selectedValue={reasonForLeave}
                onValueChange={(itemValue, itemIndex) =>
                  setReasonForLeave(itemValue)
                }
              >
                {reasons?.map((reason) => (
                  <Picker.Item
                    label={reason.header}
                    value={reason.id}
                    key={reason.id}
                  />
                ))}
              </Picker>
            </View>
          </Layout>
          <Divider />
        </Layout>
      )}

      {leaveType !== 3 && (
        <Layout style={styles.leaveContainer}>
          <Text style={styles.title}>Specify Reason</Text>
          <Layout style={styles.cardContainer}>
            <Input
              style={styles.fullWidth}
              placeholder="Place your Text"
              value={specifyReason}
              onChangeText={(nextValue) => setSpecifyReason(nextValue)}
            />
          </Layout>
          <Divider />
        </Layout>
      )}

      <Layout style={styles.leaveContainer}>
        <Text style={styles.title}>Document</Text>
        <Layout style={styles.cardContainer}>
          <DocumentFilePicker setFile={setFile} />
        </Layout>
        <Divider />
      </Layout>

      <Layout style={styles.leaveContainer}>
        <Text style={styles.title}>Temporary Oversight</Text>
        <Layout style={styles.cardContainer}>
          <View style={styles.picker}>
            <Picker
              selectedValue={tempOversight}
              onValueChange={(itemValue, itemIndex) =>
                setTempOversight(itemValue)
              }
            >
              {temporaryOversights?.map((emp) => (
                <Picker.Item
                  label={emp.label}
                  value={emp.value}
                  key={emp.value}
                />
              ))}
            </Picker>
          </View>
        </Layout>
        <Divider />
      </Layout>

      {isPending ? (
        <LoadingButton>Loading...</LoadingButton>
      ) : (
        <Button onPress={submitHandler}>Apply Leave</Button>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingBottom: 20,
  },
  leaveContainer: {
    gap: 10,
    paddingTop: 20,
  },
  title: {
    fontWeight: "700",
  },
  fullWidth: {
    flex: 1,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 5,
  },
});
