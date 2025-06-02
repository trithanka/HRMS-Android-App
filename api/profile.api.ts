import { API } from ".";
import { IInitialData } from "./api.types";

export async function fetchProfile(empId: string): Promise<any> {
  const response = await API.post("/employee/empDetail", { empId });
  return response.data;
}

export async function fetchInitialData(empId: string): Promise<IInitialData> {
  const response = await API.post("/load/loader", { empId });
  return response.data;
}
