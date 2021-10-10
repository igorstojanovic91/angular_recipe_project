import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Recipe} from "./recipe.model";
import {RecipeService} from "./recipe.service";
import * as RecipesAction from "./store/recipe.actions";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";
import {map, mergeMap, take} from "rxjs/operators";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<AppState>, private recipeService: RecipeService, private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select("recipes").pipe(
      take(1),
      map(recipeState => {
        return recipeState.recipes;
      }),
      mergeMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesAction.FetchRecipes());
          return this.actions$.pipe(ofType(RecipesAction.SET_RECIPES), take(1));
        } else {
          return of(recipes);
        }

      })
    )
  }
}
