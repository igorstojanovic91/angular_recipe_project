import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {map} from "rxjs/operators";
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipesAction from "../recipes/store/recipe.actions"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated = false;


  constructor(
    private store: Store<AppState>
  ) {
  }


  ngOnInit() {
    this.userSub = this.store.select('auth')
      .pipe(
        map(authState => authState.user)
      )
      .subscribe(user => {
        this.isAuthenticated = !!user;
      })
  }

  onSaveData() {
    this.store.dispatch(new RecipesAction.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesAction.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout())
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }


}
