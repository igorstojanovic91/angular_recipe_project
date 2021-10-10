import {Injectable} from '@angular/core';
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import {AppState} from "../store/app.reducer";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  ROUTE_URL = 'https://ng-course-recipe-book-4477d-default-rtdb.europe-west1.firebasedatabase.app/'
  RECIPES_ENDPOINT = 'recipes.json'

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,) {
  }

  addIngredientsToShippingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.ROUTE_URL + this.RECIPES_ENDPOINT)
  }

  storeRecipes(recipes: Recipe[]) {
    return this.http.put(this.ROUTE_URL + this.RECIPES_ENDPOINT, recipes)
  }


}
