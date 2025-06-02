export interface IAuthData {
  UUID: string;
  empID: string;
  deviceName: string;
}

export interface IAuthenticateApplyLeaveData {
  leaveDays: number;
  LWPDays: number;
  infix: number;
  prefix: number;
  suffix: number;
  message: string;
  status: TStatus;
  otpKey: number;
}

export type TStatus = "error" | "success";

export interface IInitialData {
  notification?: Array<string>;
  coordinates: {
    name: string;
    landmark: string;
    lat1: string;
    long1: string;
    lat2: string;
    long2: string;
    lat3: string;
    long3: string;
    lat4: string;
    long4: string;
  };
  personal: {
    name: string;
  };
  loginTime: string;
  out: 1 | 0;
  dateTime: {
    serverTime: Date;
  };
  isPunchedIn: 1 | 0;
  isPunchedOut: 1 | 0;
  status: TStatus;
  attendanceTime: {
    date: string;
    time: string;
    inTime: string;
    outTime: string;
    attendanceMarkerIn: string;
    attendanceMarkerOut: string;
  };
}

export interface IAttendanceParam {
  event: 1 | 0;
  outdoor: 0 | 1;
  UUID: string;
  reason?: string;
}

export type Leave = {
  appliedDate: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: string;
  status: string;
  rejectionReason: string | null;
  pdfUrl: string;
  leaveHeader: string;

  //   {
  //     "appliedDate": "2024-06-18T00:00:00.000Z",
  //     "startDate": "2024-06-19",
  //     "endDate": "2024-06-20",
  //     "reason": "Ihhhjk",
  //     "leaveType": "CL",
  //     "status": "APPROVED",
  //     "rejectionReason": null,
  //     "leaveHeader": " Illness",
  //     "document": null
  // }
};
export interface ILeaveHistory {
  data: Leave[];
  message?: string;
  status: "success" | "error";
  parentalLeave: {
    startDate: Date;
    endDate: Date;
    leaveType: string;
    status: string;
  }[];
}

export type Attendance = {
  location: string;
  punchIn: string | null;
  punchInOutdoor: string | null;
  punchOut: string | null;
  punchOutOutdoor: string | null;
  attendanceDate: string;
};
