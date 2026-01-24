// ! src/utils/ApiResponse.ts

export class ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data?: T | undefined;

  constructor(
    message: string,
    success: boolean = true,
    status: number,
    data?: T | undefined
  ) {
    this.message = message;
    this.status = status;
    this.success = success;
    this.data = data;
  }


  static success<T>(data: T, status: number = 200, message: string = "Success"): ApiResponse<T> {
    return new ApiResponse<T>(message, true, status, data);
  }
}
