import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://employee-leave-management-backend-qqodtdesw.vercel.app',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export default axiosInstance;
