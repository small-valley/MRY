import { DashboardModel } from "../models/dashboard.model";

export interface IDashboardRepository {
  getDashboard(userId?: string): Promise<DashboardModel[]>;
}
