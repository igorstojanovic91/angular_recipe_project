import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FIREBASE_AUTH} from "../../API_KEYS";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions"

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
  registered?: string

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  SIGN_UP_BASE_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  LOGIN_IN_BASE_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
  private tokenExpirationTimer: any;

  constructor(private httpClient: HttpClient, private router: Router, private store: Store<AppState>) {
  }

  signup(credentials: { email: string, password: string }) {
    const body = {...credentials, returnSecureToken: true}
    return this.httpClient.post<AuthResponseData>(this.SIGN_UP_BASE_URL + FIREBASE_AUTH, body);
  }

  login(credentials: { email: string, password: string }) {
    return this.httpClient.post<AuthResponseData>(this.LOGIN_IN_BASE_URL + FIREBASE_AUTH, {
      ...credentials,
      returnSecureToken: true
    })
  }

  removeFromLocalStore() {
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }

  writeToLocalStore(email: string, userId: string, token: string, expiresIn: number) {
    const experationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, experationDate)
    this.setLogoutTimer(expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout())
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

}
