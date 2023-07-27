import jwtDecode from "jwt-decode";
import { getData, getString, setData, setString } from "./storageUtils";

export const isValidToken = async () => {
  const token = await getString("token");
  if (!token) {
    return false;
  }

  var isValid = false;

  var decodedToken = jwtDecode(token ? token : "");
  var dateNow = new Date();

  if (
    decodedToken &&
    decodedToken.exp &&
    decodedToken.exp > dateNow.getTime() / 1000
  ) {
    isValid = true;
  } else {
    await setString("token", "");
  }

  return isValid;
};
