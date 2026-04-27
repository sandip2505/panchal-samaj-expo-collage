import api from './api.service';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/loginMember', credentials);
    if (response.data.success && response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(response.data.user || response.data.member));
    }
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
  },

  getUserData: async () => {
    const data = await SecureStore.getItemAsync('userData');
    return data ? JSON.parse(data) : null;
  },

  isLoggedIn: async () => {
    const token = await SecureStore.getItemAsync('userToken');
    return !!token;
  },

  resetPassword: async (email: string) => {
    const response = await api.post('/reset-password', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post('/verifyOtp', { email, otp });
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await api.post('/change-password', data);
    return response.data;
  },
};

export default authService;
