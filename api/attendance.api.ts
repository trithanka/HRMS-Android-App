import { API } from ".";
import { Attendance, IAttendanceParam } from "./api.types";

export async function postAttendance(data: IAttendanceParam) {
  const response = await API.post("/attendance/attendance", data);
  return response.data;
}

export async function fetchAttendance(data: {
  startDate?: string; //"2024-06-14"
  endDate?: string; // "2024-06-14"
  empCode?: string;
  month?: string; //"2024-06"
  curDate?: string;
  week?: string;
}): Promise<{
  data: Attendance[];
  status: "success" | "error";
  message?: string;
}> {
  const response = await API.post("/attendance/get", data);
  return response.data;
}
