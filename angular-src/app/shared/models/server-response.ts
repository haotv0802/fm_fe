export interface ServerResponse {
    httpStatus: HttpStatus;
}
export type HttpStatus = 'OK' | 'BAD_REQUEST';