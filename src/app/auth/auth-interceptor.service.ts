import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {exhaustMap, map, take} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private store: Store<AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.store.select('auth')
      .pipe(
        take(1),
        map(authState => authState.user),
        exhaustMap(user => { // SWITCHES TO HTTP OBSERVABLE
          if (!user) {
            return next.handle(req);
          }
          let modifiedRequest = req.clone({params: new HttpParams().set("auth", user.token)});
          return next.handle(modifiedRequest);
        })
      );
  }
}
