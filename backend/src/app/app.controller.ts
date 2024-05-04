import { BaseResponse } from "../../../shared/models/responses/baseResponse";
export class AppController {
  constructor() {}

  ok<T>(data: T): BaseResponse<T> {
    return this.base(data, 200);
  }

  created(): BaseResponse<null> {
    return this.base(null, 201);
  }

  private base<T>(data: T, statusCode: number): BaseResponse<T> {
    return {
      data: data,
      hasError: false,
      statusCode: statusCode,
      message: "",
    };
  }
}
