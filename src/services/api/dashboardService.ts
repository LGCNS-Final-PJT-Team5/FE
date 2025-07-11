import api from '../../lib/axios';
import { DashboardResponse, DrivingReportResponse } from "../../types/dashboard";

class DashboardService {
  async registerDashboard(): Promise<void> {
      await api.post('/dashboard/total')
  }

  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get('/dashboard/total');
    return response.data;
  }
  
  async getDrivingReport(): Promise<DrivingReportResponse> {
    const response = await api.get('/dashboard/total/report');
    return response.data;
  }
}

export const dashboardService = new DashboardService();