import { API } from ".";
import { IAuthenticateApplyLeaveData, ILeaveHistory } from "./api.types";

export async function fetchAvailableLeaves(empId: string): Promise<{
  leaves: {
    casualLeave: number;
    sickLeave: number;
    parentalLeave: number;
  };
  message?: string;
  status: string;
}> {
  const response = await API.post("/leave/leaves/check", {
    empId,
  });
  return response.data;
}

export async function fetchLeavesHeader() {
  const response = await API.post("/leave/leaves/header");
  return response.data;
}

export async function applyLeave(
  params: any
): Promise<IAuthenticateApplyLeaveData> {
  const response = await API.post("/leave/leaves/apply", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getLeaveHistory({
  empId,
  startDate,
  endDate,
  month,
  week,
  curDate,
  status,
}: {
  empId: string;
  startDate?: string; //"2024-06-11"
  endDate?: string;
  month?: string; // "2024-06"
  week?: string;
  curDate?: string;
  status?: string | null;
}): Promise<ILeaveHistory> {
  const response = await API.post("/leave/leaves/applied", {
    empId,
    startDate,
    endDate,
    month,
    week,
    curDate,
    status,
  });
  return response.data;
}
