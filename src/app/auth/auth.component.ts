import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions"

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  storeSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {

    this.storeSub = this.store.select("auth").subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    let authObs: Observable<AuthResponseData>
    this.error = null;
    this.isLoading = true;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({...authForm.value}))
    } else {
      this.store.dispatch(new AuthActions.SignupStart({...authForm.value}))
    }
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError())
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
