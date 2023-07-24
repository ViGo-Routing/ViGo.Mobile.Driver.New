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
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImIyZGZmNzhhMGJkZDVhMDIyMTIwNjM0OTlkNzdlZjRkZWVkMWY2NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmlnby1hNzc1NCIsImF1ZCI6InZpZ28tYTc3NTQiLCJhdXRoX3RpbWUiOjE2OTAyMDk5MzgsInVzZXJfaWQiOiI3WEFRWXB4SHhtZmVENXEyOG9YTFNub3JYMk8yIiwic3ViIjoiN1hBUVlweEh4bWZlRDVxMjhvWExTbm9yWDJPMiIsImlhdCI6MTY5MDIwOTkzOCwiZXhwIjoxNjkwMjEzNTM4LCJwaG9uZV9udW1iZXIiOiIrODQ4MjkzOTk5NTciLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIis4NDgyOTM5OTk1NyJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.ehb8HZGgOAMGxy8rSUTIJX_ZFPki5KvqBW4mgTTZzQVy-XFOBn-38lOPSC2gBmgWroRkPHy3dgfrPtPUo-1R8YtAVnqpMEQt1Ttn-OVacF06xHLHCBhPAgOed3jXsg8WAFgz8VTYNiXZv-EvvlhQF8a5_Zt5TjB66fU13FshzSvgE6-W56fE4Gfc6yLVZFDCTUKQneFNg3QQyPxEoEwROhMptM2Kga7MOuymgZtZ2w5iC9IxoyGItdLjrfcAg4LZKDmpQgWoE6YcAjbXZjYmRNsyJW61gud0_gGDJ1fZiAjqnvfoiR67hrHLBojHqTwp6LNzRsPBVIQvJYH5RH8sQQ",
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
