import { Availability } from "../enums/availability.enum";

export interface AvailableInstructorModel {
  availability: Availability;
  user_id: string;
  avatar_url: string;
  first_name: string;
}

export interface AvailableRoomModel {
  id: string;
  name: string;
  floor: number;
}
