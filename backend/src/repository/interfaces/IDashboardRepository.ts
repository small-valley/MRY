import { DashboardModel } from "../models/dashboard.model";

export interface IDashboardRepository {
  getDashboard(): Promise<DashboardModel[]>;
}
