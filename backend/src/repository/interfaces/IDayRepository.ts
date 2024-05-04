import { DayModel } from "../models/day.model";

export interface IDayRepository {
  getDay(dayId: string): Promise<DayModel | null>;
  getDays(): Promise<DayModel[]>;
}
