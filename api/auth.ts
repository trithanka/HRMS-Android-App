import { API } from ".";
import { IAuthData } from "./api.types";

export const authenticateEmployee = async ({
  UUID,
  empID,
  deviceName,
}: IAuthData) => {
  const respond = await API.post("/auth/authenticate", {
    empID,
    UUID,
    deviceName,
  });
  return respond.data;
};
