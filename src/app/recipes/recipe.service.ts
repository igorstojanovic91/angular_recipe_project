import {Injectable} from '@angular/core';
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [
    new Recipe("Pad Thai",
      "Amazing Pad Thai",
      "https://janinaandfood.com/wp-content/uploads/2020/06/B1044FC1-7EEE-478F-8FAE-664FD46555BF-4AE233AB-7532-45B8-9E8A-E7DC36AA06A3-min-1-1060x1059.jpg",
      [
        new Ingredient('Dried Noodle', 1),
        new Ingredient("Carrots", 2)
      ]),
    new Recipe("Another Pad Thai",
      "Another Amazing Pad Thai",
      "https://janinaandfood.com/wp-content/uploads/2020/06/B1044FC1-7EEE-478F-8FAE-664FD46555BF-4AE233AB-7532-45B8-9E8A-E7DC36AA06A3-min-1-1060x1059.jpg",
      [
        new Ingredient('Fresh Noodle', 1),
        new Ingredient("Shallots", 2)
      ])
  ];

  constructor(private shoppingListService: ShoppingListService) {
  }

  get recipeList() {
    return this.recipes.slice();
  }

  addIngredientsToShippingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipeById(id: number): Recipe {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe)
    this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice())
  }


}
