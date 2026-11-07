import axios from "axios";

const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL
});

// Automatically attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("Token exists:", Boolean(token));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "Authorization attached:",
      Boolean(config.headers.Authorization)
    );

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;