import {User} from "../user.model";
import * as fromAuth from "./auth.actions";

export interface AuthState {
  user: User,
  authError: string,
  loading: boolean
}


const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false
}

export function authReducer(state: AuthState = initialState, action: fromAuth.AuthActions) {
  switch (action.type) {
    case fromAuth.AUTHENTICATE_SUCCESS:
      const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
      return {
        ...state,
        user: user,
        authError: null,
        loading: false
      };
    case fromAuth.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case fromAuth.LOGIN_START:
    case fromAuth.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case fromAuth.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    case fromAuth.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      }

    default:
      return state;
  }

}
