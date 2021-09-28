import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FIREBASE_AUTH} from "../../../API_KEYS";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";

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
  user = new BehaviorSubject<User>(null)
  private tokenExpirationTimer: any;


  constructor(private httpClient: HttpClient, private router: Router) {
  }

  signup(credentials: { email: string, password: string }) {
    const body = {...credentials, returnSecureToken: true}
    return this.httpClient.post<AuthResponseData>(this.SIGN_UP_BASE_URL + FIREBASE_AUTH, body).
    pipe(
      catchError(err => this.handleError(err)),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      })
    )
  }

  login(credentials: { email: string, password: string }) {
    const body = {...credentials, returnSecureToken: true}
    return this.httpClient.post<AuthResponseData>(this.LOGIN_IN_BASE_URL + FIREBASE_AUTH, body).
    pipe(catchError(err => this.handleError(err)),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      }))
  }

  logout() {
    console.log("LOGOUT")
    localStorage.removeItem("userData");
    this.user.next(null);
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(["/auth"]);

  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const experationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, experationDate)
    this.user.next(user);
    this.autoLogout(expiresIn*1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem("userData"))
    if(!userData) {
      return
    }
    const user = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

    if (user.token) {
      this.user.next(user);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }


  }

  private handleError(errorResponse: HttpErrorResponse) {
      let errorMessage = "A unkown error occured";
      if (!errorResponse.error || !errorResponse.error.error) {
        return throwError(errorMessage);
      }
      switch (errorResponse.error.error.message) {
        case "EMAIL_EXISTS":
          errorMessage = "This email exists already"
          break;
        case "INVALID_PASSWORD":
          errorMessage = "Invalid Password"
          break;
        case "EMAIL_NOT_FOUND":
          errorMessage = "Email was not found"
          break;
      }
      return throwError(errorMessage);
    }


}
