import {
  NbPasswordStrategyModule,
  NbAuthStrategyOptions,
  NbPasswordStrategyReset,
  NbPasswordStrategyToken,
  NbAuthSimpleToken,
  NbPasswordStrategyMessage,
} from "@nebular/auth";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { getDeepFromObject } from "@nebular/auth/helpers";

export class NbPasswordAuthStrategyOptions extends NbAuthStrategyOptions {
  name: string;
  baseEndpoint?= "/api/auth/";
  login?: boolean | NbPasswordStrategyModule = {
    alwaysFail: false,
    endpoint: "login",
    method: "post",
    requireValidToken: false,
    redirect: {
      success: "/",
      failure: null,
    },
    defaultErrors: [
      "Login/Email combination is not correct, please try again.",
    ],
    defaultMessages: ["You have been successfully logged in."],
  };
  register?: boolean | NbPasswordStrategyModule = {
    alwaysFail: false,
    endpoint: "register",
    method: "post",
    requireValidToken: false,
    redirect: {
      success: "/",
      failure: null,
    },
    defaultErrors: ["Something went wrong, please try again."],
    defaultMessages: ["You have been successfully registered."],
  };
  requestPass?: boolean | NbPasswordStrategyModule = {
    endpoint: "forget-password",
    method: "post",
    redirect: {
      success: "/",
      failure: null,
    },
    defaultErrors: ["Something went wrong, please try again."],
    defaultMessages: [
      "Reset password instructions have been sent to your email.",
    ],
  };
  resetPass?: boolean | NbPasswordStrategyReset = {
    endpoint: "reset-pass",
    method: "put",
    redirect: {
      success: "/",
      failure: null,
    },
    resetPasswordTokenKey: "reset_password_token",
    defaultErrors: ["Something went wrong, please try again."],
    defaultMessages: ["Your password has been successfully changed."],
  };
  logout?: boolean | NbPasswordStrategyReset = {
    alwaysFail: false,
    endpoint: "logout",
    method: "delete",
    redirect: {
      success: "/",
      failure: null,
    },
    defaultErrors: ["Something went wrong, please try again."],
    defaultMessages: ["You have been successfully logged out."],
  };
  refreshToken?: boolean | NbPasswordStrategyModule = {
    endpoint: "refresh-token",
    method: "post",
    requireValidToken: false,
    redirect: {
      success: null,
      failure: null,
    },
    defaultErrors: ["Something went wrong, please try again."],
    defaultMessages: ["Your token has been successfully refreshed."],
  };
  token?: NbPasswordStrategyToken = {
    class: NbAuthSimpleToken,
    key: "data.token",
    getter: (
      module: string,
      res: HttpResponse<Object>,
      options: NbPasswordAuthStrategyOptions
    ) => getDeepFromObject(res.body, options.token.key),
  };
  errors?: NbPasswordStrategyMessage = {
    key: "data.errors",
    getter: (
      module: string,
      res: HttpErrorResponse,
      options: NbPasswordAuthStrategyOptions
    ) =>
      getDeepFromObject(
        res.error,
        options.errors.key,
        options[module].defaultErrors
      ),
  };
  messages?: NbPasswordStrategyMessage = {
    key: "data.messages",
    getter: (
      module: string,
      res: HttpResponse<Object>,
      options: NbPasswordAuthStrategyOptions
    ) =>
      getDeepFromObject(
        res.body,
        options.messages.key,
        options[module].defaultMessages
      ),
  };
  validation?: {
    password?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
    email?: {
      required?: boolean;
      regexp?: string | null;
    };
    fullName?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
  };
}
