import axios from "axios";
import Cookies from "js-cookie";

let refreshCounter = 0;

const api = axios.create({
  headers: {
    "Content-type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      // @ts-ignore
      config.headers["Authorization"] = "Bearer " + token;
      // @ts-ignore
      config.headers["X-CSRFToken"] = Cookies.get("csrftoken");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 && !error.config.url.includes("/token/refresh")) {
      if (refreshCounter > 3) {
        refreshCounter = 0;
        // redirect to login page
        window.location.href = "/login?redirect=" + window.location.pathname;
        return Promise.reject(error);
      }
      refreshCounter++;
      // refresh the token
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        return api
          .post("/auth/token/refresh/", {
            refresh: refreshToken,
          })
          .then(({ data }) => {
            api.defaults.headers.common["Authorization"] = "Bearer " + data.access;
            Cookies.set("accessToken", data.access);
            return api(error.config);
          })
          .catch((err) => {
            // redirect to login page
            // window.location.href = "/login";
            return Promise.reject(error);
          });
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
