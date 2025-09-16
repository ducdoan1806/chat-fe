import axios from "axios";
import { AccessTokenCookie } from "./token";

const key = import.meta.env.VITE_KEY;
const baseURL =
  location.hostname === "localhost"
    ? import.meta.env.VITE_API_URL
    : "http://" + location.hostname + ":8000/";
const api = axios.create({
  baseURL: baseURL,
});
// Thêm request interceptor để ghi lại thời gian bắt đầu
api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() }; // Ghi lại thời gian bắt đầu
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Thêm response interceptor để ghi lại thời gian kết thúc và tính toán thời gian xử lý
api.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime; // Tính thời gian xử lý
    console.log(`Request to ${response.config.url} took ${duration} ms`);
    return response;
  },
  (error) => {
    const endTime = new Date();
    const duration = error.config?.metadata?.startTime
      ? endTime - error.config.metadata.startTime
      : null; // Tính thời gian xử lý nếu metadata có sẵn
    if (duration !== null) {
      console.error(
        `Request to ${error.config.url} failed, took ${duration} ms`
      );
    } else {
      console.error(
        `Request to ${error.config.url} failed, but start time wasn't recorded.`
      );
    }

    // Xử lý lỗi timeout và báo lỗi phù hợp
    if (error.code === "ECONNABORTED") {
      console.error(`Request to ${error.config.url} timed out`);
    } else if (error.response) {
      // Lỗi khi nhận được phản hồi từ server
      console.error(
        `Error fetching data from ${error.config.url}:`,
        error.response.data
      );
    } else {
      // Lỗi khác (kết nối mạng, không thể gửi yêu cầu)
      console.error("Error fetching data:", error.message);
    }
    return Promise.reject(error);
  }
);
const get = async (url, controller = null) => {
  try {
    const token = AccessTokenCookie.get();
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        ApplicationKey: key,
      },
      signal: controller,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};
const gets = async (url, headers) => {
  try {
    const response = await api.get(url, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

// Hàm POST kèm theo token
const post = async (url, data) => {
  try {
    const token = AccessTokenCookie.get();
    const response = await api.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        ApplicationKey: key,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};

// Hàm PATCH kèm theo token
const patch = async (url, data) => {
  try {
    const token = AccessTokenCookie.get();
    const response = await api.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        ApplicationKey: key,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error patching data", error);
    throw error;
  }
};

// Hàm DELETE kèm theo token
const deleteRequest = async (url) => {
  try {
    const token = AccessTokenCookie.get();
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        ApplicationKey: key,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting data", error);
    throw error;
  }
};

const setError = (error) => {
  return (
    JSON.stringify(error?.response?.data || error?.message) ||
    "An error occurred"
  );
};
export default {
  get,
  gets,
  post,
  patch,
  delete: deleteRequest,
  setError,
};
