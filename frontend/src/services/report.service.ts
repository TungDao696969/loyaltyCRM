import axiosInstance from '@/lib/axios';

export const reportService = {
  getDashboardReport: async () => {
    const res = await axiosInstance.get('/reports/dashboard');
    return res.data.data;
  }
};
