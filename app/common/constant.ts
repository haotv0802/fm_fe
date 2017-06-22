import {Injectable} from '@angular/core';

@Injectable()
export class Constants {

  public LANGUAGE: string = "en";

  public readonly HOST = 'http://localhost:8880/ht-be/svc';
  public readonly LOGIN_SERVICE_URL: string = this.HOST + '/login';

  // Toaster types
  public readonly TOASTER_SUCCESS: string = "success";
  public readonly TOASTER_ERROR: string = "error";

  // Messages services
  public readonly COMMON_MESSAGES_SERVICE_URL = this.HOST + "/messages";
  public readonly ADMIN_MESSAGES_SERVICE_URL = this.HOST + "/admin/messages";
  public readonly CUSTOMER_MESSAGES_SERVICE_URL = this.HOST + "/customer/messages";

  // HTTP Status
  public readonly HTTP_STATUS_OK: number = 200;
  public readonly HTTP_STATUS_NO_CONTENT: number = 204;
  public readonly HTTP_STATUS_BAD_REQUEST: number = 400;
  public readonly HTTP_STATUS_UNAUTHORIZED: number = 401;

  ////      Services URLs for Admin
  //  Users (for Admin)
  public readonly ADMIN_USERS_SERVICE_URL: string = this.HOST + '/admin/users';
  public readonly ADMIN_USERS_ROLES_UPDATE_SERVICE_URL: string = this.HOST + '/admin/users/usersRolesUpdate';

  //  Roles (for Admin)
  public readonly ADMIN_ROLES_SERVICE_URL: string = this.HOST + '/admin/roles';
  public readonly ADMIN_ROLES_KEYVALUE_SERVICE_URL: string = this.HOST + '/admin/roles/keyValuePair';

  //  Rooms
  public readonly ADMIN_ROOMS_ROOM_TYPES_SERVICE_URL: string = this.HOST + '/admin/rooms/roomTypes';
  public readonly ADMIN_ROOMS_ROOM_TYPE_UPDATE_SERVICE_URL: string = this.HOST + '/admin/rooms/roomTypes/update';

  //  Images (for Admin)
  public readonly ADMIN_IMAGES_SERVICE_URL: string = this.HOST + '/admin/images';
  public readonly ADMIN_IMAGE_UPDATE_SERVICE_URL: string = this.HOST + `/admin/images/updateImageInfo`;
  //  Individuals (for Admin)
  public readonly ADMIN_INDIVIDUALS_SERVICE_URL: string = this.HOST + '/admin/individuals';
  public readonly ADMIN_INDIVIDUALS_WITH_PAGING_SERVICE_URL: string = this.HOST + '/admin/individuals/paging';
  public readonly ADMIN_INDIVIDUALS_COUNT_SERVICE_URL: string = this.HOST + '/admin/individuals/count';
  public readonly ADMIN_INDIVIDUALS_USERNAME_CHECK_SERVICE_URL: string = this.HOST + '/admin/individuals/isUserNameExisting';

  // Services URLs for Staff
  // Services URLs for Customer

  // Constants
  public readonly X_AUTH_TOKEN_HEADER: string = "X-AUTH-TOKEN";
  public readonly AUTH_TOKEN: string = "AUTH_TOKEN";
  public readonly AUTHORITY: string = "AUTHORITY";
  public readonly AUTHORITY_ADMIN: string = "ADMIN";
  public readonly AUTHORITY_CUSTOMER: string = "CUSTOMER";

  // Names of Components
  public readonly WELCOME_URL: string = 'welcome';

}