import { ApiProperty } from "@nestjs/swagger";
import { PostSigninRequest } from "../../../../../shared/models/requests/postSigninRequest";
import { PostSignupRequest } from "../../../../../shared/models/requests/postSignupRequest";

export class SigninDto implements PostSigninRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class SignupDto implements PostSignupRequest {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
