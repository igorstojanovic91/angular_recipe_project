import { Injectable } from '@angular/core';
import {Recipe} from "./recipe.model";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe("Pad Thai",
      "Amazing Pad Thai",
      "https://janinaandfood.com/wp-content/uploads/2020/06/B1044FC1-7EEE-478F-8FAE-664FD46555BF-4AE233AB-7532-45B8-9E8A-E7DC36AA06A3-min-1-1060x1059.jpg"),
    new Recipe("Another Pad Thai",
      "Another Amazing Pad Thai",
      "https://janinaandfood.com/wp-content/uploads/2020/06/B1044FC1-7EEE-478F-8FAE-664FD46555BF-4AE233AB-7532-45B8-9E8A-E7DC36AA06A3-min-1-1060x1059.jpg")
  ];

  constructor() { }

  get recipeList() {
    return this.recipes.slice();
  }
}
