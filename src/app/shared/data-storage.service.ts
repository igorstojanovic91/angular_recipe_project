import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  ROUTE_URL = 'https://ng-course-recipe-book-4477d-default-rtdb.europe-west1.firebasedatabase.app/'
  RECIPES_ENDPOINT = 'recipes.json'

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
  }

  storeRecipes() {
    this.http.put(this.ROUTE_URL + this.RECIPES_ENDPOINT, this.recipeService.recipeList)
      .subscribe(
        response => console.log(response),
        error => console.log(error)
      )
  }

  fetchRecieps() {
   return this.http.get<Recipe[]>(this.ROUTE_URL + this.RECIPES_ENDPOINT)
     .pipe(
       map(recipes => {
         return recipes.map(recipe => {
           return {
             ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
           }
         })
       }),
       tap(recipes => {
         this.recipeService.recipeList = recipes;
       })
     )

  }


}
