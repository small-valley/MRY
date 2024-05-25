export interface GetInstructorResponse {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  isActive: boolean;
  hourType: "full" | "part" | "contract";
  periods: UserCapabilityTime[];
  capabilities: UserCapabilityDay[];
  courses: UserCapabilityCourse[];
}

interface UserCapabilityTime {
  id?: string;
  name: string;
}

interface UserCapabilityDay {
  id?: string;
  name: string;
}

interface UserCapabilityCourse {
  id?: string;
  name: string;
  color: string;
  program: Program;
}

interface Program {
  name: string;
}
