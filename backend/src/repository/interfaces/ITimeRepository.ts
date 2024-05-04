import { TimeModel } from "../models/time.model";

export interface ITimeRepository {
  getTimeById(timeId: string): Promise<TimeModel | null>;
  getTimes(): Promise<TimeModel[]>;
}
