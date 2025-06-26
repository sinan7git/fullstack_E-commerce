import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { useContext, useMemo } from 'react';
import { UserContext } from '../App';

const baseURL = 'http://127.0.0.1:8001/';

const useAxios = () => {
  const { userData, updateUserData } = useContext(UserContext);

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

        const decodedToken = jwt_decode(userData.access);
        const isExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < 1;

        // If token is still valid, just attach it
        if (!isExpired) {
          req.headers.Authorization = `Bearer ${userData.access}`;
          return req;
        }

        // If token is expired, try to refresh
        if (!userData.refresh) {
          console.error('No refresh token available');
          localStorage.removeItem('user_data');
          updateUserData({ type: 'LOGOUT' });
          window.location.href = '/login';
          throw new Error('Refresh token not available');
        }

        try {
          const response = await axios.post(`${baseURL}api/v1/auth/token/refresh/`, {
            refresh: userData.refresh,
          });

          const newAccessToken = response.data.access;
          const updatedUserData = { ...userData, access: newAccessToken };

          // Save new token
          localStorage.setItem('user_data', JSON.stringify(updatedUserData));
          updateUserData({ type: 'LOGIN', payload: updatedUserData });

          // Attach new token to request
          req.headers.Authorization = `Bearer ${newAccessToken}`;
          return req;
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('user_data');
          updateUserData({ type: 'LOGOUT' });
          window.location.href = '/login';
          throw error;
        }
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [userData, updateUserData]);

  return axiosInstance;
};

export default useAxios;
