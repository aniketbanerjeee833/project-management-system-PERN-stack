import axios, {AxiosError} from 'axios';
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (err: AxiosError<{ success: boolean; message: string }>) => {
    const backendMessage = err.response?.data?.message;
 
    if (backendMessage) {
      // Replace axios generic message with actual backend message
      return Promise.reject(new Error(backendMessage));
    }
 
    return Promise.reject(err);
  }
);
export default api;