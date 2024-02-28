export class ApiResponseModel<T> {
  constructor(
    private status: number,
    private data: T,
    private errorMessage: string,
  ) {}
  
  public static success<T>(status: number, data: T): ApiResponseModel<T> {
    return new ApiResponseModel<T>(status, data, null);
  }

  public static error<T>(status: number, errorMessage: string): ApiResponseModel<T> {
    return new ApiResponseModel<T>(status, null, errorMessage);
  }
}