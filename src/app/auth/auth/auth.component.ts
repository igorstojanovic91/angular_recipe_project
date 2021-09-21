import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
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
      authObs = this.authService.login(authForm.value);
    } else {
      authObs = this.authService.signup(authForm.value);
    }

    authObs.subscribe(
      (responseData: AuthResponseData) => {
        this.isLoading = false;
        this.router.navigate(["/recipes"]);
        authForm.reset();
      },
      errorMessage => {
        console.log(errorMessage)
        this.error = errorMessage;
        this.isLoading = false;
      }
    )
  }
}
