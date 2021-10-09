import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {map, take} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.store.select('auth').pipe(
      take(1),
      map(authtate => authtate.user),
      map(user => {
        const isAuth = !!user
        if (isAuth) {
          return true;
        } else {
          return this.router.createUrlTree(["/auth"]);
        }
      })
    )
  }

}
