import {HttpStatus, ServerResponse} from "./server-response";

export class BadRequestResponse implements ServerResponse {
    public httpStatus: HttpStatus = 'BAD_REQUEST';
    public exceptionMsg: string;
    public exceptionCode:  string;

}