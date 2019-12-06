import {Injectable} from '@angular/core';

@Injectable()
export class Constants {

  public LANGUAGE: string = "en";

  public readonly HOST = 'http://localhost:8880/fm-be/svc';
  public readonly LOGIN_SERVICE_URL: string = this.HOST + '/login';

  // Toaster types
  public readonly TOASTER_SUCCESS: string = "success";
  public readonly TOASTER_ERROR: string = "error";

  // Messages services
  public readonly COMMON_MESSAGES_SERVICE_URL = this.HOST + "/messages";
  // public readonly ADMIN_MESSAGES_SERVICE_URL = this.HOST + "/admin/messages";
  // public readonly CUSTOMER_MESSAGES_SERVICE_URL = this.HOST + "/customer/messages";

  // HTTP Status
  public readonly HTTP_STATUS_OK: number = 200;
  public readonly HTTP_STATUS_NO_CONTENT: number = 204;
  public readonly HTTP_STATUS_BAD_REQUEST: number = 400;
  public readonly HTTP_STATUS_UNAUTHORIZED: number = 401;

  //  Expenses
  public readonly EXPENSES_SERVICE_URL: string = this.HOST + '/expenses';
  public readonly EXPENSES_DETAILS_SERVICE_URL: string = this.HOST + '/expensesDetails';
  public readonly EXPENSES_PREVIOUS_SERVICE_URL: string = this.HOST + '/previousExpensesDetails';

  //  Event Expenses
  public readonly EVENT_EXPENSES_SERVICE_URL: string = this.HOST + '/eventExpenses';

  // Payment methods || Cards information
  public readonly PAYMENT_METHODS_SERVICE_URL: string = this.HOST + '/paymentMethods';

  // Constants
  public readonly X_AUTH_TOKEN_HEADER: string = "X-AUTH-TOKEN";
  public readonly AUTH_TOKEN: string = "AUTH_TOKEN";
  public readonly AUTHORITY: string = "AUTHORITY";
  public readonly AUTHORITY_ADMIN: string = "ADMIN";
  public readonly AUTHORITY_CUSTOMER: string = "CUSTOMER";

  // Names of Components
  public readonly WELCOME_URL: string = 'welcome';

}