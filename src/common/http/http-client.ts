import Axios from 'axios';

const defaultBaseURL = process.env.NEXT_PUBLIC_API_URL;

export const createAxiosInstance = (baseURL = defaultBaseURL) => {
  return Axios.create({
    baseURL,
    timeout: 90000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
