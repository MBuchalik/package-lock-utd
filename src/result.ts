export type Result<TSuccess = undefined> =
  | SuccessResult<TSuccess>
  | ErrorResult;

export type SuccessResult<T = undefined> = T extends undefined
  ? SuccessResultWithOptionalData<T>
  : SuccessResultWithData<T>;

export interface SuccessResultWithOptionalData<T> {
  success: true;
  data?: T;
}
export interface SuccessResultWithData<T> {
  success: true;
  data: T;
}

export interface ErrorResult {
  success: false;
}
