import axios from "axios";

const baseURL = "https://vigo-api.azurewebsites.net";
const apiManager = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
});
const updateToken = (newToken) => {
  token = newToken;
};

export const login = async (phone, firebaseToken) => {
  try {
    const requestData = {
      firebaseToken:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZGZmNzhhMGJkZDVhMDIyMTIwNjM0OTlkNzdlZjRkZWVkMWY2NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlnby1hNzc1NCIsImF1ZCI6InZpZ28tYTc3NTQiLCJhdXRoX3RpbWUiOjE2OTA0ODExNzUsInVzZXJfaWQiOiJtZmdWbUprM3RRTXVaVlFJSk1qWGFSdm4xVUsyIiwic3ViIjoibWZnVm1KazN0UU11WlZRSUpNalhhUnZuMVVLMiIsImlhdCI6MTY5MDQ4MTE3NSwiZXhwIjoxNjkwNDg0Nzc1LCJwaG9uZV9udW1iZXIiOiIrODQ4MjkzOTk5NTciLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis4NDgyOTM5OTk1NyJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.O_0k8BGazNIb8ZX-__uEC2bwDBx-IdIXczQIF7V7T2iPxxx2II1gxy3A5odcKJu8hQfRJ02bkGkFqisWsvDJ8kQmvZI99AN3-1CvWF5RMZ99boiH9bj4KZYlNuX5_BJkOtQ6_Y72TdxV9bdmBQPEkzFokqlvc8KD5pVxyOSX6x03YtxZGThjYiMiTcS-b-YPEp4o3IBboqI_Y9ILCe6QImw0xAvN4jOiNYY9IDih_VCyuQ-MjAMUJX1-yrBp1HZNl_A9vL6_s68yLVdN3fE9pP9btygen7vyJE8j6XJImJC90mSHTtuptdtZuVGgJEwP3Vqtlr474wAis4hQtwTu0w",
      phone: "+84829399957",
      role: "DRIVER"
    };
    const response = await axios.post(
      `${baseURL}/api/Authenticate/Mobile/Login`,
      requestData
    );
    const newToken = response.data.token;
    updateToken(newToken); // Update the token value
    console.log("Login successful!");
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
  }
};
apiManager.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiManager;
