export interface BaseResponse<T> {
    data: T;
    hasError: boolean;
    statusCode: number;
    message: string;
}
