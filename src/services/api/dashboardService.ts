import api from '../../lib/axios';
import { DashboardResponse } from "../../types/dashboard";

class DashboardService {
  async registerDashboard(): Promise<void> {
      await api.post('/dashboard/total')
  }
  // async registerDashboard(): Promise<void> {
  //   await api.post(
  //     '/dashboard/total',
  //     {},
  //     {
  //       headers: {
  //         'X-User-Id': 18
  //       },
  //     }
  //   );
  // }

  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get('/dashboard/total');
    return response.data;
  }
  // async getDashboard(): Promise<DashboardResponse> {
  //   const response = await api.get('/dashboard/total', {
  //     headers: {
  //       'X-User-Id': 1
  //     },
  //   });
  //   return response.data;
  // }

}

export const dashboardService = new DashboardService();