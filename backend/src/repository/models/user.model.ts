export interface UserModel {
  id: string;
  email: string;
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

export interface UserAuthenticationModel {
  userId: string;
  email: string;
  role: string;
  password: string;
}

export interface OauthUserModel {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface OneUserModel {
  userId: string;
  accessToken: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
}
