import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { useContext, useMemo } from 'react';
import { UserContext } from '../App';

const baseURL = 'http://127.0.0.1:8001/';

const useAxios = () => {
  const { userData, setUserData } = useContext(UserContext);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
    });

    instance.interceptors.request.use(
      async (req) => {
        if (!userData || !userData.access) {
          console.error('No user data or access token available');
          throw new Error('No access token');
        }

        const user = jwt_decode(userData.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
          req.headers.Authorization = `Bearer ${userData.access}`;
          return req;
        }

        if (!userData.refresh) {
          console.error('No refresh token available');
          localStorage.removeItem('user_data');
          setUserData(null);
          window.location.href = '/login';
          throw new Error('Refresh token not available');
        }

        try {
          const response = await axios.post(`${baseURL}api/v1/auth/token/refresh/`, {
            refresh: userData.refresh,
          });
          const newAccessToken = response.data.access;

          localStorage.setItem(
            'user_data',
            JSON.stringify({ ...userData, access: newAccessToken })
          );
          setUserData({ ...userData, access: newAccessToken });

          req.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('user_data');
          setUserData(null);
          window.location.href = '/login';
          throw error;
        }

        return req;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [userData, setUserData]);

  return axiosInstance;
};

export default useAxios;
