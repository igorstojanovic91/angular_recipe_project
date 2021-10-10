import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as RecipesActions from './recipe.actions'
import {map, mergeMap, switchMap, withLatestFrom} from "rxjs/operators";
import {RecipeService} from "../recipe.service";
import {Injectable} from "@angular/core";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      mergeMap(() => {
        return this.recipeService.fetchRecipes().pipe(
          map(recipes => {
            return recipes.map(recipe => {
              return {
                ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          }),
          map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
          })
        );
      })
    );
  })

  storeRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
          return this.recipeService.storeRecipes(recipesState.recipes);
        }
      ))
  }, {dispatch: false})

  constructor(private actions$: Actions, private recipeService: RecipeService, private store: Store<AppState>) {
  }
}
