import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as AuthActions from "./auth.actions";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
  registered?: string

}

const handleAuthentication = (resData) => {
  const experationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  return new AuthActions.Authenticate(
    {
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expirationDate: new Date(resData.expiresIn)
    });
}

const handleError = errorResponse => {
  let errorMessage = "A unkown error occured";
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
  return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {

  authSignUp = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      mergeMap((signupAction: AuthActions.SignupStart) => {
        return this.authService.signup({...signupAction.payload}).pipe(
          tap(resData => {
            this.authService.writeToLocalStore(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
          }),
          map(resData => {
            return handleAuthentication(resData);
          }),
          catchError(errorResponse => {
            return handleError(errorResponse);
          })
        )
      })
    )
  })

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem("userData"))

        if (!userData) {
          return {type: 'DUMMY'}
        }

        if (userData._token) {
          return new AuthActions.Authenticate({
            email: userData.email,
            userId: userData.id,
            token: userData._token,
            expirationDate: new Date(userData._tokenExpirationDate)
          })
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration)
        }
        return {type: 'DUMMY'}
      }))

  })


  authLogout = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();
        this.authService.removeFromLocalStore();
        this.router.navigate(["/auth"]).then();
      })
    )
  }, {dispatch: false});

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      mergeMap((authData: AuthActions.LoginStart) => {
        const body = {...authData.payload, returnSecureToken: true};
        return this.authService.login({...authData.payload})
          .pipe(
            tap(resData => {
              this.authService.writeToLocalStore(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }),
            map(resData => {
              return handleAuthentication(resData);
            }),
            catchError(errorResponse => {
              return handleError(errorResponse);
            })
          );
      }));
  });

  authRedirect = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(["/"]).then();
        })
      )
    },
    {dispatch: false}
  )

  constructor(private actions$: Actions, private httpClient: HttpClient, private router: Router, private authService: AuthService) {
  }
}
