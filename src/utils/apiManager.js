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
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZGZmNzhhMGJkZDVhMDIyMTIwNjM0OTlkNzdlZjRkZWVkMWY2NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlnby1hNzc1NCIsImF1ZCI6InZpZ28tYTc3NTQiLCJhdXRoX3RpbWUiOjE2OTAzODI1ODUsInVzZXJfaWQiOiI3WEFRWXB4SHhtZmVENXEyOG9YTFNub3JYMk8yIiwic3ViIjoiN1hBUVlweEh4bWZlRDVxMjhvWExTbm9yWDJPMiIsImlhdCI6MTY5MDM4MjU4NSwiZXhwIjoxNjkwMzg2MTg1LCJwaG9uZV9udW1iZXIiOiIrODQ4MjkzOTk5NTciLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis4NDgyOTM5OTk1NyJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.cPVxi0XwPYSF06rDuF8i7JTc8T8NLOIqQjdzZ7zT9rhyn8Eg7GYv4fgRPPZ750pL1mRa9dpjw9Wr-gOiLUJFcUoByvdg7bvCas6RU9xGBY96obz1mUSWWqw4WLTIqxMhfDzM21SwLqeZxSrxCbEHadA-H8wbUoj1nX1karfZP_dtzetjGO1TGED587qokbNfCEQTSi43_ClovX6A2P2lmlQ3uLcK5MwNX3pffhU6Wo9KReUVvrpmHFx0bEmN_poyR0vb9pYUd6i0JqIR37zXlWFxJrQPbNpAbH1zTHp-kBuSuqaFtE7kiPEbCANI1GNq8nIUefBtjijUVQyDlLZC2w",
      phone: "+84829399957",
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
