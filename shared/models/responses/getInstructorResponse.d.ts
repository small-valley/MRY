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
  name: string;
}

interface UserCapabilityDay {
  name: string;
}

interface UserCapabilityCourse {
  name: string;
  color: string;
  program: Program;
}

interface Program {
  name: string;
}
